import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

// Función para dibujar el gráfico 
export async function c_SCA_y_t_elev(watershed) {
    // set the dimensions and margins of the graph
    const margin = {top: 80, right: 100, bottom: 60, left: 0};
    const width = 25 ;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#p09")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//year//SCA_y_t_elev_BNA_";

    const text_end =  ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    // Read the data
    const data = await d3.csv(watershed_selected);

    // Labels
    const myGroups = Array.from(new Set(data.map(d => d.group)));
    const myVars = Array.from(new Set(data.map(d => d.variable)));

    // Build X scales and axis:
    const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();

    // Build Y scales and axis:
    const y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

    // Build color scale
    const myColor = d3.scaleLinear()
        .domain([-8,8])
        .range(["red", "blue"]);

    // create a tooltip
    const tooltip = d3.select("#Place1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three 
    const mouseover = function(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    };
    const mousemove = function(event, d) {
        tooltip
            .html(`The exact value of<br>this cell is: ${d.value}`)
            .style("left", `${d3.pointer(event)[0]+70}px`)
            .style("top", `${d3.pointer(event)[1]}px`);
    };
    const mouseleave = function(event, d) {
        tooltip.style("opacity", 0);
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8);
    };

    // Add the squares
    svg.selectAll()
        .data(data, d => `${d.group}:${d.variable}`)
        .enter()
        .append("rect")
            .attr("x", d => x(d.group))
            .attr("y", d => y(d.variable))
            //.attr("rx", 4)
            //.attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(d.value))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);



        // Add title to graph
        svg.append("text")
        .attr("x", 0)
        .attr("y", -25)
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .style("font-size", "20px")
        .text("Persistencia de nieve ");
    



  // Legend
  
  let legX = 30
  let legY = 10

  svg.append("text")
  .attr("x", legX-10)
  .attr("y", legY-15)
  .text("Tend (%/año)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#004C99")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+10)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#0084A8")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+20)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#00A884")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+30)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#70A800")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+40)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#E69800")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+50)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#FFAA00")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+60)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#FFD37F")
  
  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+70)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#FFEBBE")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+80)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#FFFFB4")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+90)
  .attr('height', 10)
  .attr('width', 10)
  .style("fill", "#FFFFE6")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+135+45)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "black")




  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+5)
  .text("> 10")
  .style("font-size", "9px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+5+10)
  .text("9 - 10")
  .style("font-size", "9px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+5+10+10)
  .text("8 - 9")
  .style("font-size", "9px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+5+10+10+10)
  .text("7 - 8")
  .style("font-size", "9px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+5+10+10+10+10)
  .text("6 - 7")
  .style("font-size", "9px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+5+10+10+10+10+10)
  .text("5 - 6")
  .style("font-size", "9px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15)
  .text("30 - 40")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15)
  .text("20 - 30")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15+15)
  .text("10 - 20")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15+15+15)
  .text("0 - 10")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX)
  .attr("y", legY+7+15+15+15+15+15+15+15+15+15+30)
  .text("Nubes (%)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15+15+15+30+15)
  .text(">30")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")







        }
