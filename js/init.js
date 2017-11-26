function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function loadModal(modal_name) {
    modal = document.getElementById(modal_name);
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

var groups =
    [{
        parties: ["PDT", "PT do B", "PSB", "AVANTE", "PSTU", "PCB", "NOVO"],
        name: "Grupo 1"
    }, {
        parties: ["PC do B", "PROS", "PT", "REDE", "PSOL", "PRTB"],
        name: "Grupo 2"
    }, {
        parties: ["PEN", "PPS", "PV", "PSL", "PMN", "PTC", "PPL", "PCO"],
        name: "Grupo 3"
    }, {
        parties: ["PR", "PRB", "PMDB", "PTB", "PP", "DEM", "PSD", "PSDC", "SD", "PHS", "PODE", "PSC", "PSDB", "PRP", "PMB"],
        name: "Grupo 4"
    }];

function serializeGroups(group_object) {
    return Base64.encodeURI(JSON.stringify(group_object));
}

function deserializeGroups(group_base64) {
    return Base64.decode(group_base64);
}

if (typeof GetURLParameter("group_config") !== 'undefined') {
    groups = JSON.parse(
        deserializeGroups(
            GetURLParameter("group_config")
        )
    );
}