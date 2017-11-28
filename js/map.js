    function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
      return "<h4>"+n+"</h4>";
      // +"Partido Vencedor: " + (d.max);
    }

    var width = 600,
    height = 600, centered;

    var stateSelect = "";
    var reload = false;
    var lastValueSelect = 1;

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
    var modal;

    function ready(error, shps) {
      if (error) throw error;
      shp = shps;
      loadMap(shp);
      loadTable();
      loadTree();
      loadModal('dialogState');
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
        sampleData[d]={low:0, high:0, avg:0, color:null, max:"", partido:Array(), groupsCount:Array()}; 
      });

      var cargoAPI = document.getElementById("cargo").value;
      var ano;
      if(cargoAPI == 11)
        ano = 2016;
      else
        ano = 2014;


      $.ajax({
        url : "https://cors-anywhere.herokuapp.com/" + "http://cepesp.io/api/consulta/tse?cargo=" + cargoAPI + "&ano=" + ano + "&agregacao_regional=UF.csv",
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
          color = getColorMap(sampleData[d.id].partido);
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

      function clicked(d){
        var x, y, k;

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
          stateSelect = d.id;
          if(document.getElementById("cargo").value == 6 || document.getElementById("cargo").value == 7){
            loadTree();
            loadTable();
          }
        } else {
          if(document.getElementById("cargo").value == 6 || document.getElementById("cargo").value == 7){
            document.getElementById("cargo").value = 1;
            loadTree();
            loadTable();
          }

          reload = true;
          loadMap();
          loadTree();
          loadTable();
          stateSelect = "";

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
        

        console.log(stateSelect);
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


function getColorMap(partidos){
  var color = "";
  var groupsCountVotes = [{nome:"Group1", qntd:0},{nome:"Group2", qntd:0},{nome:"Group3", qntd:0},{nome:"Group4", qntd:0}];

  partidos.forEach(function(d){
    var element = d.sigla;
    if(groups[1 - 1].parties.find(item => {return item === element})){
      groupsCountVotes[0].qntd += parseInt(d.qntd);
    } else if (groups[2 - 1].parties.find(item => {return item === element})){
      groupsCountVotes[1].qntd += parseInt(d.qntd);
    } else if (groups[3 - 1].parties.find(item => {return item === element})){
      groupsCountVotes[2].qntd += parseInt(d.qntd);
    } else {
      groupsCountVotes[3].qntd += parseInt(d.qntd);
    }});
  groupsCountVotes = groupsCountVotes.sort(sortNumber);
  
  console.log(groupsCountVotes);

  switch(groupsCountVotes[0].nome){
    case "Group1":
    color = "FC0";
    break;
    case "Group2":
    color = "#DA1208";
    break;
    case "Group3":
    color = "#006600" ;
    break;
    case "Group4":
    color = "#1e90ff";
    break;
    default:
    color = "#1e90ff";
    break;
  }

  return color;
}

$( "#cargo" ).change(function() {
  if(document.getElementById("cargo").value == 6 || document.getElementById("cargo").value == 7){
    if(stateSelect == ""){
      modal.style.display = "block";
      document.getElementById("cargo").value = lastValueSelect;
      modal.style.display = "block";
      return;
    }
  } else {
    lastValueSelect = document.getElementById("cargo").value;
  }

  reload = true;
  loadMap();
  loadTree();
  loadTable();
});

d3.select(self.frameElement).style("height", height + "px");