var parseDate = d3.timeParse("%Y%m%d"); //Time format was different in the temp dataset. So handling the parsing.




d3.csv(
  "data/tempdata.csv",
  function(d) {
    return {
      date: parseDate(d.date),
      total: +d.total,
      engaged: +d.engaged,
      supporting: +d.supporting
    };
  },
  linechart
);




function linechart(data){

 var total = [];
  var engaged= [];
  var supporting = [];



data.forEach(element => {
    total.push({ date: element.date, count: element.total });
    engaged.push({ date: element.date, count: element.engaged});
    supporting.push({ date: element.date, count: element.supporting });
  });

  series = [
    { id: "total", value: total },
    { id: "engaged", value: engaged },
    { id: "supporting", value: supporting }
    ]

// end of getting data


//console.log(series);

var maxDate = d3.max(total, function(d) {
    return d.date;
  });
var minDate = d3.min(total, function(d) {
    return d.date;
  });
  //Nested max calculation
var maxCount = d3.max(series, function(arrays) {
  return d3.max(arrays.value, function(d) {
    return d.temp;
    });
  });


var width = 960;
var height = 500;
 var margin = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
  };


// adding the svg
var svg = d3
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


}