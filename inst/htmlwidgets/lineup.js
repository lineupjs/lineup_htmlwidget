HTMLWidgets.widget({
  name: 'lineup',
  type: 'output',

  crossTalk(data) {
    const key2index = new Map();
    const index2key = new Map();

    const selectionHandle = new crosstalk.SelectionHandle();
    selectionHandle.on('change', function (e) {
      if (e.sender === selectionHandle) {
        return; // ignore self
      }
      if (!e.value) {
        data.clearSelection();
        return;
      }
      const indices = [];
      e.value.forEach((key) => {
        if (key2index.has(key)) {
          indices.push(key2index.get(key));
        }
      });
      data.setSelection(indices);
    });

    const arrayEquals = (a, b) => {
      if (a.length !== b.length) {
        return false;
      }
      return a.every((ai, i) => ai === b[i]);
    };

    data.on('selectionChanged.crosstalk', (indices) => {
      const keys = indices.map((index) => index2key.get(index)).sort();
      const old = (selectionHandle.value || []).sort();
      if (arrayEquals(keys, old)) {
        return;
      }
      if (keys.length === 0) {
        selectionHandle.clear();
      } else {
        selectionHandle.set(keys);
      }
    });

    const filterHandle = new crosstalk.FilterHandle();
    filterHandle.on('change', function (e) {
      if (e.sender === filterHandle) {
        return;
      }
      if (!e.value) {
        data.setFilter(null);
      } else {
        const included = new Set(e.value.map((d) => key2index.get(d)));
        data.setFilter((d) => included.has(d.i));
      }
    });
    data.on('orderChanged.crosstalk', (oldOrder, newOrder) => {
      const keys = newOrder.length === data.getTotalNumberOfRows() ? [] : newOrder.map((d) => index2key.get(d)).sort();
      const old = (filterHandle.filteredKeys || []).sort();
      if (arrayEquals(keys, old)) {
        return;
      }
      if (keys.length === 0) {
        // all visible
        filterHandle.clear();
      } else {
        filterHandle.set(keys);
      }
    });

    return (group, key) => {
      selectionHandle.setGroup(group);
      filterHandle.setGroup(group);
      key2index.clear();
      index2key.clear();

      key.forEach((k, i) => {
        key2index.set(k, i);
        index2key.set(i, k);
      });
    };
  },

  toCols(names, descs) {
    const cols = names.map((d) => descs[d]);
    LineUpJS.deriveColors(cols);
    return cols;
  },

  pushRanking(data, ranking) {
    const r = LineUpJS.buildRanking();
    const asArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);
    const defs = ranking.defs;
    asArray(ranking.columns).forEach((col) => {
      if (defs.hasOwnProperty(col)) {
        r.column(defs[col]);
      } else {
        r.column(col);
      }
    });
    asArray(ranking.sortBy).forEach((s) => r.sortBy(s));
    asArray(ranking.groupBy).forEach((s) => r.groupBy(s));
    return r.build(data);
  },

  factory(el, width, height) {
    el.style.width = width;
    el.style.height = height;
    el.style.position = 'relative';
    el.style.overflow = 'auto';


    let data = null;
    let lineup = null;
    let crossTalk = null;

    return {
      renderValue: (x) => {
        const rows = HTMLWidgets.dataframeToD3(x.data);

        // update data
        if (!data) {
          data = new LineUpJS.LocalDataProvider(rows, this.toCols(x.colnames, x.cols), {
            filterGlobally: x.options.filterGlobally,
            multiSelection: !x.options.singleSelection,
            maxGroupColumns: x.options.noCriteriaLimits ? Infinity: 1,
            maxNestedSortingCriteria: x.options.noCriteriaLimits ? Infinity: 1
          });
        } else {
          data.clearColumns();
          this.toCols(x.colnames, x.cols).forEach((desc) => data.pushDesc(desc));
          data.setData(rows);
        }

        const rankings = Object.keys(x.rankings).sort();
        if (rankings.length === 0 || (rankings.length === 1 && !x.rankings[rankings[0]])) {
          data.deriveDefault();
        } else {
          rankings.forEach((ranking) => this.pushRanking(data, x.rankings[ranking]));
        }

        // update cross talk
        if (x.crosstalk.group && x.crosstalk.key) {
          if (!crossTalk) {
            crossTalk = this.crossTalk(data);
          }
          crossTalk(x.crosstalk.group, x.crosstalk.key);
        }

        if (lineup) {
          lineup.destroy();
        }
        lineup = new LineUpJS.LineUp(el, data, {
          animated: x.options.animated,
          panel: x.options.sidePanel !== false,
          panelCollapsed: x.options.sidePanel === 'collapsed',
          summary: x.options.summaryHeader
        });
      },

      resize(width, height) {
        el.style.width = width;
        el.style.height = height;
        if (lineup) {
          lineup.update();
        }
      }

    };
  }
});
