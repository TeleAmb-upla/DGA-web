import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export async function c_SCA_y_elev(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 50, right: 0, bottom: 50, left: 80};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#p06")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//year//SCA_y_elev_BNA_";
    const text_end = ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    //Read the data 
    const data = await d3.csv(watershed_selected);

    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    const myGroups = Array.from(new Set(data.map(d => d.group)));
    const myVars = Array.from(new Set(data.map(d => d.variable)));

    // Build X scales and axis:
    const x = d3.scaleBand()
      .range([0, width])
      .domain(myGroups)
      .padding(0.05);
    svg.append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove();

    // Build Y scales and axis:
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(myVars)
      .padding(0.05);
    svg.append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

    // Build color scale
    const myColor = d3.scaleLinear().domain([1, 50])
        .range(["#ffffd9", "#081d58"]);

    // create a tooltip
    const tooltip = d3.select("#p06")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    };

    const mousemove = function (event, d) {
        tooltip
            .html("The exact value of<br>this cell is: " + d.value)
            .style("left", (d3.pointer(event)[0] + 70) + "px")
            .style("top", (d3.pointer(event)[1]) + "px");
    };

    const mouseleave = function (event, d) {
        tooltip.style("opacity", 0);
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8);
    };

    // add the squares
    svg.selectAll()
        .data(data, function (d) { return d.group + ':' + d.variable; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.group); })
        .attr("y", function (d) { return y(d.variable); })
        //.attr("rx", 4)
        //.attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return myColor(d.value); })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // Add title to graph
    svg.append("text")
        .attr("x", 100)
        .attr("y", -20)
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .style("font-size", "20px")
        .text("Persistencia de nieve por elevacion");

    // Add subtitle to graph
    svg.append("text")
        .attr("x", 200)
        .attr("y", -5)
        .attr("text-anchor", "center")
        .style("font-size", "16px")
        .attr("font-family", "Arial")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Cuenca: "+ watershed);

    // Etiqueta del eje Y
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -100)
        .text("Elevacion (msnm)");

    // Etiqueta del eje X
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("x", width / 2 + 30)
        .attr("y", height + 35)
        .text("Años");


      }
