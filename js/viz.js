var width = 1000,
    height = 700,
    centered;

var tierData = [
  {"NAME": "Total"},
  {"NAME": "Supporting"},
  {"NAME": "Taking Action"},
  {"NAME": "Leading"}];

var stateAbbre = {}

var currentState = 'USA';
var currentLevel = 'Total';

// max and mins of color scale - changes depending on tier
var minScale = 0;
var maxScale = null;

//the current year
var currentYear = 2020;

// adding the filter before we draw the map

var dropDown = d3.select("#map-container")
.append("select")
.attr("tier", "tier-list")
.attr("id", 'tiers');

var options = dropDown.selectAll('option')
.data(tierData)
.enter()
.append("option");
options.text(function (d) {
  return d.NAME;
})
.attr("value", function (d) {
  return d.NAME;
});


var svg = d3.select('#map-container')
.append('svg')
.attr('width', width)
.attr('height', height)

var projection = d3
.geoAlbersUsa()
.translate([width / 2, height / 2])
.scale(width);

var path = d3.geoPath().projection(projection);

var state_data = {}; // has id : name of state // for drawing map
var state_code_data={}; // has name of state : abbreviation

// var national_data = getNatlData(); //Todo not implemented yet

d3.json("js/us.json", function (us) {
  d3.tsv("data/us-state-names.tsv", function (data) {

	//add all the subsets we would work on
  	d3.csv("data/AL_quarters.csv", function(AL){
  	d3.csv("data/CA_quarters.csv", function(CA){
  		d3.csv("data/CO_quarters.csv", function(CO){
  			d3.csv("data/MA_quarters.csv", function(MA){
  				d3.csv("data/MI_quarters.csv", function(MI){
  					d3.csv("data/NH_quarters.csv", function(NH){
  						d3.csv("data/NY_quarters.csv", function(NY){
  							d3.csv("data/OH_quarters.csv", function(OH){
  								d3.csv("data/PA_quarters.csv", function(PA){
  									d3.csv("data/VA_quarters.csv", function(VA){
  										d3.csv("data/WA_quarters.csv", function(WA){
    for (i of data) {

      state_data[i.id] = i.name
    }

    for (i of data){
      state_code_data[i.name]=i.code
    }

    //make the subsets into a data frame 
    var allData = {"Alabama": AL, "California": CA, "Colorado":CO, "Massachusetts": MA,
    "Michigan": MI, "New Hampshire": NH, "New York": NY, "Ohio": OH, "Pennsylvania": PA, 
    "Virginia": VA,"Washington":WA };

    // console.log(allData.California[11].total); -> this is how we access a specific value

    drawMap(us, data, allData);
    drawLineChart(currentState);

});  
});  
});  
});  
}); 
});  
});  
});  
});  
});
});
});  
});

function drawMap(us, data, allData) {

  // set the national max scale
  // maxScale = getMaxScale();

  // adding the header

  document.getElementById('header').innerHTML= 'Membership Growth Overtime: '+ getCurrentState();

  //drawing map boundaries

  var mapgroup = svg.append("g").attr("class", "mapgroup");

  // define color scale
  var myColor = d3.scaleLinear()
  .range(["white", "#FF0000"])
  .domain([-500, 3700]);


  //fill in the colors
  //TO-DO: 
  //     add in tiers (add a variable to change the color)
  //     find min max and max value of all data to set the color scale
  //     change color according to the time slider
  //     link the line chart selection

  let fillFunction = function(d){

  	//get all the state names
	let stateName = data.filter(function(n) { return n.id == d.id })[0].name

	//the states we have -> get all keys for the dict 
	let weHave = Object.keys(allData);

	//check if the state we are drawing is the one that need to change the color
	let needToChange = weHave.includes(stateName);

	if (needToChange) {

		//get the most current quarterly data 
		//which is the last row of each subset
		var index = allData[stateName].length - 1;

		//return the color given the count, according to our color scale
		return myColor(allData[stateName][index].total);
		} else {
		return myColor(500);
		}
  	}

  mapgroup.append("g")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .enter()
  .append("path")
  .attr("d", path) // add projection
  // clicked state change color to orange
  .on("click", onStateClick)
  .attr("class", "states")
  .attr("fill", fillFunction);


// adding state border
  mapgroup
  .append('path')
  .datum(
      topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })
  )
  .attr("id", "state-borders")
  .attr("d", path);

}


// on change of select update the current level and chang ethe color + data shown
d3.select('select').on("change", function(d){
  var selected = document.getElementById('tiers');
  currentLevel = selected.options[selected.selectedIndex].value;

  //TODO
  // get new max scale and change color of the map

  // maxScale = getMaxScale();

  // do something to use that max scale, line chart, color scle

});

// getter method for return the current state
function getCurrentState() {
  return currentState;
}

//on state click function
//variable to keep track of the clicks
var clicked = 1;

function onStateClick(d){
	if(clicked % 2 != 0){
  d3.selectAll('path').style('fill', null);
  d3.select(this).style("fill", "orange"); 
  clicked += 1;
  // console.log(clicked);

  // here populate current state variable when user clicks
  currentState = state_data[d.id];
  drawLineChart(state_code_data[currentState]);
  //console.log(state_code_data[currentState]);

  	}
  	else{
  	d3.select(this).style("fill", null);
  	clicked += 1;
  	// console.log(clicked);

  	currentState = 'USA';
    drawLineChart(currentState);
  	}  
	document.getElementById('header').innerText='Membership Growth Overtime: '+ getCurrentState();

}

// check if a state is valid
// add a hover message to say "no data"



/*
LINE CHART CODE
NOTE: This code is adapted from aditeya's in class linechart interaction example. The source is cited in the index.html. :)
 */

function drawLineChart(state){ //state should be state abbreviation in string
//console.log("I am here", state);
var parseDate = d3.timeParse("%Y-%m-%d"); //Time format was different in the count dataset. So handling the parsing.

d3.csv(
    "data/" + state + "_quarters.csv", // replace with current state
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
}


function linechart(data) {
  //console.log("I am here", data);

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

  var width = 600;
  var height = 500;
  var margin = {
    top: 30,
    bottom: 30,
    left: 80,
    right: 100
  };

  // need to remove the old svg when clicking a new state
  let d3select = d3.select("#chart-container svg");
  d3select.remove();

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
  })

  .on("mouseout", function(d) {
    // Remove Label
    d3.select("#info").style("display", "none");

    //Restore the opacity of all paths
    d3.selectAll("path").attr("opacity", "1");
  });

  // Adding a text element to show the tier name
  chartGroup
  .append("text")
  .attr("id", "info")
  .attr("x", 0)
  .attr("y", 0)
  .style("font-size", "30px")
  .style("background-color", "white")
  .style("display", "none");

}





