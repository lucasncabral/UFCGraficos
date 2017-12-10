function loadTree(){
  var codCargo = document.getElementById("cargo").value;
  var url;

  if (codCargo == 6 || codCargo == 7) {
    url = "http://cepesp.io/api/consulta/candidatos?ano=2014&cargo=" + document.getElementById("cargo").value + "&selected_columns[]=ANO_ELEICAO&selected_columns[]=CODIGO_CARGO&selected_columns[]=NOME_URNA_CANDIDATO&selected_columns[]=SIGLA_PARTIDO&selected_columns[]=NUMERO_CANDIDATO&selected_columns[]=IDADE_DATA_ELEICAO&selected_columns[]=DESCRICAO_SEXO&selected_columns[]=DESCRICAO_GRAU_INSTRUCAO&selected_columns[]=DESPESA_MAX_CAMPANHA&selected_columns[]=SIGLA_UE&columns[0][name]=SIGLA_UE&columns[0][search][value]=" + stateSelect;
  } else {
    url = "http://cepesp.io/api/consulta/candidatos?ano=2014&cargo=" + document.getElementById("cargo").value + "&selected_columns[]=ANO_ELEICAO&selected_columns[]=CODIGO_CARGO&selected_columns[]=NOME_URNA_CANDIDATO&selected_columns[]=SIGLA_PARTIDO&selected_columns[]=NUMERO_CANDIDATO&selected_columns[]=IDADE_DATA_ELEICAO&selected_columns[]=DESCRICAO_SEXO&selected_columns[]=DESCRICAO_GRAU_INSTRUCAO&selected_columns[]=DESPESA_MAX_CAMPANHA";
  }

  console.log(url);

  $.ajax({
    url : "https://cors-anywhere.herokuapp.com/" + url,
    type : 'get',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    beforeSend : function(){
    }
  }).done(function(result){
    var jsonData = {};
    var data = d3.csv.parse(result);
    var jsonData = new Object();
    jsonData.children = [];
    var size1,size2,size3,size4;



    var i
    for(i = 0; i < 4; i++) {

      jsonData.children[i] = new Object();
      jsonData.children[i].colorCode = "Group " + (i + 1);
      jsonData.children[i].children = [];
      jsonData.children[i].name = [groups[i].name];
      jsonData.children[i].key = groups[i].name;
    }
    jsonData.name = "assignment/ass1-anna-activities";

    var count = 0;
    groups[1 - 1].parties.forEach(function(d){
      jsonData.children[0].children[count] = new Object();
      jsonData.children[0].children[count].colorCode = "Group 1";
      jsonData.children[0].children[count].children = [];
      jsonData.children[0].children[count].name = [d];
      jsonData.children[0].children[count].key = d;
      jsonData.children[0].children[count].size = 0;
      count++;
    });

    count = 0;
    groups[2 - 1].parties.forEach(function(d){
      jsonData.children[1].children[count] = new Object();
      jsonData.children[1].children[count].colorCode = "Group 2";
      jsonData.children[1].children[count].children = [];
      jsonData.children[1].children[count].name = [d];
      jsonData.children[1].children[count].key = d;
      jsonData.children[1].children[count].size = 0;
      count++;
    });

    count = 0;
    groups[3 - 1].parties.forEach(function(d){
      jsonData.children[2].children[count] = new Object();
      jsonData.children[2].children[count].colorCode = "Group 3";
      jsonData.children[2].children[count].children = [];
      jsonData.children[2].children[count].name = [d];
      jsonData.children[2].children[count].key = d;
      jsonData.children[2].children[count].size = 0;
      count++;
    });

    count = 0;
    groups[4 - 1].parties.forEach(function(d){
      jsonData.children[3].children[count] = new Object();
      jsonData.children[3].children[count].colorCode = "Group 4";
      jsonData.children[3].children[count].children = [];
      jsonData.children[3].children[count].name = [d];
      jsonData.children[3].children[count].key = d;
      jsonData.children[3].children[count].size = 0;
      count++;
    });

    var countGroup1 = 0;
    var countGroup2 = 0;
    var countGroup3 = 0;
    var countGroup4 = 0;
    var names = [];
    var candidatos = [];

    var maxAge = new Object();
    maxAge.idade = 0;
    var minAge = new Object();
    minAge.idade = 100;
    var countMale = 0;
    var countWoman = 0;
    var countSuperiorCompleto = 0;
    var countSuperioIncompleto = 0;
    var countEnsinoMedio = 0;
    var countEnsinoMedioIncompleto = 0;
    for(var i = 0; i < data.length;i++){
      if(data[i].DESPESA_MAX_CAMPANHA >= 1 || data[i].CODIGO_CARGO > 1){
        var element = data[i].SIGLA_PARTIDO;
        var indexGroup;
        var indexPartido;

        var partido = new Object();
        partido.siglaPartido = element;
        if(groups[1 - 1].parties.find(item => {return item === element})){
          indexGroup = 0;
          partido.colorCode = "Group 1";
          indexPartido = groups[1 - 1].parties.indexOf(element);
          countGroup1++;
        } else if (groups[2 - 1].parties.find(item => {return item === element})){
          indexGroup = 1;
          partido.colorCode = "Group 2";
          indexPartido = groups[2 - 1].parties.indexOf(element);
          countGroup2++;
        } else if (groups[3 - 1].parties.find(item => {return item === element})){
          indexGroup = 2;
          partido.colorCode = "Group 3";
          indexPartido = groups[3 - 1].parties.indexOf(element);
          countGroup3++;
        } else if (groups[4 - 1].parties.find(item => {return item === element})){
          indexGroup = 3;
          partido.colorCode = "Group 4";
          indexPartido = groups[4 - 1].parties.indexOf(element);
          countGroup4++;
        }

        if(indexPartido > 0 && names.indexOf(data[i].NOME_URNA_CANDIDATO) < 0){
          names.push(data[i].NOME_URNA_CANDIDATO);
          partido.name = [data[i].NOME_URNA_CANDIDATO],
          partido.key = data[i].NOME_URNA_CANDIDATO;
          partido.size = 1;

          jsonData.children[indexGroup].children[indexPartido].children.push(partido);
          jsonData.children[indexGroup].children[indexPartido].size++;
        }

      // TOOD AUMENTAR AQUI
      // SIGLA_UE,NUMERO_CANDIDATO,NOME_URNA_CANDIDATO,SIGLA_PARTIDO,IDADE_DATA_ELEICAO,DESCRICAO_SEXO,DESCRICAO_GRAU_INSTRUCAO
      partido.estado = data[i].SIGLA_UE;
      partido.numero = data[i].NUMERO_CANDIDATO;
      partido.idade = data[i].IDADE_DATA_ELEICAO;
      partido.sexo = data[i].DESCRICAO_SEXO;
      partido.grau = data[i].DESCRICAO_GRAU_INSTRUCAO;

      if(partido.grau == "SUPERIOR COMPLETO")
        countSuperiorCompleto++;
      else if(partido.grau == "SUPERIOR INCOMPLETO")
        countSuperioIncompleto++;
      else if(partido.grau == "ENSINO MÉDIO COMPLETO")
        countEnsinoMedio++;
      else 
        countEnsinoMedioIncompleto++;

      if(partido.sexo == "MASCULINO")
        countMale++;
      else
        countWoman++;

      if(partido.idade > maxAge.idade){
        maxAge.idade = partido.idade;
        maxAge.name = partido.name;
        maxAge.partido = element;
      }

      if(partido.idade < minAge.idade){
        minAge.idade = partido.idade;
        minAge.name = partido.name;
        minAge.partido = element;
      }
      candidatos[partido.name] = partido;
      candidatos.length++;
    }
  }

  jsonData.children[0].size = countGroup1;
  jsonData.children[1].size = countGroup2;
  jsonData.children[2].size = countGroup3;
  jsonData.children[3].size = countGroup4;

  jsonData.size = countGroup1 + countGroup2 + countGroup3 + countGroup4;

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 1060 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;

  var i = 0,
    duration = 750,// animation duration
    root;// stores the tree structure in json format

    var tree = d3.layout.tree()
    .size([height, width]);

    var edge_weight = d3.scale.linear()
    .domain([0, 100])
    .range([0, 100]);

    var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

// adding the svg to the html structure
d3.select("div#tree").select("svg").remove();

// TODO AQUI
var divText = $('#label1');
divText.html("");
var ano = 
divText.append("<h3>Candidatos eleição " + "2014" + "</h3><h4>Total: " + candidatos.length +" candidatos</h4><br><h4>Sexo:</h4><h5>" + countMale +" Masculino</h5><h5>" + countWoman + " Feminino</h5><br><h4>Grau de Instrução:</h4><h5>" + countSuperiorCompleto + " com Superior Completo</h5><h5>" + countSuperioIncompleto +" com Superior Incompleto</h5><h5>" + countEnsinoMedio +" com Ensino Médio</h5><h5>" + countEnsinoMedioIncompleto + " inferior a Ensino Médio</h5><br><h4>Idade(" + minAge.idade  + "~" + maxAge.idade + "):</h4><h5>" + minAge.idade + " anos - " + minAge.name + " - " + minAge.partido + "</h5><h5>" + maxAge.idade  + " anos - " + maxAge.name + " - " + maxAge.partido + "</h5>");


var svg = d3.select("div#tree").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//loading the json file
//d3.json("data.json", function(error, flare) {
//  console.log("flare");
//  console.log(flare);
edge_weight.domain([0,jsonData.size]);
root = jsonData;
root.x0 = height / 2;
root.y0 = 0;

root.children.forEach(collapse);
update(root);
//});

d3.select(self.frameElement).style("height", "800px");
if(codCargo == 1)
  expandAll();

/**
 * Updates the node.
 * cloppases and expands the node bases on the structure of the source
 * all 'children' nodes are expanded and '_children' nodes collapsed
 * @param {json structure} source
 */
 function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 150; });

  // Update the nodesâ€¦
  var node = svg.selectAll("g.node")
  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
  .on("click", click);

  nodeEnter.append("circle")
  .attr("r", 1e-6)
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
  .attr("x", function(d) { return d.children || d._children ? -15 : 15; })
  .attr("dy", ".35em")
  .attr("class", "candidateName")
  .attr("id", function(d) { return d.key; })
  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
  .text(function(d) { return d.key; })
  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  // color selected
  nodeUpdate.select("circle")
  .attr("r", function(d){ return edge_weight(d.size/2);})
  .style("fill", function(d) { 
    return d._children ? "#fff" : "#fff"; });

  nodeUpdate.select("text")
  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
  .remove();

  nodeExit.select("circle")
  .attr("r", 1e-6);

  nodeExit.select("text")
  .style("fill-opacity", 1e-6);

  // Update the linksâ€¦
  var link = svg.selectAll("path.link")
  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
  .attr("class", "link")
  .attr("stroke-width", function(d){
   return 1;
 })
  .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
  })
  .attr("stroke", function(d){ 
   return linkColor(d.target.colorCode);});

  // Transition links to their new position.
  link.transition()
  .duration(duration)
  .attr("d", function(d){
    /* calculating the top shift */
    var source = {x: d.source.x - edge_weight(calculateLinkSourcePosition(d)), y: d.source.y};
    var target = {x: d.target.x, y: d.target.y};
    return diagonal({source: source, target: target});
  })
  .attr("stroke-width", function(d){
   return edge_weight(d.target.size);
 });

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function calculateLinkSourcePosition(link) {
 targetID = link.target.id;
 var childrenNumber = link.source.children.length;
 var widthAbove = 0;
 for (var i = 0; i < childrenNumber; i++)
 {
  if (link.source.children[i].id == targetID)
  {
      // we are done
      widthAbove = widthAbove + link.source.children[i].size/2;
      break;
    }else {
      // keep adding
      widthAbove = widthAbove + link.source.children[i].size
    }
  }
  return link.source.size/2 - widthAbove;
}

