(function () {
  const STORAGE_KEY = "prioriza-tool-data";

  const LEVELING_FNS = {
    min: { sortDir: "asc", label: "Menor valor \u21d2 mayor prioridad" },
    max: { sortDir: "desc", label: "Mayor valor \u21d2 mayor prioridad" }
  };

  function computeLocalLevels(values, fnId) {
    const fn = LEVELING_FNS[fnId] || LEVELING_FNS.min;
    const nums = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
    const sorted = fn.sortDir === "asc"
      ? [...nums].sort((x, y) => x - y)
      : [...nums].sort((x, y) => y - x);
    const map = {};
    let level = 1;
    sorted.forEach((v, i) => {
      if (i > 0 && v !== sorted[i - 1]) level++;
      map[v] = level;
    });
    return map;
  }

  function computeAllLevels(table) {
    const levels = {};
    table.aspects.forEach((a) => {
      levels[a.id] = computeLocalLevels(
        table.elements.map(e => e.values[a.id]),
        a.leveling
      );
    });
    return levels;
  }

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
    return { version: "0.2", tables: [] };
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

  const emptyDiv = document.querySelector("#tool-empty");
  const tableDiv = document.querySelector("#tool-table");
  const tableName = document.querySelector("#table-name");
  const pthead = document.querySelector("#ptable-head");
  const ptbody = document.querySelector("#ptable-body");
  const toolResults = document.querySelector("#tool-results");
  const btnNewTable = document.querySelector("[data-new-table]");
  const btnImport = document.querySelector("[data-import]");
  const btnExport = document.querySelector("[data-export]");
  const btnReset = document.querySelector("[data-reset]");
  const importInput = document.querySelector("#import-input");

  function init() {
    bindGlobalActions();
    if (getCurrentTable()) {
      renderToolTable(getCurrentTable());
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
    renderToolTable(table);
    showTable();
  }

  function showEmpty() {
    emptyDiv.style.display = "block";
    tableDiv.style.display = "none";
  }

  function showTable() {
    emptyDiv.style.display = "none";
    tableDiv.style.display = "block";
  }

  function rerender() {
    const table = getCurrentTable();
    if (table) renderToolTable(table);
  }

  function renderToolTable(table) {
    const levels = computeAllLevels(table);
    const results = computeResults(table, levels);

    renderTableHead(table);
    renderTableBody(table, levels, results);
    renderResultsBelow(results, table);

    document.querySelector("#add-aspect").onclick = function () { addAspect(); };
    document.querySelector("#add-element").onclick = function () { addElement(); };
  }

  function computeResults(table, levels) {
    return table.elements.map((e) => {
      let total = 0;
      const contribs = {};
      table.aspects.forEach((a) => {
        const num = parseFloat(e.values[a.id]);
        const val = isNaN(num) ? null : num;
        let ll = 0;
        if (val !== null && levels[a.id] && levels[a.id][val] !== undefined) {
          ll = levels[a.id][val];
        }
        contribs[a.id] = { raw: val, localLevel: ll, contribution: ll * a.aspectPriorityLevel };
        total += ll * a.aspectPriorityLevel;
      });
      return { element: e, contribs, total };
    }).sort((x, y) => x.total - y.total);
  }

  function renderTableHead(table) {
    const cells = ['<th class="col-elem">Elemento</th>'];
    table.aspects.forEach((a, i) => {
      const fn = LEVELING_FNS[a.leveling] || LEVELING_FNS.min;
      cells.push(
        '<th class="col-aspect">' +
          '<div class="aspect-config">' +
            '<input class="ac-name" value="' + esc(a.name || "Aspecto") + '" data-idx="' + i + '">' +
            '<select class="ac-fn" data-idx="' + i + '">' +
              '<option value="min"' + (a.leveling === "min" ? " selected" : "") + '>Menor valor \u21d2 mayor prioridad</option>' +
              '<option value="max"' + (a.leveling === "max" ? " selected" : "") + '>Mayor valor \u21d2 mayor prioridad</option>' +
            '</select>' +
            '<label class="ac-apl-label">NPA <input class="ac-apl" type="number" min="1" max="9" value="' + (a.aspectPriorityLevel || 1) + '" data-idx="' + i + '"></label>' +
            '<button class="ac-remove" data-idx="' + i + '" title="Eliminar aspecto">&times;</button>' +
          '</div>' +
        '</th>'
      );
    });
    cells.push('<th class="col-total">Total</th>');
    cells.push('<th class="col-remove"></th>');
    pthead.innerHTML = '<tr>' + cells.join('') + '</tr>';

    pthead.querySelectorAll(".ac-name").forEach((inp) => {
      inp.addEventListener("input", function () {
        const table = getCurrentTable();
        if (!table) return;
        const idx = parseInt(this.dataset.idx);
        if (table.aspects[idx]) table.aspects[idx].name = this.value;
        saveState();
        renderToolTable(table);
      });
    });
    pthead.querySelectorAll(".ac-fn").forEach((sel) => {
      sel.addEventListener("change", function () {
        const table = getCurrentTable();
        if (!table) return;
        const idx = parseInt(this.dataset.idx);
        if (table.aspects[idx]) table.aspects[idx].leveling = this.value;
        saveState();
        renderToolTable(table);
      });
    });
    pthead.querySelectorAll(".ac-apl").forEach((inp) => {
      inp.addEventListener("change", function () {
        const table = getCurrentTable();
        if (!table) return;
        const idx = parseInt(this.dataset.idx);
        if (table.aspects[idx]) table.aspects[idx].aspectPriorityLevel = parseInt(this.value) || 1;
        saveState();
        renderToolTable(table);
      });
    });
    pthead.querySelectorAll(".ac-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const table = getCurrentTable();
        if (!table) return;
        const idx = parseInt(this.dataset.idx);
        removeAspect(idx);
      });
    });
  }

  function renderTableBody(table, levels, results) {
    ptbody.innerHTML = "";
    table.elements.forEach((e, ei) => {
      const tr = document.createElement("tr");
      const result = results.find(r => r.element.id === e.id);

      tr.appendChild(createElemCell(e, table));

      table.aspects.forEach((a) => {
        tr.appendChild(createValueCell(e, a, levels, table));
      });

      tr.appendChild(createTotalCell(result));
      tr.appendChild(createRemoveElemCell(ei));

      ptbody.appendChild(tr);
    });
  }

  function createElemCell(element, table) {
    const td = document.createElement("td");
    td.className = "cell-elem";
    const inp = document.createElement("input");
    inp.className = "elem-input";
    inp.type = "text";
    inp.placeholder = "Nombre";
    inp.value = element.name || "";
    inp.addEventListener("input", function () {
      element.name = this.value;
      saveState();
      renderToolTable(table);
    });
    td.appendChild(inp);
    return td;
  }

  function createValueCell(element, aspect, levels, table) {
    const td = document.createElement("td");
    td.className = "cell-value";
    const inp = document.createElement("input");
    inp.className = "val-input";
    inp.type = "text";
    inp.placeholder = "\u2014";
    inp.value = element.values[aspect.id] !== undefined ? element.values[aspect.id] : "";
    inp.addEventListener("input", function () {
      element.values[aspect.id] = this.value;
      saveState();
      renderToolTable(table);
    });
    td.appendChild(inp);

    const num = parseFloat(element.values[aspect.id]);
    const levelMap = levels[aspect.id];
    if (!isNaN(num) && levelMap && levelMap[num] !== undefined) {
      const lbl = document.createElement("span");
      lbl.className = "cell-level";
      lbl.textContent = "nivel " + levelMap[num];
      td.appendChild(lbl);
    }
    return td;
  }

  function createTotalCell(result) {
    const td = document.createElement("td");
    td.className = "cell-total";
    if (result) {
      const totalSpan = document.createElement("span");
      totalSpan.className = "total-val";
      totalSpan.textContent = result.total;
      td.appendChild(totalSpan);
    }
    return td;
  }

  function createRemoveElemCell(ei) {
    const td = document.createElement("td");
    td.className = "cell-remove";
    const btn = document.createElement("button");
    btn.className = "btn-icon btn-remove-elem";
    btn.textContent = "\u00d7";
    btn.title = "Eliminar elemento";
    btn.addEventListener("click", function () { removeElement(ei); });
    td.appendChild(btn);
    return td;
  }

  function renderResultsBelow(results, table) {
    if (!results.length) {
      toolResults.innerHTML = "";
      return;
    }
    const topResults = results.filter(r => r.total === results[0].total);

    let currentRank = 1;
    const rankHtml = results.map((r, idx) => {
      const rank = idx > 0 && r.total === results[idx - 1].total ? currentRank : (currentRank = idx + 1);
      const isPriority1 = rank === 1;

      const aspectRows = table.aspects.map(a => {
        const c = r.contribs[a.id];
        const rawStr = c.raw !== null ? c.raw : "\u2014";
        const fnLabel = (LEVELING_FNS[a.leveling] || LEVELING_FNS.min).label;
        return '<div class="ta-row">' +
          '<span class="ta-aspect">' + esc(a.name) + '</span>' +
          '<span class="ta-raw">' + rawStr + '</span>' +
          '<span class="ta-fn">' + fnLabel + '</span>' +
          '<span class="ta-level">nivel ' + c.localLevel + '</span>' +
          '<span class="ta-npa">NPA ' + a.aspectPriorityLevel + '</span>' +
          '<span class="ta-contrib">= ' + c.contribution + '</span>' +
        '</div>';
      }).join("");

      return '<div class="trace-card' + (isPriority1 ? ' trace-p1' : '') + '">' +
        '<div class="tc-header">' +
          '<span class="tc-rank">#' + rank + '</span>' +
          '<strong class="tc-elem">' + esc(r.element.name) + '</strong>' +
          '<span class="tc-total"><strong>' + r.total + '</strong></span>' +
        '</div>' +
        '<div class="tc-aspects">' + aspectRows + '</div>' +
        '<div class="tc-explain">' +
          (isPriority1
            ? (topResults.length > 1
              ? "Comparte el primer lugar: revisa si es necesario agregar otro aspecto para desempatar."
              : "Menor total de la tabla. Encabeza la estructura de prioridad.")
            : "Total parcial superior al del primer lugar.")
        + '</div>' +
      '</div>';
    }).join("");

    const tieHtml = topResults.length > 1
      ? '<div class="tie-badge"><strong>Empate:</strong> ' + topResults.map(r => esc(r.element.name)).join(", ") + ' empatan en el primer lugar con ' + topResults[0].total + ' puntos cada uno.</div>'
      : '<div class="tie-badge no-tie"><strong>Prioridad 1:</strong> ' + esc(results[0].element.name) + ' encabeza con ' + results[0].total + ' puntos (total m\u00e1s bajo).</div>';

    toolResults.innerHTML =
      '<h3 class="tr-heading">Estructura de prioridad</h3>' +
      '<div class="tr-summary">' + tieHtml + '</div>' +
      '<div class="tr-traces">' + rankHtml + '</div>';
  }

  function addAspect() {
    const table = getCurrentTable();
    if (!table) return;
    const newA = { id: generateId(), name: "Aspecto " + (table.aspects.length + 1), leveling: "min", aspectPriorityLevel: 1 };
    table.aspects.push(newA);
    table.elements.forEach((e) => { e.values[newA.id] = ""; });
    saveState();
    renderToolTable(table);
  }

  function addElement() {
    const table = getCurrentTable();
    if (!table) return;
    const newEl = { id: generateId(), name: "Elemento " + (table.elements.length + 1), values: {} };
    table.aspects.forEach((a) => { newEl.values[a.id] = ""; });
    table.elements.push(newEl);
    saveState();
    renderToolTable(table);
  }

  function removeAspect(idx) {
    const table = getCurrentTable();
    if (!table) return;
    const removed = table.aspects.splice(idx, 1)[0];
    if (removed) {
      table.elements.forEach((e) => { delete e.values[removed.id]; });
    }
    saveState();
    renderToolTable(table);
  }

  function removeElement(idx) {
    const table = getCurrentTable();
    if (!table) return;
    table.elements.splice(idx, 1);
    saveState();
    renderToolTable(table);
  }

  function esc(s) {
    const d = document.createElement("div");
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
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
            renderToolTable(getCurrentTable());
            showTable();
          } else {
            showEmpty();
          }
        } else {
          alert("El archivo no contiene datos v\u00e1lidos de Prioriza.");
        }
      } catch (err) {
        alert("No se pudo leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
    importInput.value = "";
  }

  function resetAll() {
    if (!confirm("\u00bfReiniciar todos los datos? Esta acci\u00f3n no se puede deshacer.")) return;
    state = { version: "0.2", tables: [] };
    saveState();
    showEmpty();
  }

  tableName.addEventListener("input", () => {
    const table = getCurrentTable();
    if (table) {
      table.name = tableName.value;
      saveState();
    }
  });

  init();
})();
