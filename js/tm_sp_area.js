import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function tm_sp_area() {

  const margin = { top: 50, right: 30, bottom: 30, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#p08").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 // Crear el tooltip
 var tooltip = d3.select("#p08")
 .append("div")
 .style("opacity", 0)
 .attr("class", "tooltip")
 .style("background-color", "white")
 .style("border", "solid")
 .style("border-width", "2px")
 .style("border-radius", "5px")
 .style("padding", "5px")
 .style("position", "absolute");

 
    const data = await d3.csv("csv/total/tm_SP_area.csv");

  var series = d3.stack()
  .keys(["Intermitente","Estacional","Permanente"])
    .offset(d3.stackOffsetDiverging)
    (data);
  
  
  var myColor = d3.scaleOrdinal().domain(series)
    .range(["yellow","orange","blue"])
    
  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.Macrozona; }))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);
  
  var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
    .rangeRound([height - margin.bottom, margin.top]);
  
  var z = d3.scaleOrdinal(d3.schemeCategory10);

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }
  // Función para resaltar la barra completa
function highlightBar(group) {
  d3.selectAll('.bar-group')
    .filter(function(d) { return d.data.Macrozona === group; })
    .selectAll('rect')
    .style('stroke', 'black')
    .style('opacity', 1);
}
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
  .on("mouseover", function(d) {
    tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
  })
  .on("mousemove", function(event, d) {
      let coberturaIntermitente = d.data["Intermitente"] ? Math.round(parseFloat(d.data["Intermitente"])) : 0;
      let coberturaEstacional = d.data["Estacional"] ? Math.round(parseFloat(d.data["Estacional"])) : 0;
      let coberturaPermanente = d.data["Permanente"] ? Math.round(parseFloat(d.data["Permanente"])) : 0;
      tooltip
          .html("Macrozona : " + d.data.Macrozona + "<br>" + 
                "Intermitente : " + formatNumber(coberturaIntermitente) + " km²" + "<br>" + 
                "Estacional : " + formatNumber(coberturaEstacional) + " km²" + "<br>" + 
                "Permanente : " + formatNumber(coberturaPermanente) + " km²" + "<br>" 
          )
          .style("left", (event.pageX + 30) + "px")
          .style("top", (event.pageY + 30) + "px");
  })
  

  .on("mouseout", function(d) {
    tooltip
        .style("opacity", 0);
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
  });
  
  svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));
  
  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
  
  // Add title to graph
  svg.append("text")
          .attr("x", 20)
          .attr("y", 25)
          .attr("text-anchor", "center")
          .style("font-size", "18px")
          .attr("font-family","Arial")
          .text("Superficie por persistencia nieve por macrozonas");
  
 
  // Legend

  let legX = 75
  let legY = 80

  svg.append("text")
  .attr("x", legX)
  .attr("y", legY-15)
  .text("Permanencia nieve (%)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("rect")
      .attr("x", legX)
      .attr("y", legY)
      .attr('height', 15)
      .attr('width', 15)
      .style("fill", "blue")

  svg.append("rect")
      .attr("x", legX)
      .attr("y", legY+25)
      .attr('height', 15)
      .attr('width', 15)
      .style("fill", "orange")

  svg.append("rect")
      .attr("x", legX)
      .attr("y", legY+50)
      .attr('height', 15)
      .attr('width', 15)
      .style("fill", "yellow")

  svg.append("text")
      .attr("x", legX+25)
      .attr("y", legY+10)
      .text("Permanente (>90)")
      .style("font-size", "12px")
      .attr("font-family", "Arial")
      .attr("alignment-baseline", "middle")

  svg.append("text")
      .attr("x", legX+25)
      .attr("y", legY+35)
      .text("Estacional (30 - 90)")
      .style("font-size", "12px")
      .attr("font-family", "Arial")
      .attr("alignment-baseline", "middle")

  svg.append("text")
      .attr("x", legX+25)
      .attr("y", legY+60)
      .text("Intermitente (5 - 30)")
      .style("font-size", "12px")
      .attr("font-family", "Arial")
      .attr("alignment-baseline", "middle");
   // Etiqueta del eje X
   svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("x", 250)
   .attr("y", 380)
   .text("Macrozonas");

// Etiqueta del eje Y
var text = svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("transform", "rotate(-90)")
   .attr("y", 8)
   .attr("x", -150)
   
   text.append("tspan")
   .text("Área de nieve (km");
          
   text.append("tspan")
   .attr("baseline-shift", "super")
   .attr("font-size", "10px")
   .text("2");
  
   text.append("tspan")
   .attr("baseline-shift", "baseline")
   .attr("font-size", "14px")
   .text(")");

function stackMin(serie) {
 return d3.min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
 return d3.max(serie, function(d) { return d[1]; });
}

// Crear un botón de exportación dentro del SVG
var button = svg.append("foreignObject")
 .attr("width", 30) // ancho del botón
 .attr("height", 40) // alto del botón
 .attr("x", width +5 ) // posiciona el botón en el eje x
 .attr("y",5) // posiciona el botón en el eje Y
 .append("xhtml:body")
 .html('<button type="button" style="width:100%; height:100%; border: 0px; border-radius:5px; background-color: transparent;"><img src="images/descarga.png" alt="descarga" width="20" height="20"></button>')
 .on("click", function() {
     var columnNames = Object.keys(data[0]); 

     // Crea una nueva fila con los nombres de las columnas y agrega tus datos
     var csvData = [columnNames].concat(data.map(row => Object.values(row))).join("\n");
     
     var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
     var url = URL.createObjectURL(blob);
     var fileName = "Superficie_Por_Persistencia_Nieve_Por_Macrozonas.csv";
     
     var link = document.createElement("a");
     link.setAttribute("href", url);
     link.setAttribute("download", fileName);
     link.style.visibility = 'hidden';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
 });
}