/*
 * Toggle children on click.
 * @param {node} d
 */ 
 function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

/*
 * Collapses the node d and all the children nodes of d
 * @param {node} d
 */
 function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function expand(d) {
 if (d._children) {
  d.children = d._children;
  d._children = null;
}
if (d.children) {
  d.children.forEach(expand);
}

}

function linkColor(linkCode) {
 switch (linkCode)
 {
   case 'Group 1': 
   return '#FC0';
   break;
   case 'Group 2':
   return '#DA1208';
   case 'Group 3': 
   return '#006600';
   break;
   case 'Group 4':
   return '#1e90ff';
   break;
   default:
   return '#696969';
   break;
 }
}

function expandAll() {
  root.children.forEach(expand);
  update(root);
}

function tooltipHtml(c){ /* function to create html content string in tooltip div. */
  console.log(c);
  return "<h4>"+c.name+"</h4><h4>" + c.numero +"</h4><br><table>"+
      "<tr><td>Partido</td><td>"+c.siglaPartido+" </td></tr>"+
      "<tr><td>Sexo</td><td>"+c.sexo+" </td></tr>"+
      "<tr><td>Idade</td><td>"+c.idade+" </td></tr>"+
      "<tr><td>Grau</td><td>"+c.grau+" </td></tr>"+
      "</table>";
}

$(document).on('mouseover', 'text', function(e) {
  if ($(e.target).attr('class') == "candidateName" && candidatos[e.target.id] != undefined){
    console.log(e);
    d3.select("#tooltipTree").transition().duration(500).style("opacity", .9);      

    d3.select("#tooltipTree").html(tooltipHtml(candidatos[e.target.id]))  
    .style("left",e.originalEvent.layerX + "px")     
    .style("top", e.originalEvent.layerY + "px");
  }
});

$(document).on('mouseout', 'text', function(e) {
    d3.select("#tooltipTree").transition().duration(500).style("opacity", 0);     
});

});
}

