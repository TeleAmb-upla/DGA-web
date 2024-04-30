import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function tm_SP_y_t_area() {

  const margin = { top: 50, right: 30, bottom: 30, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#p09").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Creación del tooltip
    var tooltip = d3.select("#p09")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");

  const data = await d3.csv("csv/total/tm_SP_y_t_area.csv");


  var series = d3.stack()
      .keys(['1n','2n','3n','4n','5n','6n','7n','8n','9n','10n','m10n','0','1','2','3','4','5','6','7','8','9','10'])
      .offset(d3.stackOffsetDiverging)
      (data);
  
  
  var myColor = d3.scaleOrdinal().domain(series)
    .range(['#ffe7e9', '#ffcfd3', '#ffb7bd', '#ff9ca7', '#fa8392', '#f06b80', '#e3536f', '#d43c5f', '#c22551', '#ac0d44', '#93003a',
           '#d3f5f3', '#b9e6ea', '#a4d6e1', '#92c5d9', '#82b4d1', '#73a3ca', '#6493c2', '#5682bb', '#4772b3', '#3761ac', '#2452a4'])
  

  
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
          .attr("x", 20)
          .attr("y", 25)
          .attr("text-anchor", "center")
          .style("font-size", "18px")
          .attr("font-family","Arial")
          .text("Superficie tendencia de nieve por macrozonas");
  
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
        var fileName = "Superficie_Tendencia_De_Nieve_Por_Mmacrozonas.csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


// Legend
let legX = 389
let legY =  70

svg.append("text")
  .attr("x", legX)
  .attr("y", legY - 15)
  .text("(km²/año)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle");
// Agregar rectángulos coloreados para la leyenda (valores positivos)
const positiveValues = [">10", "10 - 9", "9 - 8", "8 - 7", "7 - 6", "6 - 5", "5 - 4" ,"4 - 3", "3 - 2","2 - 1", "1 - 0",
                         "0 - -1", "-1 - -2", "-2 - -3", "-3 - -4", "-4 - -5","-5 - -6","-6 - -7","-7 - -8","-8 - -9","-9 - -10", "< 10" ];
const positiveColors = [
  '#2452a4',
  '#3761ac',
  '#4772b3',
  '#5682bb',
  '#6493c2',
  '#73a3ca',
  '#82b4d1',
  '#92c5d9',
  '#a4d6e1',
  '#b9e6ea',
  '#d3f5f3',
  '#ffe7e9',
  '#ffcfd3',
  '#ffb7bd',
  '#ff9ca7',
  '#fa8392',
  '#f06b80',
  '#e3536f',
  '#d43c5f',
  '#c22551',
  '#ac0d44',
  '#93003a',

];

// Ahora puedes usar la lista "colores" en tu gráfico.

positiveValues.forEach((value, index) => {
  svg.append("rect")
    .attr("x", legX)
    .attr("y", legY + index * 10)
    .attr("height", 10)
    .attr("width", 10)
    .style("fill", positiveColors[index]);

  svg.append("text")
    .attr("x", legX + 23)
    .attr("y", legY + 7 + index *10)
    .text(value)
    .style("font-size", "8px")
    .attr("font-family", "Arial")
    .attr("alignment-baseline", "middle");
});

}