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

var groups = {
    group1: ["PDT", "PT do B", "PSB", "AVANTE", "PSTU", "PCB", "NOVO"],
    group2: ["PC do B", "PROS", "PT", "REDE", "PSOL", "PRTB"],
    group3: ["PEN", "PPS", "PV", "PSL", "PMN", "PTC", "PPL", "PCO"],
    group4: ["PR", "PRB", "PMDB", "PTB", "PP", "DEM", "PSD", "PSDC", "SD", "PHS", "PODE", "PSC", "PSDB", "PRP", "PMB"]
};

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