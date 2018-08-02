
#' LineUpjs module
#'
#' a htmlwidget wrapper around LineUpJS (\url{https://lineup.js.org})
#'



.lineupImpl = function(data,
                  width,
                  height,
                  elementId,
                  options,
                  ranking,
                  dependencies,
                  lineupType,
                  ...) {
  # merge with defaults
  options = replace(
    list(
      filterGlobally = TRUE,
      singleSelection = FALSE,
      noCriteriaLimits = FALSE,
      animated = TRUE,
      sidePanel = 'collapsed',
      hierarchyIndicator = TRUE,
      summaryHeader = TRUE,
      overviewMode = FALSE,
      expandLineOnHover = FALSE,
      defaultSlopeGraphMode = 'item'
    ),
    values = options
  )

  if (crosstalk::is.SharedData(data)) {
    # using Crosstalk
    key = data$key()
    group = data$groupName()
    data = data$origData()
  } else {
    # Not using Crosstalk
    key = NULL
    group = NULL
  }

  # escape remove .
  colnames(data) = gsub("[.]", "_", colnames(data))

  toDescription = function(col, colname) {
    clazz = class(col)
    # print(paste(colname, clazz))
    if (clazz == 'numeric') {
      list(type = 'number',
           column = colname,
           domain = c(min(col), max(col)))
    } else if (clazz == 'factor') {
      list(type = 'categorical',
           column = colname,
           categories = levels(col))
    } else if (clazz == 'logical') {
      list(type = 'boolean', column = colname)
    } else {
      list(type = 'string', column = colname)
    }
  }
  # convert columns
  cols = mapply(toDescription, data, colnames(data), SIMPLIFY = F)
  # insert id column
  cols[['rowname']] = list(type = 'string', column = 'rowname', frozen = TRUE)

  # forward options using x
  x = list(
    data = cbind(rowname = rownames(data), data),
    colnames = c('rowname', colnames(data)),
    cols = cols,
    crosstalk = list(key = key, group = group),
    options = options,
    rankings = list(ranking = ranking, ...)
  )
  # create widget
  htmlwidgets::createWidget(
    name = lineupType,
    x,
    width = width,
    height = height,
    package = 'lineup',
    elementId = elementId,
    dependencies = dependencies
  )
}

#' lineup - factory for LineUp HTMLWidget
#'
#' @param data data frame like object i.e. also crosstalk shared data frame
#' @param width width of the element
#' @param height height of the element
#' @param elementId unique element id
#' @param options LineUp options
#'  \describe{
#'    \item{filterGlobally}{whether filter within one ranking applies to all rankings (default: TRUE)}
#'    \item{singleSelection}{restrict to single item selection (default: FALSE}
#'    \item{noCriteriaLimits}{allow more than one sort and grouping criteria (default: FALSE)}
#'    \item{animated}{use animated transitions (default: TRUE)}
#'    \item{sidePanel}{show side panel (TRUE, FALSE, 'collapsed') (default: 'collapsed')}
#'    \item{hierarchyIndicator}{show sorting and grouping hierarchy indicator (TRUE, FALSE) (default: TRUE)}
#'    \item{summaryHeader}{show summary histograms in the header (default: TRUE)}
#'    \item{overviewMode}{show overview mode in Taggle by default (default: FALSE)}
#'    \item{expandLineOnHover}{expand to full row height on mouse over (default: FALSE)}
#'    \item{defaultSlopeGraphMode}{default slope graph mode: item,band (default: 'item')}
#'  }
#' @param ranking ranking definition created using \code{\link{lineupRanking}}
#' @param dependencies include crosstalk dependencies
#' @param ... additional ranking definitions like 'ranking1=...' due to restrictions in converting parameters
#'
#' @return html lineup widget
#'
#' @examples
#' \dontrun{
#' lineup(mtcars)
#' lineup(iris)
#' }
#'
#' @export
lineup = function(data,
                  width = '100%',
                  height = NULL,
                  elementId = NULL,
                  options = list(
                    filterGlobally = TRUE,
                    singleSelection = FALSE,
                    noCriteriaLimits = FALSE,
                    animated = TRUE,
                    sidePanel = 'collapsed',
                    hierarchyIndicator = TRUE,
                    summaryHeader = TRUE,
                    overviewMode = FALSE,
                    expandLineOnHover = FALSE,
                    defaultSlopeGraphMode = 'item'
                  ),
                  ranking = NULL,
                  dependencies = crosstalk::crosstalkLibs(),
                  ...) {
  .lineupImpl(data, width, height, elementId, options, ranking, dependencies, lineupType='lineup', ...)
}


