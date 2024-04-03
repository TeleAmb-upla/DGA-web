// Importar D3.js desde CDN
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función asincrónica para cargar y dibujar el gráfico
export async function c_SCA_y(watershed) {
    // Select watershed

    // Ruta para el archivo CSV
    var text_ini = "csv\\year\\SCA_y_BNA_";
    var text_end =  ".csv";

    var watershed_selected = text_ini.concat(watershed).concat(text_end)
    // Obtener los datos CSV
    const data = await d3.csv(watershed_selected);

    // Definir las dimensiones y márgenes del gráfico
    const margin = { top: 80, right: 0, bottom: 60, left: 100 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Crear el elemento SVG
    var svg = d3.select("#p04")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Escala X
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Year))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


        const Ymax =[0, 1.05*d3.max(data, function(d) { return +d.SCA;} )];
    // Escala Y
    var y = d3.scaleLinear()
        .domain(Ymax)
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

   // Barras
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Year))
        .attr("width", x.bandwidth())
        .attr("fill", "#004C99")
        .attr("height", d => height - y(0))
        .attr("y", d => y(0));

// Agrupar los datos por año y calcular el valor máximo para cada año
const groupedData = d3.group(data, d => d.Year);
const maxValues = Array.from(groupedData, ([year, values]) => ({year: year, value: d3.max(values, d => +d.SCA)}));

// Filtrar los valores máximos para los años 2000 a 2023
const maxValues2000To2023 = maxValues.filter(d => d.year >= 2000 && d.year <= 2023);

var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

for (var i = 0; i < maxValues2000To2023.length; i++) {
    sumX += +maxValues2000To2023[i].year;
    sumY += maxValues2000To2023[i].value;
    sumXY += (+maxValues2000To2023[i].year) * maxValues2000To2023[i].value;
    sumX2 += (+maxValues2000To2023[i].year) * (+maxValues2000To2023[i].year);
}

var slope_max = (maxValues2000To2023.length * sumXY - sumX * sumY) / (maxValues2000To2023.length * sumX2 - sumX * sumX);
var intercept_max = (sumY - slope_max * sumX) / maxValues2000To2023.length;

var Y_ini_max = 2000*(slope_max) + ( intercept_max);
var Y_fin_max = 2023*(slope_max) + ( intercept_max);

const Y_sti_ini_max = (([1.05*d3.max(data, d => +d.SCA)]-Y_ini_max)/(1.05*d3.max(data, d => +d.SCA)))*height;
const Y_sti_fin_max = (([1.05*d3.max(data, d => +d.SCA)]-Y_fin_max)/(1.05*d3.max(data, d => +d.SCA)))*height;

// nuevo csv de sen_slope

// Añadir la línea de tendencia para el promedio de los valores máximos
svg.append("line")
    .attr("class", "trendline")
    .attr("x1", 0)
    .attr("y1", Y_sti_ini_max)
    .attr("x2", width)
    .attr("y2", Y_sti_fin_max)
    .attr("stroke", "red")
    .attr("stroke-width", 1);

    var x_title = 0;

    // Etiqueta title
    svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "20px")
        .attr("x", x_title)
        .attr("y", -25)
        .text("4. Cobertura promedio de nieve anual");
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
        .text("Años");
    // Etiqueta del eje Y
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -50)
       .text("Cobertura de nieve (%)");
    // Animación
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.SCA))
        .attr("height", d => height - y(d.SCA))
        .delay((d, i) => i * 100);

// Ruta para el archivo CSV
var sen_slope_csv = "csv\\sen_slope\\sen_slope_completo.csv";

// Obtener los datos CSV
const sen_slope_s = await d3.csv(sen_slope_csv);

//console.log(sen_slope_s); 

// Buscar el valor de SCA_Sen para el COD_CUEN correspondiente
const filaEncontrada = sen_slope_s.find(d => d.COD_CUEN === `BNA_${watershed}`);

//console.log(`BNA_${watershed}`); 
//console.log(filaEncontrada); 

// VAlor de la comuna:SCA_SEN
    const valorSCA_Sen = filaEncontrada.SCA_Sen;
   // console.log(valorSCA_Sen);
    // Crear un elemento de texto en el SVG para mostrar el valor
 var text =  svg.append("text")
       .attr("x", + 220) 
       .attr("y", - 10) 
        .attr("font-family", "Arial")
       .attr("font-size", "13")
       .attr("fill", "black")
    // Agregar el texto 
text.append("tspan")
.text("Pendiente Sen: ");

      // Crear un tspan 
text.append("tspan")
.text(valorSCA_Sen)
.attr("fill", "red");

// %
text.append("tspan")
.text(" (%/año)");



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
        var fileName = "Cobertura_Promedio_De_Nieve_Anual_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });



}
