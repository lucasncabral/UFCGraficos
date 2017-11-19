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
      loadTable();
      loadTree();
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

function getColorMap(element){
  var color = "";

/**
   var group1 = ["PDT", "PT do B", "PSB", "AVANTE", "PSTU", "PCB", "NOVO"];
  var group2 = ["PC do B", "PROS", "PSB", "PT", "REDE", "PSOL" , "PRTB"];
  var group3 = ["PEN", "PPS", "PV", "PSL", "PMN", "PTC", "PPL", "PCO"];
  var group4 = ["PR", "PRB", "PMDB", "PTB", "PP", "DEM", "PSD","PSDC", "SD", "PHS", "PODE","PSC","PSDB","PRP", "PMB"];
  */

  if(group1.find(item => {return item === element})){
    color = "FC0";
  } else if (group2.find(item => {return item === element})){
    color = "#DA1208";
  } else if (group3.find(item => {return item === element})){
    color = "#006600" ;
  } else {
    color = "#1e90ff";
  }


  return color;
}

$( "#cargo" ).change(function() {
  loadMap();
});

d3.select(self.frameElement).style("height", height + "px");