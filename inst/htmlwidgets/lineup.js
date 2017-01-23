HTMLWidgets.widget({

  name: 'lineup',

  type: 'output',

  factory: function(el, width, height) {

    var data = LineUpJS.createLocalStorage([], []);
    // TODO: define shared variables for this instance
    el.style.width = width;
    el.style.height = height;
    el.style.position = 'relative';
    el.style.overflow = 'auto';
    var lineup = LineUpJS.create(data, el, { body: { renderer: 'canvas'}});
    
    function deriveColumns(dataFrame) {
      return Object.keys(dataFrame).map(function(col) { 
        return {
          type: 'string',
          column: col
        };
      });
    }

    return {

      renderValue: function(x) {
        var rows = HTMLWidgets.dataframeToD3(x.data);
        console.log(rows, x.data);
        console.log(LineUpJS);
        data = LineUpJS.createLocalStorage(rows, deriveColumns(x.data));
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