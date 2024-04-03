import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función para dibujar el gráfico 
export async function c_elev(watershed) {
    // set the dimensions and margins of the graph

const margin = { top: 80, right: 0, bottom: 60, left: 80 };
    const width = 250 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    const svg = d3.select("#p08")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//elev//elev_BNA_";
    const text_end = ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    // Load the data
    const data = await d3.csv(watershed_selected);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 1.05*d3.max(data, function(d) { return +d.Area;} )])
        .range([0, width])

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(3))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .domain(data.map(d => d.Elevation))
        .range([height, 0])
        .padding(0.1);

        const yAxis = d3.axisLeft(y)
        .tickValues(y.domain().filter(function(d,i){ return !(i%5)}));
      
      const gX = svg.append("g").call(yAxis);


    //svg.append("g")
    //    .call(d3.axisLeft(y))
    //    .selectAll("text")
    //    .style("font-size", "7px"); 

    // Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.Elevation))
        .attr("width", d => x(d.Area))
        .attr("height", y.bandwidth())
        .attr("fill", "#FFAA00");

    // Título principal del gráfico
     // Etiqueta title
     svg.append("text")
     .attr("text-anchor", "center")
     .attr("font-family", "Arial")
     .attr("font-size", "20px")
     .attr("x", -70)
     .attr("y", -25)
     .text("7. Área por elevación");
  
// Etiqueta SUb titulo
    svg.append("text")
        .attr("text-anchor", "bot")
        .attr("font-family", "Arial")
        .attr("font-size", "16px")
        .style("fill", "grey")
        .attr("x", -36 )
        .attr("y", -10)
        .text("Cuenca: "+ watershed);


// Etiqueta del eje X

   var text = svg.append("text")
   .attr("x", width / 18)
   .attr("y", height + 40)
   .attr("text-anchor", "center")
   .style("font-size", "14px")
   .attr("font-family","Arial");

   text.append("tspan")
   .text("Área (km");

   text.append("tspan")
   .attr("baseline-shift", "super")
   .attr("font-size", "10px")
   .text("2");

   text.append("tspan")
   .attr("baseline-shift", "baseline")
   .attr("font-size", "14px")
   .text(")");



    // Etiqueta del eje Y
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -80)
        .text("Elevación (msnm)");

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
        var fileName = "Área_Por_Elevación_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
