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

//var national_data = getNatlData(); //Todo not implemented yet

d3.json("js/us.json", function (us) {
  d3.tsv("data/us-state-names.tsv", function (data) {

    for (i of data) {

      state_data[i.id] = i.name
    }

    for (i of data){
      state_code_data[i.name]=i.code
    }

    //console.log(state_data);
    drawMap(us);

  })

});

function drawMap(us) {

  // set the national max scale
  maxScale = getMaxScale();

  // adding the header

  document.getElementById('header').innerHTML= 'Membership Growth Overtime: '+ getCurrentState();

  //drawing map boundaries

  var mapgroup = svg.append("g").attr("class", "mapgroup")

  mapgroup.append("g")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .enter()
  .append("path")
  .attr("d", path) // add projection
  // clicked state change color to orange
  .on("click", onStateClick)
  .attr("class", "states");

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

function onStateClick(d){
  d3.selectAll('path').style('fill', null);
  d3.select(this).style("fill", "orange");   // need to add a reset button here - make all classed object that are orange back to grey

  // here populate current state variable when user clicks

  currentState = state_data[d.id];
  document.getElementById('header').innerText='Membership Growth Overtime: '+ getCurrentState();



}

function reset(){

  d3.selectAll(".states").style('fill', '#aaa');
  currentState = 'National';
  document.getElementById('header').innerText = 'Membership Growth Overtime: '+ getCurrentState();

  //console.log(currentState);

}


function getMaxScale(){
  // use variable current Level to derive the max count for that specific level
  console.log('I got called: Max Scale');

  /*
  Example: loading the page is current Level - Total
   */


  // need a parse date to find the range of indices to pull from


}









