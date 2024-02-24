import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function tm_sp_area() {
    const margin = { top: 60, right: 30, bottom: 50, left: 80 };
    const width = 460 - margin.left - margin.right;
    const height = 400- margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#Place2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
    .append("g")    
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    const data = await d3.csv("csv/total/tm_SP_area.csv");

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){return(d.group)}).keys()

    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width], .3)
        .padding([0.2])
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 200000])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));

       // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['yellow', 'orange', 'blue'])

    // stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    // Add title to graph
    svg.append("text")
        .attr("x", -50)
        .attr("y", -25)
        .attr("text-anchor", "center")
        .style("font-size", "18px")
        .attr("font-family", "Arial")
        .text("Superficie de persistencia de nieve por macrozonas");

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "15")
        .attr("x", (width / 2) + 30)
        .attr("y", height + margin.top - 15)
        .text("Macrozonas");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "15")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - 40)
        .text("Area (Km2)")

    // Legend
    svg.append("rect")
        .attr("x", 50)
        .attr("y", 50)
        .attr('height', 15)
        .attr('width', 15)
        .style("fill", "blue")

    svg.append("rect")
        .attr("x", 50)
        .attr("y", 75)
        .attr('height', 15)
        .attr('width', 15)
        .style("fill", "orange")

    svg.append("rect")
        .attr("x", 50)
        .attr("y", 100)
        .attr('height', 15)
        .attr('width', 15)
        .style("fill", "yellow")

    svg.append("text")
        .attr("x", 75)
        .attr("y", 60)
        .text("Permanente (PN>90%)")
        .style("font-size", "12px")
        .attr("font-family", "Arial")
        .attr("alignment-baseline", "middle")

    svg.append("text")
        .attr("x", 75)
        .attr("y", 85)
        .text("Estacional (60%<PN<90%)")
        .style("font-size", "12px")
        .attr("font-family", "Arial")
        .attr("alignment-baseline", "middle")

    svg.append("text")
        .attr("x", 75)
        .attr("y", 110)
        .text("Intermitente (5%<PN<60%)")
        .style("font-size", "12px")
        .attr("font-family", "Arial")
        .attr("alignment-baseline", "middle");

}
