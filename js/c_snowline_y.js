// Importar D3.js como un módulo
import * as d3 from "https://cdn.skypack.dev/d3@7";

// Definir la función asíncrona para cargar y dibujar el gráfico
export async function c_snowline_y(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 80, right: 0, bottom: 60, left: 100};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#p11")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Text to create .csv file
    const text_ini = "csv//year//snowline_y_BNA_";
    const text_end = ".csv";
    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    //Read the data
    const data = await d3.csv(watershed_selected, function(d) {
        return { Year: d.Year, Snowline_elev: +d.Snowline_elev };
    });
    // Add X axis
// Add X axis
const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(function(d) { return d.Year; }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format(".0f"))) // Aquí se formatean los ticks
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");


        // Prueba QUIERO QUE PARTA DESDE EL MENOR VALOR Y 
   

    let menor = data[0].Snowline_elev;

    data.forEach(element => {
      if(element.Snowline_elev < menor){
        menor = element.Snowline_elev*.95;
      }
    });
    
    let mayor = data[0].Snowline_elev;
    
    data.forEach(element => {
      if(element.Snowline_elev > mayor){
        mayor = element.Snowline_elev*1.02;
      }
    });
    
    //console.log(menor)
    //console.log(mayor)


    // Add Y axis

    const Ymax = [menor, mayor];
    var y = d3.scaleLinear()
    .domain(Ymax)
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
// Filtrar los valores máximos para los años 2000 a 2023

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(d.Snowline_elev); })
            .curve(d3.curveCatmullRom.alpha(0.5))
        );

// Agrupar los datos por año y calcular el valor máximo para cada año
const groupedData = d3.group(data, d => d.Snowline_elev);

// Suponiendo que 'data' es un array de objetos con 'date' y 'value'
let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, n = data.length; //número total de registros en los datos.

data.forEach(d => {
    let year = +d.Year; // Convertir la fecha a número, si es necesario
    let value = d.Snowline_elev;
    sumX += year;
    sumY += value;
    sumXY += year * value;
    sumX2 += year * year;
});

let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
let intercept = (sumY - slope * sumX) / n;

// Ahora puedes usar 'slope' e 'intercept' para calcular y dibujar tu línea de tendencia

var Y_ini_max = 2000*(slope) + (intercept);
var Y_fin_max = 2023*(slope) + (intercept);


//console.log(Y_ini_max)  
//console.log(Y_fin_max) 

const Y_sti_ini_max = ((Y_ini_max - mayor)/ (menor-mayor)) *height; 
const Y_sti_fin_max = ((Y_fin_max - mayor) / (menor-mayor)) *height;
// Añadir la línea de tendencia para el promedio de los valores máximos
svg.append("line")
    .attr("class", "trendline")
    .attr("x1", 0)
    .attr("y1", Y_sti_ini_max)
    .attr("x2", width)
    .attr("y2", Y_sti_fin_max)
    .attr("stroke", "red")
    .attr("stroke-width", 1);

      
          // Etiqueta title
    svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "20px")
        .attr("x", 0)
        .attr("y", -25)
        .text("8. Elevación línea de nieve anual");
          // Etiqueta SUb titulo
    svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "16px")
        .style("fill", "grey")
        .attr("x", 23)
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

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 55)
        .attr("x", -margin.top + 50)
        .text("Elevación de línea de nieve (msnm)");


// Ruta para el archivo CSV
var sen_slope_csv = "csv\\sen_slope\\sen_slope_completo.csv";

// Obtener los datos CSV
const sen_slope_s = await d3.csv(sen_slope_csv);

//console.log(sen_slope_s); 

// Buscar el valor de SCA_Sen para el COD_CUEN correspondiente
const filaEncontrada = sen_slope_s.find(d => d.COD_CUEN === `BNA_${watershed}`);


// VAlor de la comuna:SCA_SEN
    const valorSCA_Sen = filaEncontrada.snowline_Sen; 

    // Crear un elemento de texto en el SVG para mostrar el valor
var text =  svg.append("text")
       .attr("x", + 230) 
       .attr("y", - 10) 
       .attr("font-family", "Arial")
       .attr("font-size", "13")
       .attr("fill", "black")
       
// Agregar el texto 
text.append("tspan")
    .text("Pendiente Sen:");

// Crear un tspan 
text.append("tspan")
    .text(valorSCA_Sen)
    .attr("fill", "red");

// %
text.append("tspan")
.text(" (m/año)");



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
        var fileName = "Elevación_Línea_De_Nieve_Anual_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });






}
