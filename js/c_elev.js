import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función para dibujar el gráfico 
export async function c_elev(watershed) {
    // set the dimensions and margins of the graph

 const margin = {top: 50, right: 0, bottom: 50, left: 0};
    const width = 100 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#p09")
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
        .domain([0, 600])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .domain(data.map(d => d.Elevation))
        .range([height, 0])
        .padding(0.1);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.Elevation))
        .attr("width", d => x(d.Area))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2");
}
