import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


export async function c_snowline_ym(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60};
    const width = 900 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

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

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
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
}
