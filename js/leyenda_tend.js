// Importar la biblioteca D3.js desde un CDN
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'; 

// Definir una función llamada 'leyenda' que toma un argumento: 'svg'
export async function leyenda_tend(svg){

  const colorScale = d3.scaleThreshold()
    .domain([
        -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 
         0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10
    ])
    .range([
        "#FF0000", "#FF0303", "#FF1E1F", "#FE393A", "#FE5456", "#FD6F72", "#FD8B8D", 
        "#FCA6A9", "#FCC1C5", "#FBDCE0", "#FBF7FC", "#FBF7FC", "#DFDEFC", "#C4C4FD", 
        "#A8ABFD", "#8D92FD", "#7178FE", "#565FFE", "#3A46FE", "#1F2CFF", 
        "#0313FF", "#0000FF"
    ]);
   // set the dimensions and margins of the graph
   
  let legX = 50
  let legY = 20

  // Agregar un elemento de texto a la leyenda en las coordenadas especificadas
  svg.append("text")
  .attr("x", legX-20)
  .attr("y", legY-15)
  .text("Tendencia (%/año)") // El texto que se mostrará
  .style("font-size", "11px") // Tamaño de la fuente del texto
  .attr("font-family", "Arial") // Fuente del texto
  .attr("alignment-baseline", "middle") // Alineación vertical del texto

  // Para cada valor en el dominio de la escala de colores
  colorScale.domain().forEach((value, i) => {
    // Agregar un rectángulo a la leyenda en las coordenadas especificadas
    svg.append("rect")
      .attr("x", legX)
      .attr("y", legY + i * 10)
      .attr('height', 10)
      .attr('width', 10)
      .style("fill", colorScale(value)) // El color del rectángulo será el color correspondiente en la escala de colores

    // Agregar un elemento de texto a la leyenda en las coordenadas especificadas
    svg.append("text")
      .attr("x", legX + 20)
      .attr("y", legY + i * 10 + 5)
      .text(value === -10 ? `<${value}` : value === 10 ? `>${value}` : `${value} - ${value + 1}`) // El texto que se mostrará
      .style("font-size", "9px") // Tamaño de la fuente del texto
      .attr("font-family", "Arial") // Fuente del texto
      .attr("alignment-baseline", "middle") // Alineación vertical del texto
  })

  // Agregar un elemento de texto a la leyenda en las coordenadas especificadas
  svg.append("text")
  .attr("x", legX)
  .attr("y", legY + colorScale.domain().length * 10 + 30)
  .text("Nubes (%)") // El texto que se mostrará
  .style("font-size", "12px") // Tamaño de la fuente del texto
  .attr("font-family", "Arial") // Fuente del texto
  .attr("alignment-baseline", "middle") // Alineación vertical del texto

  // Agregar un rectángulo negro a la leyenda en las coordenadas especificadas
  svg.append("rect")
    .attr("x", legX)
    .attr("y", legY + colorScale.domain().length * 10 + 40)
    .attr('height', 10)
    .attr('width', 10)
    

  // Agregar un elemento de texto a la leyenda en las coordenadas especificadas
  svg.append("text")
  .attr("x", legX + 20)
  .attr("y", legY + colorScale.domain().length * 10 + 45)
  .text(">30") // El texto que se mostrará
  .style("font-size", "10px") // Tamaño de la fuente del texto
  .attr("font-family", "Arial") // Fuente del texto
  .attr("alignment-baseline", "middle") // Alineación vertical del texto
}
