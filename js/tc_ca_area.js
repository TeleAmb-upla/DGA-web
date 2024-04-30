import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function tc_ca_area() {

    const margin = { top: 10, right: 0, bottom: 40, left: 10 };
    const width = 160 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Crear un nuevo SVG y agregarlo al cuerpo del documento
    const svg = d3.select("#p05").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(0," + margin.top + ")");

    // Creación del tooltip
    var tooltip = d3.select("#p05")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");

    const data = await d3.csv("csv/total/tc_ca_area.csv");

    const y = d3.scaleBand()
        .rangeRound([0, height], .3)
        .paddingInner(0.1) // Agrega un pequeño espacio entre las bandas
        .paddingOuter(0.2); // Agrega espacio adicional en los bordes del eje Y

    const x = d3.scaleLinear()
        .rangeRound([11, width]);

    const color = d3.scaleOrdinal()
                .range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"]);

    color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

    const xAxis = d3.axisBottom(x).ticks(3);

    const yAxis = d3.axisLeft(y).tickFormat(function (d) { return ''; });

    data.forEach(function(d) {
        d["Strongly disagree"] = +d[1];
        d["Disagree"] = +d[2];
        d["Neither agree nor disagree"] = +d[3];
        d["Agree"] = +d[4];
        d["Strongly agree"] = +d[5];
        let x0 = -1*(d["Neither agree nor disagree"]/2+d["Disagree"]+d["Strongly disagree"]);
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

    x.domain([min_val, max_val]).nice();
  
    y.domain(data.map(function(d) { return d.Question; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") // saca la linea del eje X
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
    
    
     function formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
          }
    
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
            let cobertura = -(d.data["1"] ? parseFloat(d.data["1"]) : 0) + (d.data["5"] ? parseFloat(d.data["5"]) : 0);
            tooltip
                .html("Cuenca: " + d.data.Question + "<br>" + 
                      "Cambio área de nieve: " + formatNumber(Math.round(cobertura)) + " km²"
                      )
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
        .attr("y2", height);
    
    // Add title to graph
    
    // TITULO PARA AGREGARLE EL ELEVADO AL 2
    var text = svg.append("text")
    .attr("x", 20)
    .attr("y", 585)
    .attr("text-anchor", "center")
    .style("font-size", "14px")
    .attr("font-family","Arial");
    
    text.append("tspan")
    .text("Área de nieve (km");
    
    text.append("tspan")
    .attr("baseline-shift", "super")
    .attr("font-size", "10px")
    .text("2");
    
    text.append("tspan")
    .attr("baseline-shift", "baseline")
    .attr("font-size", "14px")
    .text(")");
    }
    