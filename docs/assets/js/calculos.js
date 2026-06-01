var PRIORIZA = PRIORIZA || {};

(function (ns) {
  ns.LEVELING_FNS = {
    min: { sortDir: "asc", label: "Menor valor \u21d2 mayor prioridad" },
    max: { sortDir: "desc", label: "Mayor valor \u21d2 mayor prioridad" }
  };

  ns.computeLocalLevels = function (values, fnId) {
    var fn = ns.LEVELING_FNS[fnId] || ns.LEVELING_FNS.min;
    var nums = values.map(function (v) { return parseFloat(v); }).filter(function (v) { return !isNaN(v); });
    var sorted = fn.sortDir === "asc"
      ? nums.slice().sort(function (x, y) { return x - y; })
      : nums.slice().sort(function (x, y) { return y - x; });
    var map = {};
    var level = 1;
    sorted.forEach(function (v, i) {
      if (i > 0 && v !== sorted[i - 1]) level++;
      map[v] = level;
    });
    return map;
  };

  ns.computeAllLevels = function (table) {
    var levels = {};
    table.aspects.forEach(function (a) {
      levels[a.id] = ns.computeLocalLevels(
        table.elements.map(function (e) { return e.values[a.id]; }),
        a.leveling
      );
    });
    return levels;
  };

  ns.generateId = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  };

  ns.esc = function (s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  };

  ns.computeResults = function (table, levels) {
    return table.elements.map(function (e) {
      var total = 0;
      var contribs = {};
      table.aspects.forEach(function (a) {
        var num = parseFloat(e.values[a.id]);
        var val = isNaN(num) ? null : num;
        var ll = 0;
        if (val !== null && levels[a.id] && levels[a.id][val] !== undefined) {
          ll = levels[a.id][val];
        }
        contribs[a.id] = { raw: val, localLevel: ll, contribution: ll * a.aspectPriorityLevel };
        total += ll * a.aspectPriorityLevel;
      });
      return { element: e, contribs: contribs, total: total };
    }).sort(function (x, y) { return x.total - y.total; });
  };
})(PRIORIZA);
