#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

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

