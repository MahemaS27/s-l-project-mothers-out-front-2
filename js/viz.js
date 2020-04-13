var width = 720;
var height = 625;


var currentState = 'USA';

//the current year
var currentYear = 2020;
var currentTier = 'Total';

// colors associated with each tier
color_tier = {"Total": '#FF0000',
                      "Supporting": "#1f76b4",
                      "Volunteers": "#f2840f",
                      "Leading": "green"}

var statesWeHave = ["Alabama", "California", "Colorado", "Massachusetts",
    "Michigan", "New Hampshire", "New York", "Ohio", "Pennsylvania", 
    "Virginia", "Washington"];

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

  // need to remove the old svg when clicking a new state
let d3selectMap = d3.select("#map-container svg");
  d3selectMap.remove();

var svg = d3.select('#map-container')
.append('svg')
.attr('width', width)
.attr('height', height)


  // set the national max scale
  // maxScale = getMaxScale();

  // adding the header

  document.getElementById('header').innerHTML= 'Membership Growth Overtime: '+ getCurrentState();

  //drawing map boundaries

  var mapgroup = svg.append("g").attr("class", "mapgroup");

  // define color scale
  var myColor = d3.scaleLinear()
  .range(["white", color_tier[currentTier]])
  .domain([-500, 3700]);

var legend = svg
   .append("g")
   .attr("class","legend")
   .attr("width", 140)
   .attr("height", 200)
   .selectAll("g")
   .data([
    {'color': '#FF0000', 'label': 'Total'},
    {'color': '#1f76b4', 'label' : 'Supporting'},
    {'color': '#f2840f', 'label' : 'Volunteers'},
    {'color': 'green', 'label' : 'Leading'},
    {'color': 'purple', 'label' : 'Selected State'},
    {'color': '#DCDCDC', 'label' : 'No data'}
    ]) //include the color and the actual word on the data
   // always want to pass an array

   .enter()
   .append("g")
   .attr("transform", function(d, i){
    return "translate(0," + i * 20 + ")";
   });

   legend
   .append("rect")
   .attr("width", 18)
   .attr("height", 18)
   .style("fill", function(d) {
    return d.color;
   });

   legend.append("text")
   .attr("x", 24)
   .attr("y", 9)
   .attr("dy", ".35em")
   .text(function(d) {
    return d.label;
   });


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



		let tiers_dict = {"Total": allData[stateName][index].total,
                      "Supporting": allData[stateName][index].supporters,
                      "Volunteers": allData[stateName][index].volunteers,
                      "Leading": allData[stateName][index].leaders}

		//return the color given the count, according to our color scale

		return myColor(tiers_dict[currentTier]);
		} else {
		return "#DCDCDC";
		}
  	}

/*
Dropdown menu with tiers of membership
 */
  mapgroup.append("g")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .enter()
  .append("path")
  .attr("d", path) // add projection
  // clicked state change color to purple
  .on("click", onStateClick)
  .attr("class", "states")
  .attr("fill", fillFunction);

  var selectbox = d3.select("#selectbox").on("change", function() {
    let selected = document.getElementById('selectbox');

    currentTier =  selected.options[selected.selectedIndex].value
    console.log(currentTier);
    // call drawMap again to change color and data

    drawMap(us, data, allData)


  });


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


// getter method for return the current state
function getCurrentState() {
  return currentState;
}

//on state click function
//variable to keep track of the clicks
var clicked = 1;

function onStateClick(d){

  currentState = state_data[d.id];

  let needToChange = statesWeHave.includes(currentState);
  if(needToChange){
  d3.selectAll('path').style('fill', null);
  d3.select(this).style("fill", "#8A2BE2"); 

  drawLineChart(state_code_data[currentState]);
  document.getElementById('header').innerText='Membership Growth Overtime: '+ getCurrentState();
  }

  else
  {
  drawLineChart("USA");
  document.getElementById('header').innerText='Membership Growth Overtime: '+ "USA";
  }
}


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

  //check the max Date is correct
  //console.log(maxDate);

  let margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  }

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
  .call(xAxis)
  .selectAll("text")  
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");

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
  .style("font-size", "1px")
  .style("background-color", "white")
  .style("display", "none");

}





