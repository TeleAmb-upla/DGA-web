

// Ahora puedes utilizar D3.js o cualquier otra biblioteca de gráficos para dibujar dentro de este SVG
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función para dibujar el gráfico 
export async function tc_SP_area() {

    const margin = { top: 50, right: 0, bottom: 10, left: 65 };
    const width = 200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Crear un nuevo SVG y agregarlo al cuerpo del documento
    const svg = d3.select("#Place1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(0," + margin.top + ")");

    const data = await d3.csv("csv/total/tc_SP_area.csv");

    const y = d3.scaleBand()
        .rangeRound([0, height], .3)
        .paddingInner(0.1) // Agrega un pequeño espacio entre las bandas
        .paddingOuter(0.2); // Agrega espacio adicional en los bordes del eje Y

    const x = d3.scaleLinear()
        .rangeRound([0, width]);

    const color = d3.scaleOrdinal()
        .range(["blue", "orange", "yellow", "orange", "blue"]);

    color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

    const xAxis = d3.axisTop(x).ticks(3); // Varible cambiable

    const yAxis = d3.axisLeft(y).tickFormat(function (d) { return ''; });

    data.forEach(function(d) {
        d["Strongly disagree"] = +d[1];
        d["Disagree"] = +d[2];
        d["Neither agree nor disagree"] = +d[3];
        d["Agree"] = +d[4];
        d["Strongly agree"] = +d[5];
        let x0 = -1 * (d["Disagree"] + d["Strongly disagree"]);
        let idx = 0;
        d.boxes = color.domain().map(function(name) {
            return { name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1] };
        });
    });

    const min_val = d3.min(data, function(d) {
        return d.boxes["0"].x0;
    });

    const max_val = d3.max(data, function(d) {
        return d.boxes["4"].x1;
    });

    x.domain([0, 25000]);
  
    y.domain(data.map(function(d) { return d.Question; }));

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    const vakken = svg.selectAll(".question")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(0," + y(d.Question) + ")"; });

    const bars = vakken.selectAll("rect")
        .data(function(d) { return d.boxes; })
        .enter().append("g").attr("class", "subbar");

    bars.append("rect")
        .attr("height", y.bandwidth()* 1) // "sombra a las barras
        .attr("x", function(d) { return x(d.x0); })
        .attr("width", function(d) { return x(d.x1) - x(d.x0); })
        .style("fill", function(d) { return color(d.name); });

    vakken.insert("rect", ":first-child")
        .attr("height", y.bandwidth())
        .attr("x", "1")
        .attr("width", width)
        .attr("fill-opacity", "0.5")
        .style("fill", "#F5F5F5")
        .attr("class", function(d,index) { return index % 2 == 0 ? "even" : "uneven"; });

    svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y2", height);

// Add title to graph
svg.append("text")
.attr("x", 40)
.attr("y", -25)
.attr("text-anchor", "center")
.style("font-size", "14px")
.attr("font-family","Arial")
.text("Area (km2)");



    }