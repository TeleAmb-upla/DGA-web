import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


export async function c_snowline_ym(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 50, right: 80, bottom: 50, left: 80};
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#p19")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//yearMonth//snowline_ym_BNA_";
    const text_end = ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

//Read the data 
const csvData = await d3.csv(watershed_selected);
const data = csvData.map(d => ({
    date: d3.timeParse("%Y-%m-%d")(d.date),
    value: +d.value
}));
    // Add X axis --> it is a date format
    const x = d3.scaleBand()
    .domain(data.map(d => d.date)) // Use the dates in your data for the domain
    .range([0, width])
    .padding(0.05);
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(function(d) { // crea eje x
        const date = new Date(d); // Convert the date string to a Date object
        const year = date.getFullYear(); //extrae los años 
        const month = date.getMonth() + 1; //extrae los meses
        const day = date.getDate(); //extrae los dias
        if ((month === 1 && day === 1) || (month === 2 && day === 1 && year === 2000)) { // primer dia del primer mes
            return year; // que aparezca solo el año
        } else {
            return "";
        }
    }))
    .selectAll("line")  // selecciona todas las marcas de línea
    .attr("y2", function(d) {
        const date = new Date(d); // Convert the date string to a Date object
        const year = date.getFullYear(); //extrae los años 
        const month = date.getMonth() + 1; //extrae los meses
        const day = date.getDate(); //extrae los dias
        if ((month === 1 && day === 1) || (month === 2 && day === 1 && year === 2000)) { // primer dia del primer mes
            return 8; // que la línea sea más larga
        } else {
            return 4; // que la línea sea más corta
        }
    });

// Prueba QUIERO QUE PARTA DESDE EL MENOR VALOR Y 

let menor = data[0].value;

data.forEach(element => {
  if(element.value < menor){
    menor = element.value*.95;
  }
});

let mayor = data[0].value;

data.forEach(element => {
  if(element.value > mayor){
    mayor = element.value*1.05;
  }
});

//console.log(menor)
//console.log(mayor)

const Ymax = [menor, mayor];

    // Add Y axis
    const y = d3.scaleLinear()
      .domain(Ymax)
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
      );


// Agrupar los datos por año y calcular el valor máximo para cada año
const groupedData = d3.group(data, d => d.date.getFullYear());
const maxValues = Array.from(groupedData, ([year, values]) => ({year: year, value: d3.max(values, d => d.value)}));

// Filtrar los valores máximos para los años 2000 a 2023
const maxValues2000To2023 = maxValues.filter(d => d.year >= 2000 && d.year <= 2023);
var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0; //

for (var i = 0; i < maxValues2000To2023.length; i++) {

  sumX += maxValues2000To2023[i].year;

  sumY += maxValues2000To2023[i].value;

  sumXY += maxValues2000To2023[i].year * maxValues2000To2023[i].value;

  sumX2 += maxValues2000To2023[i].year * maxValues2000To2023[i].year;

}

var slope_max = (maxValues2000To2023.length * sumXY - sumX * sumY) / (maxValues2000To2023.length * sumX2 - sumX * sumX);
var intercept_max = (sumY - slope_max * sumX) / maxValues2000To2023.length;

var Y_ini_max = 2000*(slope_max) + ( intercept_max);
var Y_fin_max = 2023*(slope_max) + ( intercept_max);

//console.log(Y_ini_max)  
//console.log(Y_fin_max) 


const Y_sti_ini_max = (([1.05*d3.max(data, d => +d.value)] -Y_ini_max) / (1.05*d3.max(data, d => +d.value))) *height;
const Y_sti_fin_max = (([1.05*d3.max(data, d => +d.value)] -Y_fin_max) / (1.05*d3.max(data, d => +d.value))) *height;

