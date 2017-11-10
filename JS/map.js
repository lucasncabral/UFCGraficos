    function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
      return "<h4>"+n+"</h4>"+
      "" + (d.max);
    }

    var width = 600,
    height = 600, centered;

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

    var shp;

    function ready(error, shps) {
      if (error) throw error;
      shp = shps;
      loadMap(shp);
    }

function loadMap(){
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

      var cargoAPI = document.getElementById("cargo").value;
      var ano;
      if(cargoAPI == 11)
        ano = 2016;
      else
        ano = 2014;


      $.ajax({
        url : "http://cepesp.io/api/consulta/tse?cargo=" + cargoAPI + "&ano=" + ano + "&agregacao_regional=UF.csv",
        type : 'get',
        beforeSend : function(){
        }
      })

      .done(function(result){
        var data = d3.csv.parse(result);

        for(var i = 0; i < data.length;i++){
          if(data[i].NUM_TURNO == 1){
            sampleData[data[i].UF].partido.push({sigla : data[i].SIGLA_PARTIDO , qntd : parseInt(data[i].QTDE_VOTOS)});
          }
        }

        var i = 0;

        ["AC", "AL", "AM", "AP", "BA", "CE",
        "DF", "ES", "GO", "MA", "MG", "MS",
        "MT", "PA", "PB", "PE", "PI", "PR",
        "RJ", "RN", "RO", "RR", "RS", "SC",
        "SE", "SP", "TO", "ZZ"]
        .forEach(function(d){
          if(d != "ZZ"){
            sampleData[d].partido.sort(sortNumber);
            try{
              i++;
              sampleData[d].max = sampleData[d].partido[0].sigla;
            } catch(ex){
              //alert('Ocorreu um problema, por favor recarregue a pagina!');
            }
          }
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
    })
      .fail(function(jqXHR, textStatus, msg){
        alert(msg);
      });

      // Change aqui

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
    case "PPS":
    color = "#FA7F72";
    break;
    case "PTB":
    color = "#00bfff";
    break;   
    case "PDT":
    color = "#F60";
    break; 
    case "PFL":
    color = "#99ff33";
    break; 
    case "PMDB":
    color = "#2E8B57";
    break; 
    case "PPB":
    color = "#00bfff";
    break; 
    case "PC do B":
    color = "#DA251C";
    break; 
    case "PSD":
    color = "#293490";
    break;  
    case "DEM":
    color = "#99ff33";
    break;  
    case "SD":
    color = "#D86425";
    break;  
    case "PRB":
    color = "#4DBCE7";
    break;  
    case "PP":
    color = "#ED5F36";
    break;  
    case "PTC":
    color = "#009038";
    break;
    case "PL":
    color = "#FF4500";
    break; 
    case "PR":
    color = "#0F0073";
    break;   
    case "PROS":
    color = "#F78907";
    break;  
    case "REDE":
    color = "#2BC";
    break;  
    case "PMN":
    color = "#DA010A";
    break; 
    case "PTN":
    color = "#006600";
    break;      
    default:
    color = "#000";
    break;
  }
  return color;
}

$( "#cargo" ).change(function() {
  loadMap();
});

d3.select(self.frameElement).style("height", height + "px");