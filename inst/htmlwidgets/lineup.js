(function () {
  function assign(target, source1, source2) {
    for (var key in source1) {
      target[key] = source1[key];
    }
    if (source2) {
      return assign(target, source2);
    }
    return target;
  }

  const lineup = {
    name: 'lineup',
    type: 'output',

    crossTalk: function(data) {
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
        e.value.forEach(function(key) {
          if (key2index.has(key)) {
            indices.push(key2index.get(key));
          }
        });
        data.setSelection(indices);
      });

      const arrayEquals = function(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        return a.every(function(ai, i) {
          return ai === b[i];
        });
      };

      data.on('selectionChanged.crosstalk', function(indices) {
        const keys = indices.map(function(index) {
          return index2key.get(index);
        }).sort();
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
          const included = new Set(e.value.map(function(d) {
            return key2index.get(d);
          }));
          data.setFilter(function(d) {
            return included.has(d.i);
          });
        }
      });
      data.on('orderChanged.crosstalk', function(_oldOrder, newOrder) {
        const keys = newOrder.length === data.getTotalNumberOfRows() ? [] : newOrder.map(function(d) {
          return index2key.get(d);
        }).sort();
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

      return function(group, key) {
        selectionHandle.setGroup(group);
        filterHandle.setGroup(group);
        key2index.clear();
        index2key.clear();

        key.forEach(function(k, i) {
          key2index.set(k, i);
          index2key.set(i, k);
        });
      };
    },

    toCols: function(names, descs) {
      const cols = names.map(function(d) {
        const desc = descs[d];
        // R Shiny transform 1 element arrays to primitive values
        if (desc.type === 'categorical' && typeof desc.categories === 'string') {
          desc.categories = [desc.categories];
        }
        return desc;
      });
      LineUpJS.deriveColors(cols);
      return cols;
    },

    pushRanking: function(data, ranking) {
      const r = LineUpJS.buildRanking();
      const asArray = function(v) {
        return Array.isArray(v) ? v : (v ? [v] : []);
      };
      const defs = ranking.defs;
      asArray(ranking.columns).forEach(function(col) {
        if (defs.hasOwnProperty(col)) {
          r.column(defs[col]);
        } else {
          r.column(col);
        }
      });
      asArray(ranking.sortBy).forEach(function(s) {
        return r.sortBy(s);
      });
      asArray(ranking.groupBy).forEach(function(s) {
        return r.groupBy(s);
      });
      return r.build(data);
    },

    factory: function(el, width, height) {
      const that = this;
      el.style.width = width;
      el.style.height = height;
      el.style.position = 'relative';
      el.style.overflow = 'auto';
      el.style.lineHeight = 'normal'; // for bootstrap

      const unsupportedBrowser = !window.LineUpJS || (LineUpJS.isBrowserSupported === 'function' && !LineUpJS.isBrowserSupported());

      if (unsupportedBrowser) {
        el.classList.add('lu-unsupported-browser');
        el.innerHTML = '<span>unsupported browser detected</span>' +
          '<div class="lu-unsupported-browser-hint">' +
          '<a href="https://www.mozilla.org/en-US/firefox/" rel="noopener" target="_blank" data-browser="firefox" data-version="' + ((window.LineUpJS && LineUpJS.SUPPORTED_FIREFOX_VERSION) || 57) + '"></a>' +
          '<a href="https://www.google.com/chrome/index.html" rel="noopener" target="_blank" data-browser="chrome" data-version="' + ((window.LineUpJS && LineUpJS.SUPPORTED_CHROME_VERSION) || 64) + '" title="best support"></a>' +
          '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge" rel="noopener" target="_blank" data-browser="edge" data-version="' + ((window.LineUpJS && LineUpJS.SUPPORTED_EDGE_VERSION) || 16) + '"></a>' +
          '</div><span>use the <code>ignoreUnsupportedBrowser=true</code> option to ignore this error at your own risk</span>';
      }


      var data = null;
      var lineup = null;
      var crossTalk = null;

      return {
        renderValue: function(x) {
          if (unsupportedBrowser) {
            return;
          }
          const rows = HTMLWidgets.dataframeToD3(x.data);

          // update data
          if (!data) {
            data = new LineUpJS.LocalDataProvider(rows, that.toCols(x.colnames, x.cols), {
              filterGlobally: x.options.filterGlobally,
              multiSelection: !x.options.singleSelection,
              maxGroupColumns: x.options.noCriteriaLimits ? Infinity : 1,
              maxNestedSortingCriteria: x.options.noCriteriaLimits ? Infinity : 1
            });
          } else {
            data.clearColumns();
            that.toCols(x.colnames, x.cols).forEach(function(desc) {
              return data.pushDesc(desc);
            });
            data.setData(rows);
          }

          const rankings = Object.keys(x.rankings).sort();
          if (rankings.length === 0 || (rankings.length === 1 && !x.rankings[rankings[0]])) {
            data.deriveDefault();
          } else {
            rankings.forEach(function(ranking) {
              return that.pushRanking(data, x.rankings[ranking]);
            });
          }

          // update cross talk
          if (x.crosstalk.group && x.crosstalk.key) {
            if (!crossTalk) {
              crossTalk = that.crossTalk(data);
            }
            crossTalk(x.crosstalk.group, x.crosstalk.key);
          }

          if (lineup) {
            lineup.destroy();
          }
          const options = assign({}, x.options, {
            sidePanel: x.options.sidePanel !== false,
            sidePanelCollapsed: x.options.sidePanel === 'collapsed'
          });
          if (that.name === 'taggle') {
            lineup = new LineUpJS.Taggle(el, data, options);
          } else {
            lineup = new LineUpJS.LineUp(el, data, options);
          }
        },

        resize: function(width, height) {
          el.style.width = width;
          el.style.height = height;
          if (lineup) {
            lineup.update();
          }
        }

      };
    }
  };

  HTMLWidgets.widget(lineup);
  HTMLWidgets.widget(assign({}, lineup, {name: 'taggle'}));
})();

