
    // Load d3.js module
    import * as d3 from 'https://cdn.skypack.dev/d3@7';


export async function c_SCA_m(watershed) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#p12")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    // Text to create .csv file
    var text_ini = "csv//month//SCA_m_BNA_"
    var text_end =  ".csv"

    // .csv file
    var watershed_selected = text_ini.concat(watershed).concat(text_end)

    //Read the data
    try {
        const data = await d3.csv(watershed_selected);

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
          .domain([1,12])
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0, 40])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Show confidence interval
        svg.append("path")
          .datum(data)
          .attr("fill", "#cce5df")
          .attr("stroke", "none")
          .attr("d", d3.area()
            .x(function(d) { return x(d.x) })
            .y0(function(d) { return y(d.CI_right) })
            .y1(function(d) { return y(d.CI_left) })
            )

        // Add the line
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
            );
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

