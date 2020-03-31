var width = 960,
    height = 500,
    centered;

var currentState = null; // need to figure out how to populate this?????

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

d3.json("us-states.json", function(us) {
    drawMap(us);
});



function drawMap(us) {
    

    //checking if there is state data names



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
        d3.selectAll('path').style('fill',null);
        d3.select(this).style("fill","orange");   // need to add a reset button here - make all classed object that are orange back to grey


        // here populate current state variable

        console.log(d.id, d.properties); // id correseponds to specific state


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














