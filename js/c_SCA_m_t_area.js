import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export async function c_SCA_m_t_area(watershed) {
    const margin = { top: 50, right: 20, bottom: 10, left: 65 };
    const width = 200 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const y = d3.scaleBand()
        .rangeRound([0, height], .3);

    const x = d3.scaleLinear()
        .rangeRound([0, width]);

    const color = d3.scaleOrdinal()
        .range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"]);

    const xAxis = d3.axisTop(x);

    const yAxis = d3.axisLeft(y);

    const svg = d3.select("#p16").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);


    // Text to create .csv file
    const text_ini = "csv//month//SCA_m_t_area_BNA_";
    const text_end = ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    const data = await d3.csv(watershed_selected);

    data.forEach(function (d) {
        // calc percentages
        d["Strongly disagree"] = +d[1];
        d["Disagree"] = +d[2];
        d["Neither agree nor disagree"] = +d[3];
        d["Agree"] = +d[4];
        d["Strongly agree"] = +d[5];
        let x0 = -1 * (d["Neither agree nor disagree"] / 2 + d["Disagree"] + d["Strongly disagree"]);
        let idx = 0;
        d.boxes = color.domain().map(function (name) {
            return { name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1] };
        });
    });

    const min_val = d3.min(data, function (d) {
        return d.boxes["0"].x0;
    });

    const max_val = d3.max(data, function (d) {
        return d.boxes["4"].x1;
    });

    x.domain([min_val, max_val]).nice();
    y.domain(data.map(function (d) { return d.Question; }));

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
        .attr("transform", function (d) { return "translate(0," + y(d.Question) + ")"; });

    const bars = vakken.selectAll("rect")
        .data(function (d) { return d.boxes; })
        .enter().append("g").attr("class", "subbar");

    bars.append("rect")
        .attr("height", y.bandwidth())
        .attr("x", function (d) { return x(d.x0); })
        .attr("width", function (d) { return x(d.x1) - x(d.x0); })
        .style("fill", function (d) { return color(d.name); });

    vakken.insert("rect", ":first-child")
        .attr("height", y.bandwidth())
        .attr("x", "1")
        .attr("width", width)
        .attr("fill-opacity", "0.5")
        .style("fill", "#F5F5F5")
        .attr("class", function (d, index) { return index % 2 == 0 ? "even" : "uneven"; });

    svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y2", height);

    const startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");

    d3.selectAll(".axis path")
        .style("fill", "none")
        .style("stroke", "#000")
        .style("shape-rendering", "crispEdges");

    d3.selectAll(".axis line")
        .style("fill", "none")
        .style("stroke", "#000")
        .style("shape-rendering", "crispEdges");

    const movesize = width / 2 - startp.node().getBBox().width / 2;
    d3.selectAll(".legendbox").attr("transform", "translate(" + movesize + ",0)");
}
