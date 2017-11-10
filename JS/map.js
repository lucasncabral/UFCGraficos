    function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
      return "<h4>"+n+"</h4>"+
      "" + (d.max);
    }

    var width = 700,
    height = 700, centered;

    var svg = d3.select("#mapContainer").append("svg")
    .attr("width", width)
    .attr("height", height);


    var g = svg.append("g");

    var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

    var projection = d3.geo.mercator()
    .scale(650)
    .center([-52, -15])
    .translate([width / 2, height / 2]);
    var path = d3.geo.path()
    .projection(projection);

    d3_queue.queue()
    .defer(d3.json, "./brazil.json")
    .await(ready);

    var sampleData;
    var sortNumber = function(x, y) {
      return y.qntd - x.qntd ; 
    };


    function ready(error, shp) {
      if (error) throw error;
      var states = topojson.feature(shp, shp.objects.estados);
      var states_contour = topojson.mesh(shp, shp.objects.estados);


      sampleData ={};

      ["AC", "AL", "AM", "AP", "BA", "CE",
      "DF", "ES", "GO", "MA", "MG", "MS",
      "MT", "PA", "PB", "PE", "PI", "PR",
      "RJ", "RN", "RO", "RR", "RS", "SC",
      "SE", "SP", "TO", "ZZ"]
      .forEach(function(d){
        sampleData[d]={low:0, high:0, avg:0, color:null, max:"", partido:Array()}; 
      });

      d3.csv("./TSE_PRESIDENTE_UF_CANDIDATO_2014.csv", function(data) {
        for(var i = 0; i < data.length;i++){
          if(data[i].NUM_TURNO == 1){
            sampleData[data[i].UF].partido.push({sigla : data[i].SIGLA_PARTIDO , qntd : parseInt(data[i].QTDE_VOTOS)});
          }
        }

        ["AC", "AL", "AM", "AP", "BA", "CE",
        "DF", "ES", "GO", "MA", "MG", "MS",
        "MT", "PA", "PB", "PE", "PI", "PR",
        "RJ", "RN", "RO", "RR", "RS", "SC",
        "SE", "SP", "TO", "ZZ"]
        .forEach(function(d){
          sampleData[d].partido.sort(sortNumber);
          sampleData[d].max = sampleData[d].partido[0].sigla;
        });


        g.selectAll(".estado")
        .data(states.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)
        .style("fill",function(d){ return "#ffffff"; })
        .on("mouseover", mouseOver).on("mouseout", mouseOut).on("click", clicked);


        var listStates = g.selectAll(".state");

        listStates.each(function(d, i) {

          console.log(sampleData[d.id].max);

          color = getColorMap(sampleData[d.id].max);



          sampleData[d.id].color = color;
          sampleData[d.id].low = parseFloat(d.properties.volume) ;
          sampleData[d.id].high =  parseFloat(d.properties.capacity);
        });

      // Desenhando estados
      g.selectAll(".estado")
      .data(states.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .style("fill",function(d){ return sampleData[d.id].color; })
      .on("mouseover", mouseOver).on("mouseout", mouseOut).on("click", clicked);



      g.append("path")
      .datum(states_contour)
      .attr("d", path)
      .attr("class", "state_contour");
    });




      function clicked(d){
        var x, y, k;

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }

        g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

        g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
      }

      function mouseOver(d){
        d3.select("#tooltip").transition().duration(500).style("opacity", .9);      

        d3.select("#tooltip").html(tooltipHtml(d.properties.nome, sampleData[d.id]))  
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");
      }

      function mouseOut(){
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
      }

    }


// What to do when zooming
function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

    var obj = {};
    var currentline=lines[i].split(",");

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);

  }
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

function getColorMap(value){
  var color = "";
  switch(value){
    case "PCB":
    color = "#DA251C";
    break;
    case "PCO":
    color = "#9F030A";
    break;
    case "PRTB":
    color = "#2cb53f";
    break;
    case "PSB":
    color = "#FC0";
    break;
    case "PSC":
    color = "#009038";
    break;
    case "PSDB":
    color = "#1e90ff";
    break;
    case "PSDC":
    color = "#293490";
    break;
    case "PSOL":
    color = "#ED040E";
    break;
    case "PSTU":
    color = "#FF0000";
    break;
    case "PT":
    color = "#DA1208";
    break;
    case "PV":
    color = "#006600";
    break;
    default:
    color = "#000";
    break;
  }
  return color;
}


d3.select(self.frameElement).style("height", height + "px");