// Añadir la línea de tendencia para el promedio de los valores máximos
svg.append("line")
  .attr("class", "trendline")
  .attr("x1", 0)
  .attr("y1", Y_sti_ini_max)
  .attr("x2", width)
  .attr("y2", Y_sti_fin_max)
  .attr("stroke", "red")
  .attr("stroke-width", 1);


  // MINIMOS

  const minValues = Array.from(groupedData, ([year, values]) => ({year: year, value: d3.min(values, d => d.value)}));

  // Filtrar los valores mínimos para los años 2000 a 2023
  const minValues2000To2023 = minValues.filter(d => d.year >= 2000 && d.year <= 2023);
   
  var sumXmin = 0, sumYmin = 0, sumXYmin = 0, sumX2min = 0;
  //console.log (minValues2000To2023)
  for (var i = 0; i < minValues2000To2023.length; i++) {
  
    sumXmin += minValues2000To2023[i].year;
  
    sumYmin += minValues2000To2023[i].value;
  
    sumXYmin += minValues2000To2023[i].year * minValues2000To2023[i].value;
  
    sumX2min += minValues2000To2023[i].year * minValues2000To2023[i].year;
  
  }
  
  //  _min de valores minimos.
  var slope_min = (minValues2000To2023.length * sumXYmin - sumXmin * sumYmin) / (minValues2000To2023.length * sumX2min - sumXmin * sumXmin);
  var intercept_min = (sumYmin - slope_min * sumXmin) / minValues2000To2023.length;
  
  var Y_ini_min = 2000*(slope_min) + ( intercept_min);
  var Y_fin_min = 2023*(slope_min) + ( intercept_min);
  
  //console.log(Y_ini_min) //Valor = 19.7 
  //console.log(Y_fin_min) //Valor = 19.9

  // const Ymax = [menor, d3.max(data, d => d.value)];
  const Y_sti_ini_min = ((Y_ini_min - mayor)/ (menor-mayor)) *height; 
  const Y_sti_fin_min = ((Y_fin_min - mayor) / (menor-mayor)) *height;


  // Añadir la línea de tendencia para el promedio de los valores mínimos
  svg.append("line")
      .attr("class", "trendline")
      .attr("x1", 0)
      .attr("y1", Y_sti_ini_min)
      .attr("x2", width)
      .attr("y2", Y_sti_fin_min)
      .attr("stroke", "blue")
      .attr("stroke-width", 1)
      // Etiqueta title
    svg.append("text")
    .attr("text-anchor", "center")
    .attr("font-family", "Arial")
    .attr("font-size", "20px")
    .attr("x", width / 2  - 120)
    .attr("y", -25)
    .text("16. Lineas de nieve por año y mes");
 
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
        .text("Año-Mes");

// Etiqueta del eje Y
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -80)
        .text("Altura de la linea de nieve (m)");



// Ruta para el archivo CSV
var sen_slope_csv = "csv\\sen_slope\\sen_slope_sca_ym_bna.csv";

// Obtener los datos CSV
const sen_slope_s = await d3.csv(sen_slope_csv);

// Buscar el valor de SCA_Sen para el COD_CUEN correspondiente
const filaEncontrada = sen_slope_s.find(d => d.COD_CUEN === `BNA_${watershed}`);

// Obtener el valor de ValorSen_Max
const valorSen_Max = filaEncontrada.snowline_max_sen; // columna del csv

// Crear un elemento de texto en el SVG para mostrar el texto "Sen Slope Maximo:"
var text = svg.append("text")
    .attr("x", 100) 
    .attr("y", -10) 
    .attr("font-family", "Arial")
    .attr("font-size", 13)
    .attr("fill", "black");

// Agregar el texto 
text.append("tspan")
    .text("Sen Slope Maximo: ");

// Crear un tspan 
text.append("tspan")
    .text(valorSen_Max)
    .attr("fill", "red");

    text.append("tspan")
    .text(" (m/año)");
    
   // VALORES MINIMO
 const valorSen_min = filaEncontrada.snowline_min_sen; // columna del csv


// Crear un elemento de texto en el SVG para mostrar el texto "Sen Slope Minimo:"
var textMin = svg.append("text")
    .attr("x", 650) 
    .attr("y", -10) 
    .attr("font-family", "Arial")
    .attr("font-size", 13)
    .attr("fill", "black");

// Agregar el texto "Sen Slope Minimo: "
textMin.append("tspan")
    .text("Sen Slope Minimo: ");

// Crear un tspan para el valor de ValorSen_Min
textMin.append("tspan")
    .text(valorSen_min)
    .attr("fill", "blue");
  
    text.append("tspan")
    .attr("x", 790) 
    .attr("y", -10) 
    .text(" (m/año)");
    
        
}
