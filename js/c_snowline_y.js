// Importar D3.js como un módulo
import * as d3 from "https://cdn.skypack.dev/d3@7";

// Definir la función asíncrona para cargar y dibujar el gráfico
export async function c_snowline_y(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 40, left: 60};
    const width = 460 - margin.left - margin.right;
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
        return { date: d.date, value: +d.value };
    });

    // Add X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { return d.date; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Prueba QUIERO QUE PARTA DESDE EL MENOR VALOR Y 
        let menor = data[0].value;

    data.forEach(element => {
      if(element.value < menor){
        menor = element.value;
      }
    });


    // Add Y axis
    var y = d3.scaleLinear()
    .domain([menor, d3.max(data, function(d) { return +d.value; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })
        );

    // Add X axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("x", width / 2 + 20)
        .attr("y", height + margin.top + 30)
        .text("Años");

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - 50)
        .text("Elevación línea de nieve (msnm)");
}
