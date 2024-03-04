import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función para dibujar el gráfico 
export async function c_elev(watershed) {
    // set the dimensions and margins of the graph

const margin = { top: 80, right: 0, bottom: 60, left: 80 };
    const width = 200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    const svg = d3.select("#p08")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//elev//elev_BNA_";
    const text_end = ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    // Load the data
    const data = await d3.csv(watershed_selected);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 1.05*d3.max(data, function(d) { return +d.Area;} )])
        .range([0, width])

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(3))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .domain(data.map(d => d.Elevation))
        .range([height, 0])
        .padding(0.1);

        const yAxis = d3.axisLeft(y)
        .tickValues(y.domain().filter(function(d,i){ return !(i%5)}));
      
      const gX = svg.append("g").call(yAxis);


    //svg.append("g")
    //    .call(d3.axisLeft(y))
    //    .selectAll("text")
    //    .style("font-size", "7px"); 

    // Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.Elevation))
        .attr("width", d => x(d.Area))
        .attr("height", y.bandwidth())
        .attr("fill", "#FFAA00");

    // Título principal del gráfico
     // Etiqueta title
     svg.append("text")
     .attr("text-anchor", "center")
     .attr("font-family", "Arial")
     .attr("font-size", "20px")
     .attr("x", 10)
     .attr("y", -25)
     .text("Area");
  
    /*// Etiqueta SUb titulo
    svg.append("text")
        .attr("text-anchor", "bot")
        .attr("font-family", "Arial")
        .attr("font-size", "16px")
        .style("fill", "grey")
        .attr("x", width / 2  - 40)
        .attr("y", -10)
        .text("Cuenca: "+ watershed);
*/

// Etiqueta del eje X
svg.append("text")
   .attr("text-anchor", "end")
   .attr("font-family", "Arial")
   .attr("font-size", "13")
   .attr("x", width / 2 + 15)
   .attr("y", height + 40)
   .text("Area (km2)");



}
