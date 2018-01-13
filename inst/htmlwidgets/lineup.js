HTMLWidgets.widget({
  name: 'lineup',
  type: 'output',

  factory: function (el, width, height) {
    el.style.width = width;
    el.style.height = height;
    el.style.position = 'relative';
    el.style.overflow = 'auto';


    let ctx = null;

    const key2index = new Map();
    const index2key = new Map();

    const initCrossTalk = (data, group) => {
      const selectionHandle = new crosstalk.SelectionHandle();
      selectionHandle.setGroup(group);
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
      data.on('selectionChanged', (indices) => {
        const keys = indices.map((index) => index2key.get(index));
        if (keys.length === 0) {
          selectionHandle.clear();
        } else {
          selectionHandle.set(keys);
        }
      });

      const filterHandle = new crosstalk.FilterHandle();
      filterHandle.setGroup(group);
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
      data.on('orderChanged', (oldOrder, newOrder) => {
        if (newOrder.length === data.getTotalNumberOfRows()) {
          // all visible
          filterHandle.clear();
        } else {
          const keys = newOrder.map((d) => index2key.get(d));
          filterHandle.set(keys);
        }
      });

      return {
        selectionHandle: selectionHandle,
        filterHandle: filterHandle
      };
    }

    return {
      renderValue(x) {

        if (!ctx) {
          ctx = {};

        }
        const crosstalk = x.crosstalk;


        console.log('render');
        //const cols = LineUpJS.deriveColors(x.colnames.map(function (c) {
        //  return x.cols[c];
        //}));


        //const rows = HTMLWidgets.dataframeToD3(x.data);
        //data = LineUpJS.createLocalStorage(rows, cols);
        //data.deriveDefault();
        //lineup.changeDataStorage(data);
        //lineup.update();
      },

      resize(width, height) {
        el.style.width = width;
        el.style.height = height;
        if (ctx) {
          ctx.lineup.update();
        }
      }

    };
  }
});
