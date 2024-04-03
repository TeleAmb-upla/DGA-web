import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
// Importar la paleta de colores
import { myColor } from './myColor.js';

//import { leyenda_tend } from './leyenda_tend.js'; //  './Leyenda.js' con la ruta correcta a archivo de leyenda

// Función para dibujar el gráfico 
export async function c_SCA_m_trend(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 85, right: 150, bottom: 60, left: 80};
    const width = 25 ;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#p15")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//month//SCA_m_trend_BNA_";
    const text_end =  ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    // Read the data
    const data = await d3.csv(watershed_selected);

    var group = "Trend"

    // Labels
    const myGroups = Array.from(new Set(data.map(d => group)));
    const myVars = Array.from(new Set(data.map(d => d.Month)));

    // Build X scales and axis:
    const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 0)
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();

    // Build Y scales and axis:
    const y = d3.scaleBand()
    .range([ height, -5 ])
    .domain(myVars)
    .padding(0.05);
svg.append("g")
    .style("font-size", 11)
    .call(d3.axisLeft(y).tickFormat(d3.format(".0f")).tickSize(0)) // Aquí se formatean los ticks
    .select(".domain").remove();

    // create a tooltip
    const tooltip = d3.select("#p15")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

   // Tres funciones que cambian la información sobre herramientas cuando el usuario pasa el cursor/mueve/sale de una celda
var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function (event, d) {
    var value = Number(d.SCA); // era una cadena y habia que pasarla a numero
    tooltip
        .html(   "Mes: " + d.Month + "<br>" 
             + "Tendencia: " + value.toFixed(1) + "<br>"  //tofixed es para definir la cantiada de decimales al mostrar.
             )
        .style("left", (event.pageX +30) + "px") 
        .style("top", (event.pageY) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

    // Add the squares
    svg.selectAll()
        .data(data, d => `${d.Month}`)
        .enter()
        .append("rect")
            .attr("x", d => x(myGroups))
            .attr("y", d => y(d.Month))
            //.attr("rx", 4) // redondeo
            //.attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(d.SCA))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    // Add title to graph
    // Etiqueta title
    svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "20px")
        .attr("x", -82)
        .attr("y", -25)
        .text("13. Tendencia por mes");
       // Etiqueta SUb titulo
    svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "16px")
        .style("fill", "grey")
        .attr("x", -40)
        .attr("y", -10)
        .text("Cuenca: "+ watershed);

 //Add the legend

 const colorScale = d3.scaleThreshold()
 .domain([
     -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 
      0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10
 ])
 .range([
     "#FF0000", "#FF0303", "#FF1E1F", "#FE393A", "#FE5456", "#FD6F72", "#FD8B8D", 
     "#FCA6A9", "#FCC1C5", "#FBDCE0", "#FBF7FC", "#FBF7FC", "#DFDEFC", "#C4C4FD", 
     "#A8ABFD", "#8D92FD", "#7178FE", "#565FFE", "#3A46FE", "#1F2CFF", 
     "#0313FF", "#0000FF"
 ]);
// set the dimensions and margins of the graph

let legX = 60
let legY = 20

// Agregar un elemento de texto a la leyenda en las coordenadas especificadas
svg.append("text")
.attr("x", legX-28)
.attr("y", legY-15)
.text("Tendencia (%/año)") // El texto que se mostrará
.style("font-size", "11px") // Tamaño de la fuente del texto
.attr("font-family", "Arial") // Fuente del texto
.attr("alignment-baseline", "middle") // Alineación vertical del texto

colorScale.domain().forEach((value, i) => {
 // Agregar un rectángulo a la leyenda en las coordenadas especificadas
 svg.append("rect")
   .attr("x", legX-20 )
   .attr("y", legY + i * 10)
   .attr('height', 10)
   .attr('width', 10)
   .style("fill", colorScale(value)) // El color del rectángulo será el color correspondiente en la escala de colores
// Agregar un elemento de texto a la leyenda en las coordenadas especificadas
svg.append("text")
.attr("x", legX + 15)
.attr("y", legY + i * 10 + 5)
.attr("text-anchor", "end")  
.text(value === -10 ? `<${value}` : value === 10 ? `>${value}` : `${value < 0 ? ' ' : ''}${value} - ${value + 1 < 10 ? ' ' : ''}${value + 1}`) // El texto que se mostrará
.style("font-size", "9px") // Tamaño de la fuente del texto
.attr("font-family", "Arial") // Fuente del texto
.attr("alignment-baseline", "middle") // Alineación vertical del texto
})

// Agregar un elemento de texto a la leyenda en las coordenadas especificadas
svg.append("text")
.attr("x", legX-25)
.attr("y", legY + colorScale.domain().length * 10 + 30)
.text("Nubes (%)") // El texto que se mostrará
.style("font-size", "12px") // Tamaño de la fuente del texto
.attr("font-family", "Arial") // Fuente del texto
.attr("alignment-baseline", "middle") // Alineación vertical del texto

// Agregar un rectángulo negro a la leyenda en las coordenadas especificadas
svg.append("rect")
 .attr("x", legX-20)
 .attr("y", legY + colorScale.domain().length * 10 + 40)
 .attr('height', 10)
 .attr('width', 10)
 

// Agregar un elemento de texto a la leyenda en las coordenadas especificadas
svg.append("text")
.attr("x", legX -8)
.attr("y", legY + colorScale.domain().length * 10 + 45)
.text(">30") // El texto que se mostrará
.style("font-size", "10px") // Tamaño de la fuente del texto
.attr("font-family", "Arial") // Fuente del texto
.attr("alignment-baseline", "middle") // Alineación vertical del texto


// Crear un botón de exportación dentro del SVG
var button = svg.append("foreignObject")
    .attr("width", 30) // ancho del botón
    .attr("height", 40) // alto del botón
    .attr("x",  + 120) // posiciona el botón en el eje x
    .attr("y",-48) // posiciona el botón en el eje Y
    .append("xhtml:body")
    .html('<button type="button" style="width:100%; height:100%; border: 0px; border-radius:5px; background-color: transparent;"><img src="images/descarga.png" alt="descarga" width="20" height="20"></button>')
    .on("click", function() {
        var columnNames = Object.keys(data[0]); 

        // Crea una nueva fila con los nombres de las columnas y agrega tus datos
        var csvData = [columnNames].concat(data.map(row => Object.values(row))).join("\n");
        
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var fileName = "Tendencia_Por_Mes_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });































}