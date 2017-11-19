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
    console.log(group1);
    droppedIn = true;
    loadMap();
  }
}

function changeGroup(element, group){
  console.log(element);
  if(group1.find(item => {return item === element})){
    var index = group1.indexOf(element);
    group1.splice(index, 1);
  } else if (group2.find(item => {return item === element})){
    var index = group2.indexOf(element);
    group2.splice(index, 1);
  } else if (group3.find(item => {return item === element})){
    var index = group3.indexOf(element);
    group3.splice(index, 1);
  } else {
    var index = group4.indexOf(element);
    group4.splice(index, 1);
  }

  switch(group){
    case "drop_zone1":
    group1.push(element);
    break;
    case "drop_zone2":
    group2.push(element);
    break;
    case "drop_zone3":
    group3.push(element);
    break;
    case "drop_zone4":
    group4.push(element);
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
  var divGroups = $('.row');

  divGroups.append('<div id="drop_zone1" class="drop_zone" class="col-sm-3" style= "border: #ffcc0082 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group1Div = $('#drop_zone1');
  group1Div.append('<p style="margin: 0px">Grupo 1</p>')
  var count = 0;
  group1.forEach(function(d){
    group1Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')  
    count++;
  });


  divGroups.append('<div id="drop_zone2" class="drop_zone" class="col-sm-3" style= "border: #da120882 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group2Div = $('#drop_zone2');
  group2Div.append('<p style="margin: 0px">Grupo 2</p>')
  group2.forEach(function(d){
    group2Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')  
    count++;
  });

  divGroups.append('<div id="drop_zone3" class="drop_zone" class="col-sm-3" style= "border: #00660082 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group3Div = $('#drop_zone3');
  group3Div.append('<p style="margin: 0px">Grupo 3</p>')
  group3.forEach(function(d){
    group3Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')  
    count++;
  });

  divGroups.append('<div id="drop_zone4" class="drop_zone" class="col-sm-3" style= "border: #1e90ff7d 3px solid" ondrop="drag_drop(event)" ondragover="return false" >');
  var group4Div = $('#drop_zone4');
  group4Div.append('<p style="margin: 0px">Grupo 4</p>');
  group4.forEach(function(d){
    group4Div.append('<div id="object' + count + '" class="objects" draggable="true" ondragstart="drag_start(event)" ondragend="drag_end(event)" style="float: left">' + d + '</div>')  
    count++;
  });
});