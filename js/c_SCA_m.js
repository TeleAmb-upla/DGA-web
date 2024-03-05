
    // Load d3.js module
    import * as d3 from 'https://cdn.skypack.dev/d3@7';


export async function c_SCA_m(watershed) {
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 10, bottom: 60, left: 100},
        width = 500 - margin.left - margin.right,
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
          .domain([0, 1.2*d3.max(data, function(d) { return +d.CI_right; })]) // Eje Y cambiar
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
            .curve(d3.curveCatmullRom.alpha(0.5))
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
            .curve(d3.curveCatmullRom.alpha(0.5))
            );

        // Etiqueta title
        svg.append("text")
          .attr("text-anchor", "center")
          .attr("font-family", "Arial")
          .attr("font-size", "20px")
          .attr("x", 70)
          .attr("y", -25)
          .text("Cobertura de nieve mensual");
        // Etiqueta SUb titulo

          svg.append("text")
          .attr("text-anchor", "center")
          .attr("font-family", "Arial")
          .attr("font-size", "16px")
          .style("fill", "grey")
          .attr("x", width / 2  - 40)
          .attr("y", -10)
          .text("Cuenca: "+ watershed);

        // Etiqueta del eje X
          svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-family", "Arial")
          .attr("font-size", "13")
          .attr("x", width / 2 + 15)
          .attr("y", height + 40)
          .text("Meses");

        // Etiqueta del eje Y
          svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-family", "Arial")
          .attr("font-size", "13")
          .attr("transform", "rotate(-90)")
          .attr("y", -30)
          .attr("x", -60)
          .text("Cobertura de nieve (%)");


    } catch (error) {
        console.error('Error loading data:', error);
    }
}

