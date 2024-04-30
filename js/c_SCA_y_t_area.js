// Importar D3.js desde CDN
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
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
   
   // Crear el tooltip
var tooltip = d3.select("#p05")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")
.style("position", "absolute");

 // Define las nuevas etiquetas
var labels = ["<-10", "-9 - -8", "-8 - -7", "-7 - -6", "-6 - -5", "-5 - -4", "-4 - -3", "-3 - -2", "-2 - -1", "-1 - 0", "0 - 1", "1 - 2", "2 - 3", "3 - 4", "4 - 5", "5 - 6", "6 - 7", "7 - 8", "8 - 9", "9 - 10", ">10"];

// Crea la escala X como antes
var x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.Sen_slope))
    .padding(0.2);

// Cuando llamas a d3.axisBottom(x), cambia las etiquetas del eje X
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat((d, i) => labels[i]))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

   
    // Escala Y
    var y = d3.scaleLinear()
    .domain([0, 1.05*d3.max(data, function(d) { return +d.Area;} )])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    const myColor = d3.scaleThreshold()
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
       

  // Barras con tooltip
svg.selectAll("mybar")
.data(data)
.enter()
.append("rect")
.attr("x", d => x(d.Sen_slope))
.attr("width", x.bandwidth())
.attr("fill", d => myColor(d.Sen_slope))
.attr("height", d => height - y(0))
.attr("y", d => y(0))
.attr("stroke", "black")
.attr("stroke-width", 0.5)
.on("mouseover", function(event, d) {
    // Calcular el rango de tendencias para esta barra
    var lowerBound = Math.floor(d.Sen_slope);
    var upperBound = Math.ceil(d.Sen_slope);
    var trendRange = lowerBound + "-" + upperBound;

    // Convertir el valor del área a un número entero
    var area = Math.round(d.Area);

    tooltip
        .style("opacity", 1)
        .html("Tendencia: " + trendRange + "<br>" + "Superficie: " + area)
        .style("left", (event.pageX + 30) + "px")
        .style("top", (event.pageY + 30) + "px");
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
})

.on("mousemove", function(event, d) {
    tooltip
        .style("left", (event.pageX + 30) + "px")
        .style("top", (event.pageY + 30) + "px");
})
.on("mouseout", function(d) {
    tooltip
        .style("opacity", 0);
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
})
.transition()
.duration(800)
.attr("y", d => y(d.Area))
.attr("height", d => height - y(d.Area))
.delay((d, i) => i * 100);

    // Etiqueta title  X =  Área (km2)
   // Etiqueta title
   
   var x_title = 0;
   
   svg.append("text")
   .attr("text-anchor", "center")
   .attr("font-family", "Arial")
   .attr("font-size", "20px")
   .attr("x", x_title)
   .attr("y", -25)
   .text("5. Superficie por tendencia anual");

   // Etiqueta SUb titulo
svg.append("text")
   .attr("text-anchor", "center")
   .attr("font-family", "Arial")
   .attr("font-size", "16px")
   .style("fill", "grey")
   .attr("x", x_title + 23)
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
// Texto "Superficie (km"
// Texto "Superficie (km"
svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("transform", "rotate(-90)")
   .attr("y", -50)
   .attr("x", -80)
   .text("Superficie (km");

// Texto "2)" en superíndice
svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "10")  // Tamaño más pequeño para el superíndice
   .attr("transform", "rotate(-90)")
   .attr("y", -50 - 3)  // Posición ajustada para el superíndice
   .attr("x", -80 + 7)  // Posición ajustada para el superíndice
   .text("2");

// Texto ")" en tamaño normal
svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("transform", "rotate(-90)")
   .attr("y", -50)
   .attr("x", -80 + 11)  // Posición ajustada para seguir al superíndice
   .text(")");
    // Animación
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.Area))
        .attr("height", d => height - y(d.Area))
        .delay((d, i) => i * 100);


// Crear un botón de exportación dentro del SVG
var button = svg.append("foreignObject")
    .attr("width", 30) // ancho del botón
    .attr("height", 40) // alto del botón
    .attr("x", width - 25) // posiciona el botón en el eje x
    .attr("y",-48) // posiciona el botón en el eje Y
    .append("xhtml:body")
    .html('<button type="button" style="width:100%; height:100%; border: 0px; border-radius:5px; background-color: transparent;"><img src="images/descarga.png" alt="descarga" width="20" height="20"></button>')
    .on("click", function() {
        var columnNames = Object.keys(data[0]); 

        // Crea una nueva fila con los nombres de las columnas y agrega tus datos
        var csvData = [columnNames].concat(data.map(row => Object.values(row))).join("\n");
        
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var fileName = "Superficie_Por_Tendencia_Anual_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });



}
