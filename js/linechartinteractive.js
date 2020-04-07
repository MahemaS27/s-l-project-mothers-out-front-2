/*

NOTE: This code is adapted from aditeya's in class linechart interaction example. The source is cited in the index.html. :)
 */


var parseDate = d3.timeParse("%Y-%m-%d"); //Time format was different in the count dataset. So handling the parsing.

d3.csv(
    "data/MA_quarters.csv", // replace with current state
    function(d) {
      return {
        dates: parseDate(d.dates),
        supporters: +d.supporters,
        volunteers: +d.volunteers,
        leaders: +d.leaders,
        total: +d.total
      };
    },
    linechart
);



function linechart(data) {

  //============Wrangling Data for Creating Multi_Line Visualization===================
  var supporters = [];
  var volunteers= [];
  var leaders = [];
  var totals = [];

  data.forEach(element => {
    supporters.push({ dates: element.dates, count: element.supporters });
    volunteers.push({ dates: element.dates, count: element.volunteers });
    leaders.push({ dates: element.dates, count: element.leaders });
    totals.push({dates:element.dates, count:element.total})
  });



  series = [
    { id: "supporters", count: supporters },
    { id: "volunteers", count: volunteers },
    { id: "leaders", count: leaders },
    { id: "total", count: totals }
  ];
  //==============Wrangling Data for Creating Multi_Line Visualization================

  //We are using volunteers for datess because all three lists have same datess
  var maxDate = d3.max(totals, function (d) {
    return d.dates;
  });
  var minDate = d3.min(totals, function (d) {
    return d.dates;
  });
  //Nested max calculation
  var maxCount = d3.max(series, function (arrays) {
    return d3.max(arrays.count, function (d) {
      return d.count;
    });
  });

  //console.log(maxDate, minDate, maxCount)

  var width = 1200;
  var height = 800;
  var margin = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
  };

  let svg = d3
  .select("#chart-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  // adding the chart subelement

  var chartGroup = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// axis of line chart

  var xScale = d3
  .scaleTime()
  .domain([minDate, maxDate])
  .range([0, width]);

  var yScale = d3
  .scaleLinear()
  .domain([0, maxCount])
  .range([height - margin.bottom - margin.top, 0]);

//Adding categorical color scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(xScale);
  chartGroup
  .append("g")
  .attr("class", "x axis")
  .attr(
      "transform",
      "translate(0, " + (height - margin.bottom - margin.top) + ")"
  )
  .call(xAxis);

  var yAxis = d3.axisLeft(yScale);
  chartGroup
  .append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0, 0)")
  .call(yAxis);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var line = d3
  .line()
  .x(function(d) {
    return xScale(d.dates);
  })
  .y(function(d) {
    return yScale(d.count);
  });

  chartGroup
  .append("g")
  .selectAll("path")
  .data(series)
  .enter()
  .append("path")
  .attr("d", function(d, i) {
    return line(d.count);
  })
  .style("stroke", function(d, i) {
    return color(d.id);
  })
  .attr("class", "dataLine")
  .attr("id", function(d) {
    return d.id; // Adding an id to select the visualization for interactivity with external html elements (selectbox)
  })

  .on("mouseover", function(d) {
    // Selected Element
    d3.select("#info")
    .attr("x", d3.mouse(this)[0] + 10) // Padding to move text away from the mouse pointer
    .attr("y", d3.mouse(this)[1] + 15) // Padding to move text away from the mouse pointer
    .style("display", "")
    .text(d.id);
    //Reduce opacity of all the paths
    d3.selectAll("path").attr("opacity", "0.1");
    //Restore the opacity of selected path
    d3.select("#" + d.id).attr("opacity", "1");
  })

  .on("mouseout", function(d) {
    // Remove Label
    d3.select("#info").style("display", "none");

    //Restore the opacity of all paths
    d3.selectAll("path").attr("opacity", "1");
  });

  // Adding a text element to show the city name
  chartGroup
  .append("text")
  .attr("id", "info")
  .attr("x", 0)
  .attr("y", 0)
  .style("font-size", "30px")
  .style("background-color", "white")
  .style("display", "none");




}