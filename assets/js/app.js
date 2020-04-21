// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data,err){
    
  // console.log(data)    
    if (err) throw err;
    // parse data
    data.forEach(function(data_parse){
       // data_parse.abbr = +data_parse.abbr;
       // console.log(data_parse.state)
        data_parse.poverty = +data_parse.poverty;
       // console.log(data_parse.poverty)
        data_parse.healthcare = +data_parse.healthcare;

    });
    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(data, d => d.poverty)])
    .range([0, width]);

    // var xLinearScale = d3.scaleLinear()
    // .domain([d3.min(data, d => d.poverty),
    //   d3.max(data, d => d.poverty)
    // ])

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
    chartGroup.append("g")
   // .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
    chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .attr("class", function(d) {
        return "stateCircle " + d.abbr
      })
      .on("mouseover", function(d) {
        toolTip.show(d, this)
        d3.select(this).style("stroke", "#323232")
      })
        .on("mouseout", function(d) {
        toolTip.hide(d, this);
        d3.select(this).style("stroke", "#e3e3e3");
      });

    // text OF state
    chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {
        return d.abbr
    })
    .attr("x", function(d) {
        return xLinearScale(d.poverty);  // Returns scaled location of x
    })
    .attr("y", function(d) {
        return yLinearScale(d.healthcare);  // Returns scaled circle y
    })
    .attr("font_family", "sans-serif")  // Font type
    .attr("font-size", "10px")  // Font size
    .attr("fill", "blue");   // Font color


      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>
          "Poverty: "${d.poverty}<br>
          "Healthcare: "${d.healthcare}`);
        });
  
    chartGroup.call(toolTip);

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    //.attr("value", "poverty") // value to grab for event listener
    .classed("axis-text", true)
    .text("In Poverty (%)");

    // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",15- margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "healthcare")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
  //var circlesGroup = updateToolTip("poverty", circlesGroup);
})

.catch(function(error) {
    console.log(error);
  });
  