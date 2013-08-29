$(function() {
    $("div#tt-one").next().append( $('div#tt-two') );
    $("#reset-graph").on("click", function(e) {
        
    });
});

var totalDays = 0;
var perc = 0;
var counter = 0;
var margin = {top: 20, bottom: 30, left: 50, right: 80},
width = 520, // - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

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
.attr("id", "tt-two")
.attr("class", "tooltip")
.style("opacity", 0.5);

d3.csv("15-1.csv", function(error, data) {  
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
      .text("Days signed");

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
        d3.select(this).attr("r", 10);
        $("#tt-one").html(d.mpname + ' (' + d.party + ') || Days signed (missed): ' + d.signed + ' (' + d.missed + ')' );
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", 4);
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
    $(".first-class, .second-class, .third-class").empty();
    first_class_content = '';
    second_class_content = '';
    third_class_content = '';
    var circles = d3.selectAll("svg circle");
    var count = 0;
    var dist = 0;
    var distLess = 0;
    $(".first-class").append("Attendance >= 75%");
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
                distLess = distLess + 1;
                d.mpname.indexOf("Shri") != -1 ? addContent(d, "Shri", 2) : d.mpname.indexOf("Smt.") != -1 ? addContent(d, "Smt.", 2) : addContent(d, "", 2);
            }
            if(d.perc < 65) {
                distLess = distLess + 1;
                d.mpname.indexOf("Shri") != -1 ? addContent(d, "Shri", 3) : d.mpname.indexOf("Smt.") != -1 ? addContent(d, "Smt.", 3) : addContent(d, "", 3);
            }
            //partyTip
            $("#tt-two").html('Party: ' + d.party + ' || Attendance > 75%: ' + dist + '/' + count + ' MPs');
        }
        return d.party != options;
    })
    .style("opacity", "0.1")
    .attr("r", "3");
    
    // adds content in the end
    $(".first-class").append(first_class_content);
    $(".second-class").append(second_class_content);
    $(".third-class").append(third_class_content);
  }
  
  // adds Party information to tooltip two
  function addPartyInformation(d, dist, count) {
  
  }
  // adds MP names to first, second, third classes
  function addContent(d, to_be_replaced, grade) {
    if(grade === 1) {
        first_class_content += d.mpname.replace(to_be_replaced, "");
    } else if (grade === 2) {
        second_class_content += d.mpname.replace(to_be_replaced, "");
    } else if (grade === 3) {
        third_class_content += d.mpname.replace(to_be_replaced, "");
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
});

