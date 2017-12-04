 function _(id){
   return document.getElementById(id);  
 }
 var droppedIn = false;
 function drag_start(event) {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.setData("text", event.target.getAttribute('id') );
}

function drag_drop(event) { 
  event.preventDefault();
  var elem_id = event.dataTransfer.getData("text");
  if((event.target.id).indexOf("drop_zone") != -1){
    changeGroup($("#" + elem_id).text(), event.target.getAttribute('id'));

    $("#" + elem_id).appendTo("#" + event.target.getAttribute('id'));
    console.log(groups[1 - 1].parties);
    droppedIn = true;
    loadMap();
    loadTree();
    loadTable();
  }
}

function changeGroup(element, group){
  console.log(element);
  if(groups[1 - 1].parties.find(item => {return item === element})){
    var index = groups[1 - 1].parties.indexOf(element);
    groups[1 - 1].parties.splice(index, 1);
  } else if (groups[2 - 1].parties.find(item => {return item === element})){
    var index = groups[2 - 1].parties.indexOf(element);
    groups[2 - 1].parties.splice(index, 1);
  } else if (groups[3 - 1].parties.find(item => {return item === element})){
    var index = groups[3 - 1].parties.indexOf(element);
    groups[3 - 1].parties.splice(index, 1);
  } else {
    var index = groups[4 - 1].parties.indexOf(element);
    groups[4 - 1].parties.splice(index, 1);
  }

  switch(group){
    case "drop_zone1":
    groups[1 - 1].parties.push(element);
    break;
    case "drop_zone2":
    groups[2 - 1].parties.push(element);
    break;
    case "drop_zone3":
    groups[3 - 1].parties.push(element);
    break;
    case "drop_zone4":
    groups[4 - 1].parties.push(element);
    break;
  }
}

function drag_end(event) {
  if(droppedIn == false){
    _('app_status').innerHTML = "You let the "+event.target.getAttribute('id')+" go.";
  }
  droppedIn = false;
}



$(document).ready(function(){
  var divGroups = $("#groups");

  divGroups.append('<div id="drop_zone1" class="drop_zone" class="col-sm-3" style= "border: #ffcc0082 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group1Div = $('#drop_zone1');
  group1Div.append('<p style="margin: 0px"><span id="group_0_name">' + groups[1 - 1].name + '</span> <button type="button" class="btn btn-link" data-toggle="modal" data-target="#renameModal" data-group-index="0"><span class="glyphicon glyphicon-pencil"></span></button></p>');
  var count = 0;
  groups[1 - 1].parties.forEach(function(d){
    group1Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')
    count++;
  });


  divGroups.append('<div id="drop_zone2" class="drop_zone" class="col-sm-3" style= "border: #da120882 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group2Div = $('#drop_zone2');
  group2Div.append('<p style="margin: 0px"><span id="group_1_name">' + groups[2 - 1].name + '</span> <button type="button" class="btn btn-link" data-toggle="modal" data-target="#renameModal" data-group-index="1"><span class="glyphicon glyphicon-pencil"></span></button></p>');
  groups[2 - 1].parties.forEach(function(d){
    group2Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')
    count++;
  });

  divGroups.append('<div id="drop_zone3" class="drop_zone" class="col-sm-3" style= "border: #00660082 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group3Div = $('#drop_zone3');
  group3Div.append('<p style="margin: 0px"><span id="group_2_name">' + groups[3 - 1].name + '</span> <button type="button" class="btn btn-link" data-toggle="modal" data-target="#renameModal" data-group-index="2"><span class="glyphicon glyphicon-pencil"></span></button></p>');
  groups[3 - 1].parties.forEach(function(d){
    group3Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')
    count++;
  });

  divGroups.append('<div id="drop_zone4" class="drop_zone" class="col-sm-3" style= "border: #1e90ff7d 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group4Div = $('#drop_zone4');
  group4Div.append('<p style="margin: 0px"><span id="group_3_name">' + groups[4 - 1].name + '</span> <button type="button" class="btn btn-link" data-toggle="modal" data-target="#renameModal" data-group-index="3"><span class="glyphicon glyphicon-pencil"></span></button></p>');
  groups[4 - 1].parties.forEach(function(d){
    group4Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')
    count++;
  });
});