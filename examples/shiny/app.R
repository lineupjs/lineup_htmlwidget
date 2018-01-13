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
library(lineup)

# Define UI for application that draws a histogram
ui <- fluidPage(

   # Application title
   titlePanel("Old Faithful Geyser Data"),

   # Sidebar with a slider input for number of bins
   sidebarLayout(
      sidebarPanel(
         sliderInput("filter",
                     "filter",
                     min = 1,
                     max = 50,
                     value = 30)
      ),

      # Show a plot of the generated distribution
      mainPanel(
        lineupOutput("lineup1")
      )
   )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  data = SharedData$new(iris)
  output$lineup1 <- renderLineup({
    lineup(data)
  })
}

# Run the application
shinyApp(ui = ui, server = server)

