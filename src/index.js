import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'

document.addEventListener("DOMContentLoaded", setup)

function setup(){
    const spaceX = new SpaceX();
    spaceX.launches().then(launches=>{
        spaceX.launchpads(true).then(launchPads=>{
            const listContainer = document.getElementById("listContainer")
            renderLaunches(launches, listContainer);
            drawMap(launchPads);
        });
    });
    spaceX.launches().then(data=>{
        console.log(data)
        const listContainer = document.getElementById("listContainer")
        renderLaunches(data, listContainer,spaceX);
        drawMap();
    })
    // Okleg: launchpads
    spaceX.launchpads().then(data=>{
        console.log(data)
        
    })
}
function renderLaunches(launches, container){
    const list = document.createElement("ul");
    console.log("renderLaunches: \n");
    launches.forEach(launch=>{
        console.log("launches.forEach: \n")
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        item.addEventListener("mouseover", changeColor, false);
        item.launchPadId = launch.launchpad
        list.appendChild(item);
        item.onclick = function () { 
            //console.log("https://api.spacexdata.com/v4/landpads/:id=["+ launch.launchpad+"]")

            // fetch(url).then(function (data) {
            //     console.log(data)
            //     });
              
            
        };
        //...?
        // item.onclick() = function(){
        //     console.log("click \n");
        // };
        // item.addEventListener("click", {
        //     console.log("click");
        // });
    })
    container.replaceChildren(list);
}
function renderLaunchpad(launchpads, container){
    console.log("renderLaunchpads: \n");
    launchpads.forEach(launchpad=>{
        console.log("launches.forEach: \n")
        const item = document.createElement("li");
        item.innerHTML = launchpad.name;
        list.appendChild(item);
        //...?
        // item.onclick() = function(){
        //     console.log("click \n");
        // };
        // item.addEventListener("click", {
        //     console.log("click");
        // });
    })
    container.replaceChildren(list);
}

function drawMap(){
    const width = 640;
    const height = 480;
    const margin = {top: 20, right: 10, bottom: 40, left: 100};
    const svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const projection = d3.geoMercator()
        .scale(70)
        .center([0,20])
        .translate([width / 2 - margin.left, height / 2]);
    svg.append("g")
        .attr("name", "map")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", function (d) {
            return 0;
        })
        .style("opacity", 1);
    svg.append("g")
        .attr("name", "launchPads")
        .selectAll('.launchPads')
		.data(launchPads.features)
		.enter()
		.append('path')
        .attr('id', function(lp){
            return lp.properties.id;
        })
		.attr('d', d3.geoPath()
            .projection(projection)
            .pointRadius(5))
		.attr('class', 'launchPads');

        // OKleg: 

        // var data = {
        //     "type": "FeatureCollection",
        //     "features": [
        //       {
        //           "type": "Feature",
        //           "geometry": {
        //               "type": "Point",
        //               "coordinates": [-111.6782379150,39.32373809814]
        //           }
        //       }]};
              
          
        width = 500,
        height = 300;
          
        svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        projection = d3.geoAlbers()
            .scale(600)
            .translate([width / 2, height / 2]);
          
        var path = d3.geoPath()
            .projection(projection);
          
        d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
            if (error) throw error;
          
            svg.append("path")
              .attr("d", path(topojson.mesh(world)))
              .attr("fill","none")
              .attr("stroke","black")
              .attr("stroke-width",1);
              
            svg.selectAll('.launchpad')
             .data(Geo.features)
             .enter()
             .append('path')
             .attr('d',path)
             .attr('class', 'launchpad');
              
             
          });
}

function changeColor(event){
    const launchPads = d3.select('#map')
        .select("svg")
        .select("g[name='launchPads']");
    const selectedPadCoords = launchPads.select(`path[id='${event.currentTarget.launchPadId}']`).data()[0].geometry.coordinates;
    launchPads.selectAll("path")
        .attr("class", function(lp) {
            if (lp.properties.id == event.currentTarget.launchPadId)
                return "selectedLaunchPad";
            const sqrDistance = (lp.geometry.coordinates[0] - selectedPadCoords[0]) * (lp.geometry.coordinates[0] - selectedPadCoords[0])
             + (lp.geometry.coordinates[1] - selectedPadCoords[1]) * (lp.geometry.coordinates[1] - selectedPadCoords[1]);
            if (sqrDistance < 0.1)
                return "transparentLaunchPads";
            return "launchPads";
        });
}

function drawLaunchpad(){
 var data = {
            "type": "FeatureCollection",
            "features": [
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [-111.6782379150,39.32373809814]
                  }
              }
            ]};
              
          
        width = 500,
        height = 300;
          
        svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        projection = d3.geoAlbers()
            .scale(600)
            .translate([width / 2, height / 2]);
          
        var path = d3.geoPath()
            .projection(projection);
          
        d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
            if (error) throw error;
          
            svg.append("path")
              .attr("d", path(topojson.mesh(world)))
              .attr("fill","none")
              .attr("stroke","black")
              .attr("stroke-width",1);
              
            svg.selectAll('.launchpad')
             .data(Geo.features)
             .enter()
             .append('path')
             .attr('d',path)
             .attr('class', 'launchpad');
              
             
          });
}

