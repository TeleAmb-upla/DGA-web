// Importar D3.js desde CDN
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Importar la paleta de colores
import { myColor } from './myColor.js';



// Función asincrónica para cargar y dibujar el gráfico
export async function c_SCA_y_t_area(watershed) {
    
    // Ruta para el archivo CSV
    var text_ini = "csv\\year\\SCA_y_t_area_BNA_"
    var text_end =  ".csv"
 
    var watershed_selected = text_ini.concat(watershed).concat(text_end)

    // Obtener los datos CSV
    const data = await d3.csv(watershed_selected);

    // Definir las dimensiones y márgenes del gráfico
    const margin = { top: 80, right: 0, bottom: 60, left: 100 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Crear el elemento SVG
    var svg = d3.select("#p05")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Escala X
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Sen_slope))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Escala Y
    var y = d3.scaleLinear()
    .domain([0, 1.05*d3.max(data, function(d) { return +d.area;} )])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Barras
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Sen_slope))
        .attr("width", x.bandwidth())
        .attr("fill", d => myColor(d.Sen_slope)) // Usar la paleta de colores aquí
        .attr("height", d => height - y(0))
        .attr("y", d => y(0))
        .attr("stroke", "black") // Color del borde
        .attr("stroke-width", 0.5); // Ancho del borde

    // Etiqueta title  X =  Área (km2)
   // Etiqueta title
   svg.append("text")
   .attr("text-anchor", "center")
   .attr("font-family", "Arial")
   .attr("font-size", "20px")
   .attr("x", width / 2  - 120)
   .attr("y", -25)
   .text("Superficie por tendencia anual");

   // Etiqueta SUb titulo
svg.append("text")
   .attr("text-anchor", "center")
   .attr("font-family", "Arial")
   .attr("font-size", "16px")
   .style("fill", "grey")
   .attr("x", width / 2  - 40)
   .attr("y", -10)
   .text("Cuenca: "+ watershed);

// Etiqueta del eje X
svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("x", width / 2 + 15)
   .attr("y", height + 40)
   .text("Tendencia (%/año)");

// Etiqueta del eje Y
svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("transform", "rotate(-90)")
   .attr("y", -50)
   .attr("x", -80)
   .text("Superficie (km2)");

    // Animación
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.area))
        .attr("height", d => height - y(d.area))
        .delay((d, i) => i * 100);
}
