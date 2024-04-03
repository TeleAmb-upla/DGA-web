
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
          .domain([0, 1.2*d3.max(data, function(d) { return +d.P75; })]) // Eje Y cambiar
          .range([ height, 0 ]);

        svg.append("g")
          .call(d3.axisLeft(y));

        // Show confidence interval
        svg.append("path")
          .datum(data)
          .attr("fill", "#cce5df")
          .attr("stroke", "none")
          .attr("d", d3.area()
            .x(function(d) { return x(d.Month) })
            .y0(function(d) { return y(d.P75) })
            .y1(function(d) { return y(d.P25) })
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
            .x(function(d) { return x(d.Month) })
            .y(function(d) { return y(d.Mean) })
            .curve(d3.curveCatmullRom.alpha(0.5))
            );

        // Etiqueta title
        svg.append("text")
          .attr("text-anchor", "center")
          .attr("font-family", "Arial")
          .attr("font-size", "20px")
          .attr("x", -10)
          .attr("y", -30)
          .text("10. Cobertura de nieve promedio mensual");
        // Etiqueta SUb titulo

          svg.append("text")
          .attr("text-anchor", "center")
          .attr("font-family", "Arial")
          .attr("font-size", "16px")
          .style("fill", "grey")
          .attr("x", + 40)
          .attr("y", -10)
          .text("Cuenca: "+ watershed);

        // Etiqueta del eje X
          svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-family", "Arial")
          .attr("font-size", "13")
          .attr("x", width / 2 + 15)
          .attr("y", height + 40)
          .text("Mes");

        // Etiqueta del eje Y
          svg.append("text")
          .attr("text-anchor", "end")
          .attr("font-family", "Arial")
          .attr("font-size", "13")
          .attr("transform", "rotate(-90)")
          .attr("y", -30)
          .attr("x", -60)
          .text("Cobertura de nieve (%)");

// Crear un botón de exportación dentro del SVG
var button = svg.append("foreignObject")
    .attr("width", 30) // ancho del botón
    .attr("height", 40) // alto del botón
    .attr("x", width - 25) // posiciona el botón en el eje x
    .attr("y",-48) // posiciona el botón en el eje Y
    .append("xhtml:body")
    .html('<button type="button" style="width:100%; height:100%; border: 0px; border-radius:5px; background-color: transparent;"><img src="images/descarga.png" alt="descarga" width="20" height="20"></button>')
    .on("click", function() {
        var columnNames = Object.keys(data[0]); 

        // Crea una nueva fila con los nombres de las columnas y agrega tus datos
        var csvData = [columnNames].concat(data.map(row => Object.values(row))).join("\n");
        
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var fileName = "Cobertura_De_Nieve_Mensual_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


    } catch (error) {
        console.error('Error loading data:', error);
    }



}

