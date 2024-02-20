import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function tm_SP_y_t_area() {

  const margin = { top: 50, right: 30, bottom: 30, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#Place2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [
    {Macrozona: "Norte",   D9:   -6.4, D9_4: -4785.6, D4_2: -1622.2, D2_0:  -681.9, I0_1: 0, I1_3:    69.9, I3_5:   32.5, I5_6:  11.0, I6_7:  7.7, I7:  3.7},
    {Macrozona: "Centro",  D9: -185.3, D9_4: -6582.0, D4_2: -6170.8, D2_0: -1862.0, I0_1: 0, I1_3:    46.3, I3_5:   78.8, I5_6:   1.9, I6_7:  0.8, I7:  0.2},
    {Macrozona: "Sur",     D9:      0, D9_4:   -11.4, D4_2:  -214.1, D2_0:  -815.4, I0_1: 0, I1_3:  2177.4, I3_5:  210.2, I5_6:  19.7, I6_7: 10.1, I7:  1.5},
    {Macrozona: "Austral", D9:      0, D9_4:   -29.2, D4_2:  -241.2, D2_0: -1656.8, I0_1: 0, I1_3: 32137.2, I3_5: 2813.2, I5_6: 179.3, I6_7: 67.2, I7: 25.9}
  ];
  
  // const data = await d3.csv("csv/total/tc_SP_SCA.csv");


  var series = d3.stack()
      .keys(["D9","D9_4","D4_2", "D2_0", "I0_1", "I1_3", "I3_5", "I5_6","I6_7","I7"])
      .offset(d3.stackOffsetDiverging)
      (data);
  
  
  var myColor = d3.scaleOrdinal().domain(series)
    .range(["#cb181d","#fb6a4a","#fcae91","#fee5d9","#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"])
  

  
  var x = d3.scaleBand()
      .domain(data.map(function(d) { return d.Macrozona; }))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);
  
  var y = d3.scaleLinear()
      .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
      .rangeRound([height - margin.bottom, margin.top]);
  
  var z = d3.scaleOrdinal(d3.schemeCategory10);
  
  svg.append("g")
    .selectAll("g")
    .data(series)
    .enter().append("g")
      .attr("fill", function(d){return myColor(d)}) // function(d){return myColor(d)} 
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("width", x.bandwidth)
      .attr("x", function(d) { return x(d.data.Macrozona); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
  
  svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));
  
  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
  
  // Add title to graph
  svg.append("text")
          .attr("x", 40)
          .attr("y", 25)
          .attr("text-anchor", "center")
          .style("font-size", "18px")
          .attr("font-family","Arial")
          .text("Superficie tendencia de nieve por macrozonas");
  
  
  function stackMin(serie) {
    return d3.min(serie, function(d) { return d[0]; });
  }
  
  function stackMax(serie) {
    return d3.max(serie, function(d) { return d[1]; });
  }
}