#' taggle - factory for Taggle HTMLWidget
#'
#' @param data data frame like object i.e. also crosstalk shared data frame
#' @param width width of the element
#' @param height height of the element
#' @param elementId unique element id
#' @param options LineUp options
#'  \describe{
#'    \item{filterGlobally}{whether filter within one ranking applies to all rankings (default: TRUE)}
#'    \item{singleSelection}{restrict to single item selection (default: FALSE}
#'    \item{noCriteriaLimits}{allow more than one sort and grouping criteria (default: FALSE)}
#'    \item{animated}{use animated transitions (default: TRUE)}
#'    \item{sidePanel}{show side panel (TRUE, FALSE, 'collapsed') (default: 'collapsed')}
#'    \item{hierarchyIndicator}{show sorting and grouping hierarchy indicator (TRUE, FALSE) (default: TRUE)}
#'    \item{summaryHeader}{show summary histograms in the header (default: TRUE)}
#'    \item{overviewMode}{show overview mode in Taggle by default (default: FALSE)}
#'    \item{expandLineOnHover}{expand to full row height on mouse over (default: FALSE)}
#'    \item{defaultSlopeGraphMode}{default slope graph mode: item,band (default: 'item')}
#'  }
#' @param ranking ranking definition created using \code{\link{lineupRanking}}
#' @param dependencies include crosstalk dependencies
#' @param ... additional ranking definitions like 'ranking1=...' due to restrictions in converting parameters
#'
#' @return html taggle widget
#'
#' @examples
#' \dontrun{
#' taggle(mtcars)
#' taggle(iris)
#' }
#'
#' @export
taggle = function(data,
                  width = '100%',
                  height = NULL,
                  elementId = NULL,
                  options = list(
                    filterGlobally = TRUE,
                    singleSelection = FALSE,
                    noCriteriaLimits = FALSE,
                    animated = TRUE,
                    sidePanel = 'collapsed',
                    hierarchyIndicator = TRUE,
                    summaryHeader = TRUE,
                    overviewMode = FALSE,
                    expandLineOnHover = FALSE,
                    defaultSlopeGraphMode = 'item'
                  ),
                  ranking = NULL,
                  dependencies = crosstalk::crosstalkLibs(),
                  ...) {
  .lineupImpl(data, width, height, elementId, options, ranking, dependencies, lineupType='taggle', ...)
}

#' helper function for creating a LineUp ranking definition as used by \code{\link{lineup}}
#'
#' @param columns list of columns shown in this ranking, besides \emph{column names of the given data frame} following special columsn are available
#'  \describe{
#'    \item{*}{include all data frame columns}
#'    \item{_*}{add multiple support columns (_aggregate, _rank, _selection)}
#'    \item{_aggregate}{add a column for collapsing groups}
#'    \item{_rank}{add a column for showing the rank of the item}
#'    \item{_selection}{add a column with checkboxes for selecting items}
#'    \item{_group}{add a column showing the current grouping title}
#'    \item{<data.frame column>}{add the specific column}
#'    \item{<def column>}{add defined column given as additional parameter to this function, see below}
#'  }
#' @param sortBy list of columns to sort this ranking by, grammar: <column name>[:desc]
#' @param groupBy list of columns to group this ranking by
#' @param ... additional ranking combination definitions as lists (\code{list(type = 'min', columns = c('a', 'b'), label = NULL)}), possible types
#'  \describe{
#'    \item{weightedSum}{a weighted sum of multiple numeric columns, extras \code{list(weights = c(0.4, 0.6))}}
#'    \item{min}{minimum of multiple numeric columns}
#'    \item{max}{maximum of multiple numeric columns}
#'    \item{mean}{mean of multiple numeric columns}
#'    \item{median}{median of multiple numeric columns}
#'    \item{nested}{group multiple columns}
#'    \item{script}{scripted (JS code) combination of multiple numeric columns, extras \code{list(code = '...')}}
#'    \item{impose}{color a numerical column (column) with the color of a categorical column (categoricalColumn), changed \code{list(column = 'a', categoricalColumn = 'b')}}
#'  }
#' @return a configured lineup ranking config
#'
#' @examples
#' lineupRanking(columns=c('*'))
#' lineupRanking(columns=c('*'), sortBy = c('hp'))
#' lineupRanking(columns=c('*', 'sum'),
#'   sum = list(type='weightedSum', columns = c('hp', 'wt'), weights = c(0.7, 0.3)))
#'
#' @export
lineupRanking = function(columns = c('_*', '*'),
                         sortBy = c(),
                         groupBy = c(),
                         ...) {

  list(
    columns = columns,
    sortBy = sortBy,
    groupBy = groupBy,
    defs = list(...)
  )
}

#' Shiny bindings for lineup
#'
#' Output and render functions for using lineup within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'800px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a lineup
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name lineup-shiny
#'
#' @export
lineupOutput = function(outputId,
                        width = '100%',
                        height = '800px') {
  htmlwidgets::shinyWidgetOutput(outputId, 'lineup', width, height, package = 'lineupjs')
}

#' Shiny render bindings for lineup
#'
#' @rdname lineup-shiny
#' @export
renderLineup = function(expr,
                        env = parent.frame(),
                        quoted = FALSE) {
  if (!quoted) {
    expr = substitute(expr)
  } # force quoted
  htmlwidgets::shinyRenderWidget(expr, lineupOutput, env, quoted = TRUE)
}

#' Shiny bindings for taggle
#'
#' Output and render functions for using taggle within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'800px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a taggle
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name taggle-shiny
#'
#' @export
taggleOutput = function(outputId,
                        width = '100%',
                        height = '800px') {
  htmlwidgets::shinyWidgetOutput(outputId, 'taggle', width, height, package = 'lineupjs')
}

#' Shiny render bindings for taggle
#'
#' @rdname taggle-shiny
#' @export
renderTaggle = function(expr,
                        env = parent.frame(),
                        quoted = FALSE) {
  if (!quoted) {
    expr = substitute(expr)
  } # force quoted
  htmlwidgets::shinyRenderWidget(expr, taggleOutput, env, quoted = TRUE)
}
