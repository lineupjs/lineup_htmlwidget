LineUp.js as HTMLWidget
=======================

[![License: MIT][mit-image]][mit-url] [![CircleCI][ci-image]][ci-url] [![CircleCI][ci-image-dev]][ci-url-dev] 

LineUp is an interactive technique designed to create, visualize and explore rankings of items based on a set of heterogeneous attributes. 
This is a [HTMLWidget](http://www.htmlwidgets.org/) wrapper around the JavaScript library [LineUp.js](https://github.com/lineupjs/lineupjs). Details about the LineUp visualization technique can be found at [http://lineup.caleydo.org](http://lineup.caleydo.org). 

It can be used within standalone [R Shiny](https://shiny.rstudio.com/) apps or [R Markdown](http://rmarkdown.rstudio.com/) files. **Integrated plotting does not work due to an outdated integrated Webkit version in RStudio**.
[Crosstalk](https://rstudio.github.io/crosstalk/) is supported for synching selections and filtering among widgets. 

Installation
------------

```R
devtools::install_github("rstudio/crosstalk")
devtools::install_github("datavisyn/lineup_htmlwidget")
library(lineupjs)
```

Examples
--------

```R
lineup(mtcars)
```

```R
lineup(iris)
```

![iris output](https://user-images.githubusercontent.com/4129778/34919941-fec50232-f96a-11e7-95be-9eefb213e3d6.png)


Advanced Example
----------------

```R
lineup(iris, 
  ranking=lineupRanking(columns=c('_*', '*', 'impose'), 
                        sortBy=c('Sepal_Length:desc'), groupBy=c('Species'), 
                        impose=list(type='impose', column='Sepal_Length', categoricalColumn='Species')))
```

![iris advanced output](https://user-images.githubusercontent.com/4129778/48187839-898c0d00-e33c-11e8-9d4a-360bc35741f4.png)


Crosstalk Example
-------------

```R
devtools::install_github("jcheng5/d3scatter")
library(d3scatter)
library(crosstalk)

shared_iris = SharedData$new(iris)

d3scatter(shared_iris, ~Petal.Length, ~Petal.Width, ~Species, width="100%")
```

```R
lineup(shared_iris, width="100%")
```

![crosstalk output](https://user-images.githubusercontent.com/4129778/34919938-fb7166de-f96a-11e7-8ea1-443e0923b160.png)



Shiny Example
-------------
```R
library(shiny)
library(crosstalk)
library(lineupjs)
library(d3scatter)

# Define UI for application that draws a histogram
ui <- fluidPage(
  titlePanel("LineUp Shiny Example"),

  fluidRow(
    column(5, d3scatterOutput("scatter1")),
    column(7, lineupOutput("lineup1"))
  )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  shared_iris <- SharedData$new(iris)

  output$scatter1 <- renderD3scatter({
    d3scatter(shared_iris, ~Petal.Length, ~Petal.Width, ~Species, width = "100%")
  })

  output$lineup1 <- renderLineup({
    lineup(shared_iris, width = "100%")
  })
}

# Run the application
shinyApp(ui = ui, server = server)
```

Hint:

In case you see scrollbars in each cell it is because of the font the cells are too narrow, you can specify a larger row height using

```R
lineup(iris, options=list(rowHeight=20))
```

Authors
-------

 * Samuel Gratzl (@sgratzl)
 * Datavisyn GmbH (@datavisyn)


[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[ci-image]: https://circleci.com/gh/lineupjs/lineup_htmlwidget.svg?style=shield
[ci-url]: https://circleci.com/gh/lineupjs/lineup_htmlwidget
[ci-image-dev]: https://circleci.com/gh/lineupjs/lineup_htmlwidget/tree/develop.svg?style=shield
[ci-url-dev]: https://circleci.com/gh/lineupjs/lineup_htmlwidget/tree/develop
