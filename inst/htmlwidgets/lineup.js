HTMLWidgets.widget({

  name: 'lineup',

  type: 'output',

  factory: function(el, width, height) {
    el.style.width = width;
    el.style.height = height;
    el.style.position = 'relative';
    el.style.overflow = 'auto';

    var data = LineUpJS.createLocalStorage([], []);
    var lineup = LineUpJS.create(data, el, { body: { renderer: 'canvas'}});

    return {

      renderValue: function(x) {
        var cols = LineUpJS.deriveColors(x.colnames.map(function(c) { return x.cols[c]; }));
        var rows = HTMLWidgets.dataframeToD3(x.data);
        data = LineUpJS.createLocalStorage(rows, cols);
        data.deriveDefault();
        lineup.changeDataStorage(data);
        lineup.update();
      },

      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});