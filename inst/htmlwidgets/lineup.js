HTMLWidgets.widget({

  name: 'lineup',

  type: 'output',

  factory: function(el, width, height) {

    var data = LineUpJS.createLocalStorage([], []);
    // TODO: define shared variables for this instance
    var lineup = LineUpJS.create(data, el);
    
    function deriveColumns(dataFrame) {
      return dataFrame.map(function(col) { 
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
        data = LineUPJS.createLocalStorage(rows, deriveColumns(x.data));
        lineup.deriveDefault();
        lineup.changeDataStorage(data);
        lineup.update();
      },

      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});