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

![mtcars](https://cloud.githubusercontent.com/assets/4129778/22211814/9ee17098-e18e-11e6-8a65-2fa1ea22d035.png)

```R
lineup(iris)
```

![iris](https://cloud.githubusercontent.com/assets/4129778/22211811/9cd10ebc-e18e-11e6-9f76-5a9f24c4e79a.png)

