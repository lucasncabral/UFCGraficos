/*
http://cepesp.io/api/consulta/candidatos?ano=2014&cargo=1&selected_columns[]=ANO_ELEICAO&selected_columns[]=CODIGO_CARGO&selected_columns[]=NOME_URNA_CANDIDATO&selected_columns[]=SIGLA_PARTIDO&selected_columns[]=NUMERO_CANDIDATO&selected_columns[]=IDADE_DATA_ELEICAO&selected_columns[]=DESCRICAO_SEXO&selected_columns[]=DESCRICAO_GRAU_INSTRUCAO&selected_columns[]=DESPESA_MAX_CAMPANHA
*/

function loadTree(){
  $.ajax({
    url : "http://cepesp.io/api/consulta/candidatos?ano=2014&cargo=" + document.getElementById("cargo").value + "&selected_columns[]=ANO_ELEICAO&selected_columns[]=CODIGO_CARGO&selected_columns[]=NOME_URNA_CANDIDATO&selected_columns[]=SIGLA_PARTIDO&selected_columns[]=NUMERO_CANDIDATO&selected_columns[]=IDADE_DATA_ELEICAO&selected_columns[]=DESCRICAO_SEXO&selected_columns[]=DESCRICAO_GRAU_INSTRUCAO&selected_columns[]=DESPESA_MAX_CAMPANHA",
    type : 'get',
    beforeSend : function(){
    }
  }).done(function(result){
    var jsonData = {};
    var data = d3.csv.parse(result);
    var jsonData = new Object();
    jsonData.children = [];
    var size1,size2,size3,size4;

    jsonData.children[0] = new Object();
    jsonData.children[0].colorCode = "Group 1";
    jsonData.children[0].children = [];
    jsonData.children[0].name = ["Grupo 1"];
    jsonData.children[0].key = "Grupo 1";
  // SIZE CHANGE


  jsonData.children[1] = new Object();
  jsonData.children[1].colorCode = "Group 2";
  jsonData.children[1].children = [];
  jsonData.children[1].name = ["Grupo 2"];
  jsonData.children[1].key = "Grupo 2";

  jsonData.children[2] = new Object();
  jsonData.children[2].colorCode = "Group 3";
  jsonData.children[2].children = [];
  jsonData.children[2].name = ["Grupo 3"];
  jsonData.children[2].key = "Grupo 3";

  jsonData.children[3] = new Object();
  jsonData.children[3].colorCode = "Group 4";
  jsonData.children[3].children = [];
  jsonData.children[3].name = ["Grupo 4"];
  jsonData.children[3].key = "Grupo 4";

  jsonData.name = "assignment/ass1-anna-activities";


  var count = 0;
  group1.forEach(function(d){
    jsonData.children[0].children[count] = new Object();
    jsonData.children[0].children[count].colorCode = "Group 1";
    jsonData.children[0].children[count].children = [];
    jsonData.children[0].children[count].name = [d];
    jsonData.children[0].children[count].key = d;
    jsonData.children[0].children[count].size = 0;
    count++;
  });

  count = 0;
  group2.forEach(function(d){
    jsonData.children[1].children[count] = new Object();
    jsonData.children[1].children[count].colorCode = "Group 2";
    jsonData.children[1].children[count].children = [];
    jsonData.children[1].children[count].name = [d];
    jsonData.children[1].children[count].key = d;
    jsonData.children[1].children[count].size = 0;
    count++;
  });

  count = 0;
  group3.forEach(function(d){
    jsonData.children[2].children[count] = new Object();
    jsonData.children[2].children[count].colorCode = "Group 3";
    jsonData.children[2].children[count].children = [];
    jsonData.children[2].children[count].name = [d];
    jsonData.children[2].children[count].key = d;
    jsonData.children[2].children[count].size = 0;
    count++;
  });

  count = 0;
  group4.forEach(function(d){
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
  for(var i = 0; i < data.length;i++){
    if(data[i].DESPESA_MAX_CAMPANHA >= 1){
      var element = data[i].SIGLA_PARTIDO;
      var indexGroup;
      var indexPartido;

      var partido = new Object();
      if(group1.find(item => {return item === element})){
        indexGroup = 0;
        partido.colorCode = "Group 1";
        indexPartido = group1.indexOf(element);
        countGroup1++;
      } else if (group2.find(item => {return item === element})){
        indexGroup = 1;
        partido.colorCode = "Group 2";
        indexPartido = group2.indexOf(element);
        countGroup2++;
      } else if (group3.find(item => {return item === element})){
        indexGroup = 2;
        partido.colorCode = "Group 3";
        indexPartido = group3.indexOf(element);
        countGroup3++;
      } else if (group4.find(item => {return item === element})){
        indexGroup = 3;
        partido.colorCode = "Group 4";
        indexPartido = group4.indexOf(element);
        countGroup4++;
      }

      if(indexPartido > 0){
        partido.name = [data[i].NOME_URNA_CANDIDATO],
        partido.key = data[i].NOME_URNA_CANDIDATO;
        partido.size = 1;

        jsonData.children[indexGroup].children[indexPartido].children.push(partido);
        jsonData.children[indexGroup].children[indexPartido].size++;
      }

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
});
}

