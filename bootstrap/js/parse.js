$(function() {
    $("div#tt-one").next().append( $('div#tt-two') );
    $("#change-session").on("change", function(e) {
        $(".gender-count, #tt-one").empty();
        $("svg").remove();
        $("#reset-graph, .change-gender, .class-info, .alert-info").show();
        // sets gender to 'Select Gender' when new session is loaded
        $(".change-gender").val('10');
        loadSVG($("#change-session").val());
    });
    $(".alert-info").on("click", function(e) {
        $(this).remove();
    });
    $(".about-modal").on("click", function() {
        $("#aboutModal").modal('show');
    });
    $(".suggestion-modal").on("click", function() {
        $("#suggestionModal").modal('show');
    });
});

function loadSVG(session) {

    var totalDays = 0;
    var perc = 0;
    var counter = 0;
    var margin = {top: 20, bottom: 30, left: 50, right: 80},
    width = 520, // - margin.left - margin.right,
    height = 475 - margin.top - margin.bottom;
    
    var startDate = ['June 01, 2009', 'July 02, 2009', 'November 19, 2009', 'February 22, 2010', 'July 26, 2010', 'November 09, 2010', 'February 21, 2011', 'August 01, 2011', 'November 22, 2011', 'March 12, 2012', 'August 08, 2012', 'November 22, 2012'];
    var endDate = ['June 09, 2009', 'August 07, 2009', 'December 21, 2009', 'March 16, 2010', 'August 31, 2010', 'December 13, 2010', 'March 25, 2011', 'September 08, 2011', 'December 29, 2011', 'May 22, 2012', 'September 07, 2012', 'December 20, 2012'];

    // adds session duration information
    $(".session-info").html("<strong>"+ startDate[$("#change-session").val()] + "</strong> to <strong>" + endDate[$("#change-session").val()]+"</strong>" );
    
    var mx, my; // for mouse position
	$(document).mousemove(function(e) {
		mx = e.pageX;
		my = e.pageY;
	});

    var x = d3.scale.linear()
               .range([0, width]);

    var y = d3.scale.linear()
               .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(".main-svg")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select("body")
    .append("div")
    .attr("id", "tt-one")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var partyTip = d3.select("body")
    .append("div")
    //.attr("id", "tt-two")
    .attr("class", "tooltip")
    .style("opacity", 0.5);

    d3.csv("data/session-"+session+".csv", function(error, data) {  
        data.forEach(function(d) { 
            counter = counter + 1;
            totalDays = parseInt(d.DaysSigned, 10) + parseInt(d.DaysMissed, 10);
            perc = parseFloat(d.DaysSigned/totalDays)*100;
            d.perc = perc;
            d.signed = parseInt(d.DaysSigned, 10);
            d.missed = parseInt(d.DaysMissed, 10);
            d.counter = counter;
            d.mpname = d.Name;
            d.party = d.Party;
            d.gender = d.Gender;
            d.state = d.State;
        });
        
        x.domain(d3.extent(data, function(d) { return d.perc; } )).nice();
        y.domain(d3.extent(data, function(d) { return d.counter; } )).nice();

       svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Attendance %");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Number of MPs");

      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 4)
          .attr("cx", function(d) { return x(d.perc); })
          .attr("cy", function(d) { return y(d.counter); })
          .on("mouseover", function(d) {
            d3.select(this).attr("r", 6);
            $("#tt-one").html("<div>" + d.mpname + ' (' + d.party + ') </div> <div> Days signed (missed): ' + d.signed + ' (' + d.missed + ') <br> State: ' + d.state );
			$("#tt-one").css({'top': my, 'left': mx}).show();

          })
          .on("mouseout", function(d) {
            d3.select(this).attr("r", 4);
            $("#tt-one").hide();
            //d3.selectAll('dot').attr("r", 4);
          }) 
          .style("fill", function(d) { return color(d.party); });

      // Legend data
      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .on("mouseover", toggleParties)
          .on("mouseout", retainData)
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .style("font-size", "10px");
          
      // on legend mouse out
      function retainData(options) {
        var circles = d3.selectAll("svg circle");
        circles.filter(function(d) {
            return d.party == options;
        })
        .style("opacity", "1")
        .attr("r", "4");
      }

      // on legend mouse hover
      var first_class_content = '',
            second_class_content = '',
            third_class_content = '';
      function toggleParties(options) {
        $("table, .gender-count").empty();
        $(".change-gender").val('10');
        first_class_content = '';
        second_class_content = '';
        third_class_content = '';
        var circles = d3.selectAll("svg circle");
        var count = 0;
        var dist = 0,
            distSecond = 0,
            distThird = 0;
        circles.filter(function(d) {
            // to display MP names in mp-info div
            var filteredNodes = data.filter(function(MP) {
                                        return d.mpname == MP.Name ? MP.Name : false;
                                        })
                                     .map(function(MP) {
                                        return d.mpname == MP.Name ? MP.Name : false;
                                     });
            if(d.party == options) {
                count = count + 1;
                if(d.perc >= 75) {
                    dist = dist + 1;
                    d.mpname.indexOf("Shri") != -1 ? addContent(d, "Shri", 1) : d.mpname.indexOf("Smt.") != -1 ? addContent(d, "Smt.", 1) : addContent(d, "", 1);
                }
                if(d.perc >= 65 && d.perc < 75) {
                    distSecond = distSecond + 1;
                    d.mpname.indexOf("Shri") != -1 ? addContent(d, "Shri", 2) : d.mpname.indexOf("Smt.") != -1 ? addContent(d, "Smt.", 2) : addContent(d, "", 2);
                }
                if(d.perc < 65) {
                    distThird = distThird + 1;
                    d.mpname.indexOf("Shri") != -1 ? addContent(d, "Shri", 3) : d.mpname.indexOf("Smt.") != -1 ? addContent(d, "Smt.", 3) : addContent(d, "", 3);
                }
                //partyTip
            }
            return d.party != options;
        })
        .style("opacity", "0.1")
        .attr("r", "3");
        
        // adds content in the end
        $(".table-one").append("<tr> <th> First class (" + dist + "/" + count + ")</th> </tr>");
        $(".table-two").append("<tr class='warning'> <th> Second class (" + distSecond + "/" + count + ")</th> </tr>");
        $(".table-three").append("<tr class='error'> <th> Third class (" + distThird + "/" + count + ")</th> </tr>");
        $(".table-one").append(first_class_content);
        $(".table-two").append(second_class_content);
        $(".table-three").append(third_class_content);

      }
      
      // adds MP names to first, second, third classes
      function addContent(d, to_be_replaced, grade) {
        if(grade === 1) {
            first_class_content += '<tr class="success"><td>' + d.mpname.replace(to_be_replaced, "") + '</td></tr>';
        } else if (grade === 2) {
            second_class_content += '<tr class="warning"><td>' + d.mpname.replace(to_be_replaced, "") + '</td></tr>';
        } else if (grade === 3) {
            third_class_content += '<tr class="error"><td>' + d.mpname.replace(to_be_replaced, "") + '</td></tr>';
        }
      }

      // Legend shape
      legend.append("rect")
          .attr("x", width + 22)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      // Legend text
      legend.append("text")
          .attr("x", width + 44)
          .attr("y", 9)
          .attr("transform", "translate(55, 00)" )
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
    
    // changes properties of nodes based on Gender
    $(".change-gender").on("change", function(e) {
        var gender = $(".change-gender").val();
        var g = gender == 0 ? "Female" : gender == 1 ? "Male" : false;
        var counter = svg.selectAll(".dot")
            .filter(function(d) {
                return d.gender == gender ? d.party : false;
            })
            .attr("r", 5)
            .size();
        svg.selectAll(".dot")
            .filter(function(d) {
                return d.gender != gender ? d.party : false;
            })
            .attr("r", 0);
        //$(".gender-count").html("Number of total " + g + " MPs: " + counter);
        //$(".change-state").show();
    });
    
    // resets all nodes on clicking Reset button
    $("#reset-graph").on("click", function(e) {
        $(".change-gender").val('10');
        $(".gender-count").empty();
        svg.selectAll("circle")
            .style("opacity", "1")
            .attr("r", "4");
    });

    }); // end of d3.csv

} // end of loadSVG
