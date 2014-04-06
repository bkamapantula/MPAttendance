$(function() {
    $(".about-modal").on("click", function() {
        $("#aboutModal").modal('show');
        /*$("#aboutFull").on('shown', function() {
            $(".modal").css("top", "");
        });*/
    });
    $(".parties-modal").on("click", function() {
        $("#partiesFull").modal('show');
        /*$("#partiesFull").on('shown', function() {
            $(".modal").css("top", "");
        });*/
    });

    var mps = [];
    $.ajax({
        type: "POST",
        url: "mpsuggestions.php",
        data: {'names': 1},
        dataType: "JSON",
        success: function(data) {
            for(var j=0; j<data.length;j++) {
             mps[j] = data[j]['mp_name'];
            }
            $(".mpname").autocomplete({
                source: mps
            })
        }
    });
    // enable autofocus
    $("#mpone").focus();
    // on submit
    $(".btn").on("click", function(event) {
        event.preventDefault();
        $("#datatableone").find("tr:gt(0)").empty();
        $("#datatabletwo").find("tr:gt(0)").empty();
        var searchedFor = $("#mpone").val();
        fetchValues(searchedFor, 1);
        var searchedFor = $("#mptwo").val();
        fetchValues(searchedFor, 2);
    });
    
    function fetchValues(value, type) {
        var s = "",
            p = "";
        $.ajax({
            type: "POST",
            url: "mpsuggestions.php",
            data: {'searchedfor': value},
            dataType: "JSON",
            success: function(data) {
                p += "<h5>Name: "+ data[0]['mp_name'] + "</h5><h5>Constituency: "+ data[0]['mp_constituency'] + "</h5><h5>State: "+ data[0]['mp_state'] +"</h5><h5>Party: "+ data[0]['mp_party'] + "</h5>";
                for(var i=0; i<data.length; i++) {
                    var attperc = [parseInt(data[i]['mp_signed'],10)/( parseInt(data[i]['mp_signed']) + parseInt(data[i]['mp_missed']) )]*100;
                    if(attperc>=75) {
                        s += "<tr><td>"+ data[i]['session_id'] + "</td><td>"+ data[i]['mp_signed'] + "</td><td>"+ data[i]['mp_missed'] + "</td><td class='success'>"+ attperc.toFixed(2) +"<td></tr>";
                    } else if (attperc>=65 && attperc<75) {
                        s += "<tr><td>"+ data[i]['session_id'] + "</td><td>"+ data[i]['mp_signed'] + "</td><td>"+ data[i]['mp_missed'] + "</td><td  class='warning'>"+ attperc.toFixed(2) +"<td></tr>";
                    } else {
                        s += "<tr><td>"+ data[i]['session_id'] + "</td><td>"+ data[i]['mp_signed'] + "</td><td>"+ data[i]['mp_missed'] + "</td><td  class='danger'>"+ attperc.toFixed(2) +"<td></tr>";
                    }
                }
                if(type===1) {
                    $("#datatableone").append(s);
                    $("#pone").html(p);
                } else if(type===2) {
                    $("#datatabletwo").append(s);
                    $("#ptwo").html(p);
                }
                $(".table, .attendance-tooltip").show();
            }
        });                
    } // end of fetchValues()

});
