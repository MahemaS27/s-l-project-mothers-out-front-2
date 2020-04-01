var width = 1000,
    height = 700,
    centered;

var tierData = [
  {"NAME": "Total"}, 
  {"NAME": "Supporting"},
  {"NAME": "Taking Action"}, 
  {"NAME":"Leading"}];

var currentState = null; // need to figure out how to populate this?????


// adding the filter before we draw the map

var dropDown = d3.select("#map-container")
                  .append("select")
                  .attr("tier", "tier-list");

console.log(dropDown)


/*
var options = dropDown.selectAll('option')
      .data(tierData)
      .enter()
      .append("option");
options.text(function(d){
  return d.NAME;
})
.attr("value", function(d){
  return d.NAME;
});
*/

var svg = d3.
select('#map-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)



var projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width);


var path = d3.geoPath().projection(projection);

var state_data = {};


d3.json("js/us.json", function(us) {
    d3.tsv("data/us-state-names.tsv", function(data){

        for (i of data) {

            state_data[i.id] = i.name
        }

        //console.log(state_data);
        drawMap(us);

    })
    
});



function drawMap(us) {

    //drawing map boundaries

    var mapgroup = svg.append("g").attr("class", "mapgroup")

    mapgroup.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path) // add projectiong
        // clicked state change color to orange
        .on("click", function (d) {


            //console.log(d);

        d3.selectAll('path').style('fill',null);
        d3.select(this).style("fill","orange");   // need to add a reset button here - make all classed object that are orange back to grey


        // here populate current state variable

        //console.log(state_data[d.id]); // id correseponds to specific state

        // set current state varaible


      })
        .attr("class", "states");


// adding state border 
    mapgroup
        .append('path')
        .datum(
            topojson.mesh(us, us.objects.states, function(a, b) {
                return a !== b;
            })
        )
        .attr("id", "state-borders")
        .attr("d", path);



}

// getter method for returning 














