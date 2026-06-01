(function () {
  const STORAGE_KEY = "prioriza-tool-data";
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.tables && Array.isArray(parsed.tables)) {
          return parsed;
        }
      }
    } catch (e) {}
    return { version: "0.1", tables: [] };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function getCurrentTable() {
    if (!state.tables.length) return null;
    return state.tables[0];
  }

  function setCurrentTable(table) {
    if (!state.tables.length) {
      state.tables.push(table);
    } else {
      state.tables[0] = table;
    }
  }

  let uiState = { aspectCount: 0, elementCount: 0 };

  const el = (sel) => document.querySelector(sel);
  const elAll = (sel) => document.querySelectorAll(sel);

  const emptyDiv = el("#tool-empty");
  const tableDiv = el("#tool-table");
  const tableName = el("#table-name");
  const aspectList = el("#aspect-list");
  const elementHeader = el("#element-header");
  const elementBody = el("#element-body");
  const resultsSection = el("#results-section");
  const resultBody = el("#result-body");
  const resultTies = el("#result-ties");
  const resultExplanation = el("#result-explanation");
  const btnCalculate = el("#btn-calculate");
  const btnAddAspect = el("#add-aspect");
  const btnAddElement = el("#add-element");
  const btnNewTable = el("[data-new-table]");
  const btnImport = el("[data-import]");
  const btnExport = el("[data-export]");
  const btnReset = el("[data-reset]");
  const importInput = el("#import-input");

  function init() {
    bindGlobalActions();
    if (getCurrentTable()) {
      loadTableIntoUI(getCurrentTable());
      showTable();
    } else {
      showEmpty();
    }
  }

  function bindGlobalActions() {
    btnNewTable.addEventListener("click", createNewTable);
    btnExport.addEventListener("click", exportData);
    btnImport.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", importData);
    btnReset.addEventListener("click", resetAll);
  }

  function createNewTable() {
    const table = {
      id: generateId(),
      name: "Mi tabla Prioriza",
      aspects: [
        { id: generateId(), name: "Urgencia", leveling: "min", aspectPriorityLevel: 1 },
        { id: generateId(), name: "Impacto", leveling: "max", aspectPriorityLevel: 2 }
      ],
      elements: [
        { id: generateId(), name: "Elemento A", values: {} },
        { id: generateId(), name: "Elemento B", values: {} }
      ]
    };
    table.aspects.forEach((a) => {
      table.elements.forEach((e) => { e.values[a.id] = ""; });
    });
    setCurrentTable(table);
    saveState();
    loadTableIntoUI(table);
    showTable();
  }

  function loadTableIntoUI(table) {
    tableName.value = table.name;
    uiState.aspectCount = table.aspects.length;
    uiState.elementCount = table.elements.length;

    const template = aspectList.querySelector(".aspect-row.template");
    aspectList.querySelectorAll("[data-template]").forEach((el) => el.remove());
    table.aspects.forEach((a) => addAspectRow(a, template));
    renderElementTable(table);
    resultsSection.style.display = "none";
  }

  function addAspectRow(aspect, template) {
    const row = template.cloneNode(true);
    row.classList.remove("template");
    row.removeAttribute("data-template");

    const nameInput = row.querySelector(".aspect-name");
    const levelingSelect = row.querySelector(".aspect-leveling");
    const aplInput = row.querySelector(".aspect-apl");
    const removeBtn = row.querySelector("[data-remove-aspect]");

    if (aspect) {
      nameInput.value = aspect.name || "";
      levelingSelect.value = aspect.leveling || "min";
      aplInput.value = aspect.aspectPriorityLevel || 1;
    }

    removeBtn.addEventListener("click", () => {
      const idx = getAspectIndex(row);
      if (idx > -1) {
        removeAspect(idx);
      }
    });

    nameInput.addEventListener("input", syncAspect);
    levelingSelect.addEventListener("change", syncAspect);
    aplInput.addEventListener("change", syncAspect);

    aspectList.appendChild(row);
  }

  function getAspectIndex(row) {
    const allRows = [...aspectList.querySelectorAll(".aspect-row:not(.template)")];
    return allRows.indexOf(row);
  }

  function syncAspect() {
    const table = getCurrentTable();
    if (!table) return;
    const rows = [...aspectList.querySelectorAll(".aspect-row:not(.template)")];
    rows.forEach((row, i) => {
      if (i < table.aspects.length) {
        const a = table.aspects[i];
        a.name = row.querySelector(".aspect-name").value;
        a.leveling = row.querySelector(".aspect-leveling").value;
        a.aspectPriorityLevel = parseInt(row.querySelector(".aspect-apl").value) || 1;
      }
    });
    saveState();
    renderElementTable(table);
  }

  function removeAspect(idx) {
    const table = getCurrentTable();
    if (!table) return;
    table.aspects.splice(idx, 1);
    table.elements.forEach((e) => {
      const keys = Object.keys(e.values);
      if (idx < keys.length) {
        const key = table.aspects[idx] ? table.aspects[idx].id : null;
        if (key) delete e.values[key];
      }
    });
    saveState();
    loadTableIntoUI(table);
  }

  function renderElementHeader(table) {
    const cells = ['<th>Elemento</th>'];
    table.aspects.forEach((a) => {
      cells.push(`<th>${a.name || "Aspecto"}</th>`);
    });
    cells.push('<th></th>');
    elementHeader.innerHTML = '<tr>' + cells.join('') + '</tr>';
  }

  function renderElementTable(table) {
    renderElementHeader(table);
    elementBody.innerHTML = "";
    table.elements.forEach((e, idx) => renderElementRow(e, idx, table));
    syncElementValueKeys(table);
  }

  function renderElementRow(element, idx, table) {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "element-name-input";
    nameInput.placeholder = "Nombre del elemento";
    nameInput.value = element.name || "";
    nameInput.addEventListener("input", () => {
      element.name = nameInput.value;
      saveState();
    });
    nameTd.appendChild(nameInput);
    tr.appendChild(nameTd);

    table.aspects.forEach((a) => {
      const td = document.createElement("td");
      const valInput = document.createElement("input");
      valInput.type = "text";
      valInput.className = "value-input";
      valInput.placeholder = "—";
      valInput.value = element.values[a.id] !== undefined ? element.values[a.id] : "";
      valInput.addEventListener("input", () => {
        element.values[a.id] = valInput.value;
        saveState();
      });
      td.appendChild(valInput);
      tr.appendChild(td);
    });

    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-icon btn-remove";
    removeBtn.textContent = "\u00d7";
    removeBtn.title = "Eliminar elemento";
    removeBtn.addEventListener("click", () => {
      removeElement(idx);
    });
    actionTd.appendChild(removeBtn);
    tr.appendChild(actionTd);

    elementBody.appendChild(tr);
  }

  function syncElementValueKeys(table) {
    table.elements.forEach((e) => {
      table.aspects.forEach((a) => {
        if (!(a.id in e.values)) {
          e.values[a.id] = "";
        }
      });
    });
  }

  function removeElement(idx) {
    const table = getCurrentTable();
    if (!table) return;
    table.elements.splice(idx, 1);
    saveState();
    loadTableIntoUI(table);
  }

  function addElement() {
    const table = getCurrentTable();
    if (!table) return;
    const newEl = { id: generateId(), name: "Elemento " + (table.elements.length + 1), values: {} };
    table.aspects.forEach((a) => { newEl.values[a.id] = ""; });
    table.elements.push(newEl);
    saveState();
    loadTableIntoUI(table);
  }

  function addAspect() {
    const table = getCurrentTable();
    if (!table) return;
    const newA = { id: generateId(), name: "Aspecto " + (table.aspects.length + 1), leveling: "min", aspectPriorityLevel: 1 };
    table.aspects.push(newA);
    table.elements.forEach((e) => { e.values[newA.id] = ""; });
    saveState();
    loadTableIntoUI(table);
  }

  function showEmpty() {
    emptyDiv.style.display = "block";
    tableDiv.style.display = "none";
  }

  function showTable() {
    emptyDiv.style.display = "none";
    tableDiv.style.display = "block";
  }

  function calculate() {
    const table = getCurrentTable();
    if (!table) return;

    const aspects = table.aspects;
    const elements = table.elements;

    const parsed = elements.map((e) => {
      const vals = {};
      let valid = true;
      aspects.forEach((a) => {
        const raw = e.values[a.id];
        const num = parseFloat(raw);
        vals[a.id] = isNaN(num) ? null : num;
        if (vals[a.id] === null) valid = false;
      });
      return { element: e, values: vals, valid };
    });

    const invalid = parsed.filter((p) => !p.valid);
    if (invalid.length) {
      alert("Completa todos los valores numéricos antes de calcular.");
      return;
    }

    const levels = {};
    aspects.forEach((a) => {
      const vals = parsed.map((p) => p.values[a.id]).filter((v) => v !== null);
      const sorted = a.leveling === "min"
        ? [...vals].sort((x, y) => x - y)
        : [...vals].sort((x, y) => y - x);
      const levelMap = {};
      let level = 1;
      sorted.forEach((v, i) => {
        if (i > 0 && v !== sorted[i - 1]) level++;
        levelMap[v] = level;
      });
      levels[a.id] = levelMap;
    });

    const results = parsed.map((p) => {
      const localLevels = {};
      let total = 0;
      aspects.forEach((a) => {
        const ll = levels[a.id][p.values[a.id]];
        localLevels[a.id] = ll;
        total += ll * a.aspectPriorityLevel;
      });
      return { element: p.element, localLevels, total };
    });

    results.sort((x, y) => x.total - y.total);

    displayResults(results, aspects, table);
  }

  function displayResults(results, aspects, table) {
    resultsSection.style.display = "block";

    const levelKeys = aspects.map((a) => a.id);
    const levelColspan = levelKeys.length;
    const contribColspan = levelKeys.length;

    const headRow = resultBody.parentElement.querySelector("thead tr");
    headRow.innerHTML = `
      <th>Prioridad</th>
      <th>Elemento</th>
      <th>Total</th>
      <th colspan="${levelColspan}">Niveles locales</th>
      <th colspan="${contribColspan}">Contribuciones</th>
    `;

    resultBody.innerHTML = "";
    let currentRank = 1;
    results.forEach((r, idx) => {
      const rank = idx > 0 && r.total === results[idx - 1].total ? currentRank : (currentRank = idx + 1);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="rank-cell">${rank}</td>
        <td><strong>${r.element.name}</strong></td>
        <td class="total-cell">${r.total}</td>
        ${aspects.map((a) => `<td class="level-cell">${r.localLevels[a.id]}</td>`).join('')}
        ${aspects.map((a) => `<td class="contrib-cell">${r.localLevels[a.id] * a.aspectPriorityLevel}</td>`).join('')}
      `;
      resultBody.appendChild(tr);
    });

    const topResults = results.filter((r) => r.total === results[0].total);
    if (topResults.length > 1) {
      resultTies.innerHTML = `
        <div class="tie-badge">
          <strong>Empate detectado:</strong>
          ${topResults.map((r) => r.element.name).join(", ")}
          tienen el mismo total (${topResults[0].total}).
        </div>
      `;
    } else {
      resultTies.innerHTML = `
        <div class="no-tie">
          <strong>Prioridad única:</strong>
          ${results[0].element.name} tiene el total más bajo (${results[0].total}).
        </div>
      `;
    }

    resultExplanation.innerHTML = `
      <h3>Explicación del resultado</h3>
      <p>
        El elemento con menor total tiene la mayor prioridad.
        ${topResults.length > 1
          ? "Hay empate en el primer lugar. Revisa si falta un aspecto para desempatar o si el empate es aceptable."
          : `<strong>${results[0].element.name}</strong> encabeza la estructura con ${results[0].total} puntos.`
        }
      </p>
      <details>
        <summary>Ver desglose por aspecto</summary>
        ${aspects.map((a) => {
          const parts = results.map((r) =>
            `${r.element.name}: nivel ${r.localLevels[a.id]} × NPA ${a.aspectPriorityLevel} = ${r.localLevels[a.id] * a.aspectPriorityLevel}`
          );
          return `<p><strong>${a.name}:</strong> ${parts.join("; ")}.</p>`;
        }).join("")}
      </details>
    `;
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prioriza-tablas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data && data.tables && Array.isArray(data.tables)) {
          state = data;
          saveState();
          if (getCurrentTable()) {
            loadTableIntoUI(getCurrentTable());
            showTable();
          } else {
            showEmpty();
          }
        } else {
          alert("El archivo no contiene datos válidos de Prioriza.");
        }
      } catch (err) {
        alert("No se pudo leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
    importInput.value = "";
  }

  function resetAll() {
    if (!confirm("¿Reiniciar todos los datos? Esta acción no se puede deshacer.")) return;
    state = { version: "0.1", tables: [] };
    saveState();
    showEmpty();
  }

  btnAddAspect.addEventListener("click", addAspect);
  btnAddElement.addEventListener("click", addElement);
  btnCalculate.addEventListener("click", calculate);

  tableName.addEventListener("input", () => {
    const table = getCurrentTable();
    if (table) {
      table.name = tableName.value;
      saveState();
    }
  });

  init();
})();
