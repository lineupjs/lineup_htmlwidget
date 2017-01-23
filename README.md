LineUp.js as htmlwidget
=======================

LineUp is an interactive technique designed to create, visualize and explore rankings of items based on a set of heterogeneous attributes. 
This is a [htmlwidget](http://www.htmlwidgets.org/) wrapper around the JavaScript library [LineUp.js](https://github.com/lineupjs). Details about the LineUp visualization technique can be found at http://lineup.caleydo.org

Installation
------------

```R
devtools::install_github("Caleydo/lineup_htmlwidget")
library(lineup)
```

Examples
--------

```R
lineup(mtcars)
```

```R
lineup(iris)
```

