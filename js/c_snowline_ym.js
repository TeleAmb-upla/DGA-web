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
    const csvData = await await d3.csv(watershed_selected);
    const data = csvData.map(d => ({
        date: d3.timeParse("%Y-%m-%d")(d.date),
        value: +d.value
    }));

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

// Prueba QUIERO QUE PARTA DESDE EL MENOR VALOR Y 

let menor = data[0].value;

data.forEach(element => {
  if(element.value < menor){
    menor = element.value;
  }
});


    // Add Y axis
    const y = d3.scaleLinear()
      .domain([menor, d3.max(data, d => d.value)])
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
      // Etiqueta title
    svg.append("text")
    .attr("text-anchor", "center")
    .attr("font-family", "Arial")
    .attr("font-size", "20px")
    .attr("x", width / 2  - 120)
    .attr("y", -25)
    .text("Lineas de nieve por año y mes");
 
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
        .text("Años");

// Etiqueta del eje Y
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -80)
        .text("Cobertura de nieve (%)");
}
