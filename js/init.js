var base_url = "http://www.ffosilva.net/UFCGraficos/";

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
    var modal = document.getElementById(modal_name);
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

function checkNames(name, group_index) {
    for (i = 0; i < groups.length; i++) {
        if (i === group_index) continue;

        if (groups[i].name === name) {
            return false;
        }
    }

    return true;
}

$(document).ready(function () {
    var groupIndex, modal, shareModal, input_rename, input_link;

    $('#shareModal').on('show.bs.modal', function (event) {
        shareModal = $(this);
        // input_link = shareModal.find('.modal-body input');
        // input_link.val(base_url);
    });

    $('#renameModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        groupIndex = button.data('group-index');
        modal = $(this);
        input_rename = modal.find('.modal-body input');
        input_rename.val(groups[groupIndex].name);
    });

    $('#renameModal .modal-footer button').on('click', function (event) {
        console.log("grupo " + groupIndex);
        var group_title_id = "#group_" + groupIndex + "_name";

        if (!checkNames(input_rename.val(), groupIndex)) {
            alert("O nome '" + input_rename.val() + "' já está sendo utilizado! Escolha outro nome.");
            return;
        }

        groups[groupIndex].name = input_rename.val();
        $(group_title_id).text(groups[groupIndex].name);

        loadMap();
        loadTree();
        loadTable();

        modal.modal('toggle');
    });
});

function copyLink() {
    var copyText = document.getElementById("link-address");
    copyText.select();
    document.execCommand("Copy");
    alert("Link copiado com sucesso!");
}

function shortenURL() {
    var url = base_url + "?group_config=" + serializeGroups(groups);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCiebwIsAg21OXd5PaWbDUU0KQmyZGay7c",
        data: JSON.stringify(
            {
                "longUrl": url
            }
        ),
        dataType: "json",
        success: function (data) {
            $('#link-address').val(data.id);
            $('#shareModal').modal('show');
        }
    });
}

var groups = [
    {
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
    }
];

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