// Importación de D3.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función principal para dibujar el gráfico
export async function tc_SP_SCA(index) {
    // Definición de márgenes, ancho y alto
    const margin = { top: 10, right: 0, bottom: 40, left:90 };
    const width = 230 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Creación del SVG
    const svg = d3.select("#p02").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Creación del tooltip
    var tooltip = d3.select("#p02")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");

    // Carga de datos
    const data = await d3.dsv(",", "csv/total/tc_SP_SCA.csv", function(d) {
        return {
            Question: d.Question,
            "1": +d["1"],
            "2": +d["2"],
            "3": +d["3"],
            "4": +d["4"],
            "5": +d["5"]
        };
    });

    // Definición de escalas y ejes
    const y = d3.scaleBand()
        .rangeRound([0, height], .3)
        .paddingInner(0.1) // Agrega un pequeño espacio entre las bandas
        .paddingOuter(0.2); // Agrega espacio adicional en los bordes del eje Y

    const x = d3.scaleLinear()
        .rangeRound([0, width ]);

    const color = d3.scaleOrdinal()
        .range(["blue", "orange", "yellow", "orange", "blue"]);

    color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

    const xAxis = d3.axisBottom(x) //para abajo la etiqueta
    .ticks(5)
    .tickFormat(function(d) { return Math.abs(d); }); // pasen de - a +

    const yAxis = d3.axisLeft(y);

    // Transformación de datos
    data.forEach(function(d) {
        d["Strongly disagree"] = +d["1"];
        d["Disagree"] = +d["2"];
        d["Neither agree nor disagree"] = +d["3"];
        d["Agree"] = +d["4"];
        d["Strongly agree"] = +d["5"];
        let x0 = -1 * (d["Neither agree nor disagree"] + d["Disagree"] + d["Strongly disagree"]);
        let idx = 0;
        d.boxes = color.domain().map(function(name) {
            return { name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1], data: d };
        });
    });

    const min_val = d3.min(data, function(d) {
        return d.boxes["0"].x0;
    });

    const max_val = d3.max(data, function(d) {
        return d.boxes["4"].x1;
    });

    x.domain([min_val * 1.1, 0]);
  
    y.domain(data.map(function(d) { return d.Question; }));
    
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") 
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
        .style("fill", function(d) { return color(d.name); })
        .on("mouseover", function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1);
        })
        .on("mousemove", function(event, d) {
            tooltip
                .html("Cuenca: " + d.data.Question + "<br>" + 
                      "Permanente: " + d.data["1"] + " %" + "<br>" + 
                      "Estacional: " + d.data["2"] + " %" + "<br>" + 
                      "Intermitente: " + d.data["3"]+ " %")
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY + 30) + "px");
        })
        .on("mouseout", function(d) {
            tooltip
                .style("opacity", 0);
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8);
        });

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
        .attr("y2", height)
        .style("stroke", "transparent");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family","Arial")
        .attr("font-size","12")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 50)
        .attr("x", -margin.top - 180)
        .text("Cuencas (cod BNA)");

    // Add title to graph
    svg.append("text")
        .attr("x", -10)
        .attr("y", 585)
        .attr("text-anchor", "center")
        .style("font-size", "14px")
        .attr("font-family","Arial")
        .text("Cobertura de nieve (%)");

    const legendData = ["Permanente", "Estacional", "Intermitente"];
    const legendColors = ["blue", "orange", "yellow"];
    const legendTexts = ["Permanente", "Estacional", "Intermitente"];

    for (let i = 0; i < legendData.length; i++) {
        svg.append("rect")
            .attr("x", 9)
            .attr("y", 80 + 22 * i)
            .attr('height', 8)
            .attr('width', 8)
            .style("fill", legendColors[i]);

        svg.append("text")
            .attr("x", 21)
            .attr("y", 85 + 22 * i)
            .text(legendTexts[i])
            .style("font-size", "11px")
            .attr("font-family", "Arial")
            .attr("alignment-baseline", "middle");
    }
}
