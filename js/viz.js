var width = 1000,
    height = 700,
    centered;

var tierData = [
  {"NAME": "Total"},
  {"NAME": "Supporting"},
  {"NAME": "Taking Action"},
  {"NAME": "Leading"}];

var currentState = 'National';
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
  maxScale = getMaxScale();

  // adding the header

  document.getElementById('header').innerHTML= 'Membership Growth Overtime: '+ getCurrentState();

  //drawing map boundaries

  var mapgroup = svg.append("g").attr("class", "mapgroup");

  // define color scale
  var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([-500, 3700]);

  //fill in the colors
  //TO-DO: 
  //     add in tiers (add a variable to change the color)
  //     find min max and max value of all data to set the color scale
  //     change color according to the time slider
  //     reset button change accordingly

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

  maxScale=getMaxScale();

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
  	}
  	else{
  	d3.select(this).style("fill", null);
  	clicked += 1;
  	// console.log(clicked);

  	currentState = 'National';
  	}  // need to add a reset button here - make all classed object that are orange back to grey
	document.getElementById('header').innerText='Membership Growth Overtime: '+ getCurrentState();
}

function reset(){
  d3.selectAll(".states").style('fill', '#aaa');
  currentState = 'National';
  document.getElementById('header').innerText = 'Membership Growth Overtime: '+ getCurrentState();

  //console.log(currentState);

}


function getMaxScale(){


  /*
  Example: loading the page is current Level - Total
   */


  // need a parse date to find the range of indices to pull from

  switch(currentLevel) {



    case 'Total':
      // return Math.max(national_data[0]);

  }

}





