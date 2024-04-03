import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export async function c_SCA_y_elev(watershed) {
    // set the dimensions and margins of the graph
    const margin = { top: 80, right: 0, bottom: 60, left: 100 };
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
    const myGroups = Array.from(new Set(data.map(d => d.Year)));
    const myVars = Array.from(new Set(data.map(d => d.Elevation)));
   

// Build X scales and axis:
const x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.05);
svg.append("g")
    .style("font-size", 10) //Modifica el tamaño de la letra 
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format(".0f")).tickSize(3)) // Aquí se formatean los ticks
    .selectAll("text") //manter
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end"); //mantener para mover de grados

      // Build Y scales and axis:
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(myVars)
      .padding(0.05);
   const yAxis = d3.axisLeft(y)
      .tickValues(y.domain().filter(function(d,i){ return !(i%5)}));
    
    const gX = svg.append("g").call(yAxis);


    const colorScaleThreshold = d3
  .scaleThreshold()
  .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
  .range(["#FFFFE6", "#FFFFB4", "#FFEBBE", "#FFD37F", "#FFAA00", "#E69800", "#70A800", "#00A884", "#0084A8", "#004C99"])

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

  // Tres funciones que cambian la información sobre herramientas cuando el usuario pasa el cursor/mueve/sale de una celda
    var mouseover = function(d) {
      tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function (event, d) {
      var SCA = Number(d.SCA); // era una cadena y habla que pasarla a numero
      tooltip
          .html( "Elevación: " + d.Elevation + "<br>" 
               + "Cobertura: " + SCA.toFixed(1) + "<br>"  //tofixed es para definir la cantiada de decimales al mostrar.
               + "Año: " + d.Year)
          .style("left", (event.pageX + 30) + "px") 
          .style("top", (event.pageY) + "px")
    }
    
       
    var mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    
    // add the squares
    svg.selectAll()
        .data(data, function (d) { return d.Year + ':' + d.Elevation; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.Year); })
        .attr("y", function (d) { return y(d.Elevation); })
        //.attr("rx", 4)
        //.attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return colorScaleThreshold(d.SCA); })
        .style("stroke-width", 1)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // Add title to graph

    var x_title = 0;

    svg.append("text")
        .attr("x", x_title - 30)
        .attr("y", -20)
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .style("font-size", "20px")
        .text("6. Cobertura de nieve promedio por elevación");

    // Add subtitle to graph
    svg.append("text")
        .attr("x", x_title + 20)
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
        .attr("y", -40)
        .attr("x", -80)
        .text("Elevación (msnm)");

    // Etiqueta del eje X
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("x", width / 2 + 30)
        .attr("y", height + 40)
        .text("Años");

// Crear un botón de exportación dentro del SVG
var button = svg.append("foreignObject")
    .attr("width", 30) // ancho del botón
    .attr("height", 40) // alto del botón
    .attr("x", width - 25) // posiciona el botón en el eje x
    .attr("y",-40) // posiciona el botón en el eje Y
    .append("xhtml:body")
    .html('<button type="button" style="width:100%; height:100%; border: 0px; border-radius:5px; background-color: transparent;"><img src="images/descarga.png" alt="descarga" width="20" height="20"></button>')
    .on("click", function() {
        var columnNames = Object.keys(data[0]); 

        // Crea una nueva fila con los nombres de las columnas y agrega tus datos
        var csvData = [columnNames].concat(data.map(row => Object.values(row))).join("\n");
        
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var fileName = "Cobertura_De_Nieve_Promedio_Por_Elevacíon_" + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


      }
