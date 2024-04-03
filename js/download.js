// Importar D3.js desde CDN
import * as d3 from "https:\\cdn.jsdelivr.net/npm/d3@7/+esm";
// Importar JSZip y FileSaver


// Función asincrónica para cargar y dibujar el gráfico
export async function download(watershed) {

   // Definir las dimensiones y márgenes del gráfico
    const margin = { top: 80, right: 0, bottom: 60, left: 100 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

   //Crear el elemento SVG
    var svg = d3.select("#download")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


   // csv para texto final 
    var csv =  ".csv";

    // Ruta para el archivo CSV de SCA_y_BNA_
    var SCA_y_BNA_text_ini = "csv\\year\\SCA_y_BNA_";
    var SCA_y_BNA_watershed_selected = SCA_y_BNA_text_ini.concat(watershed).concat(csv);

    // Ruta para el archivo CSV SCA_y_t_area_BNA_
    var SCA_y_t_area_BNA_text_ini = "csv\\year\\SCA_y_t_area_BNA_";
    var SCA_y_t_area_BNA_watershed_selected = SCA_y_t_area_BNA_text_ini.concat(watershed).concat(csv);
   
    // Ruta para el archivo CSV SCA_y_elev_BNA_
    var SCA_y_elev_BNA_text_ini = "csv\\year\\SCA_y_elev_BNA_";
    var SCA_y_elev_BNA_watershed_selected = SCA_y_elev_BNA_text_ini.concat(watershed).concat(csv);

    // Ruta para el archivo CSV SCA_elev_BNA_
    var SCA_elev_BNA_text_ini = "csv\\elev\\SCA_elev_BNA_";
    var SCA_elev_BNA_watershed_selected = SCA_elev_BNA_text_ini.concat(watershed).concat(csv);

   // Ruta para el archivo CSV elev_BNA_
    var elev_BNA_text_ini = "csv\\elev\\elev_BNA_";
    var elev_BNA_watershed_selected = elev_BNA_text_ini.concat(watershed).concat(csv);

    // Ruta para el archivo CSV SCA_y_t_elev_BNA_
    var SCA_y_t_elev_BNA_text_ini = "csv\\year\\SCA_y_t_elev_BNA_";
    var SCA_y_t_elev_BNA_watershed_selected = SCA_y_t_elev_BNA_text_ini.concat(watershed).concat(csv);
    
    // Ruta para el archivo CSV snowline_y_BNA_
    var snowline_y_BNA_text_ini = "csv\\year\\snowline_y_BNA_";
    var snowline_y_BNA_watershed_selected = snowline_y_BNA_text_ini.concat(watershed).concat(csv);

    // Ruta para el archivo CSV SCA_m_BNA_
    var SCA_m_BNA_text_ini = "csv\\month\\SCA_m_BNA_";
    var SCA_m_BNA_watershed_selected = SCA_m_BNA_text_ini.concat(watershed).concat(csv);
    
    //Ruta para el archivo CSV SCA_m_elev_BNA_
   var SCA_m_elev_BNA_text_ini = "csv\\month\\SCA_m_elev_BNA_";
   var SCA_m_elev_BNA_watershed_selected = SCA_m_elev_BNA_text_ini.concat(watershed).concat(csv);
  
   // Ruta para el archivo CSV SCA_y_m_BNA_
   var SCA_y_m_BNA_text_ini = "csv\\yearMonth\\SCA_y_m_BNA_";
   var SCA_y_m_BNA_watershed_selected = SCA_y_m_BNA_text_ini.concat(watershed).concat(csv);

   //\ Ruta para el archivo CSV SCA_m_trend_BNA_
   var SCA_m_trend_BNA_text_ini = "csv\\month\\SCA_m_trend_BNA_";
   var SCA_m_trend_BNA_watershed_selected = SCA_m_trend_BNA_text_ini.concat(watershed).concat(csv);

   // Ruta para el archivo CSV SCA_ym_BNA_
   var SCA_ym_BNA_text_ini = "csv\\yearMonth\\SCA_ym_BNA_";
   var SCA_ym_BNA_watershed_selected = SCA_ym_BNA_text_ini.concat(watershed).concat(csv);

    // Ruta para el archivo CSV SCA_ym_elev_BNA_
    var SCA_ym_elev_BNA_text_ini = "csv\\yearMonth\\SCA_ym_elev_BNA_";
    var SCA_ym_elev_BNA_watershed_selected = SCA_ym_elev_BNA_text_ini.concat(watershed).concat(csv);

    // Ruta para el archivo CSV snowline_ym_BNA_
    var snowline_ym_BNA_text_ini = "csv\\yearMonth\\snowline_ym_BNA_";
    var snowline_ym_BNA_watershed_selected = snowline_ym_BNA_text_ini.concat(watershed).concat(csv);

    // Obtener los datos CSV
    var SCA_y_BNA_data = await d3.csv(SCA_y_BNA_watershed_selected);
    var SCA_y_t_area_BNA_data = await d3.csv(SCA_y_t_area_BNA_watershed_selected);
    var SCA_y_elev_BNA_data = await d3.csv(SCA_y_elev_BNA_watershed_selected);
    var SCA_elev_BNA_data = await d3.csv(SCA_elev_BNA_watershed_selected);
    var elev_BNA_data = await d3.csv(elev_BNA_watershed_selected);
    var SCA_y_t_elev_BNA_data = await d3.csv(SCA_y_t_elev_BNA_watershed_selected);
    var snowline_y_BNA__data = await d3.csv(snowline_y_BNA_watershed_selected)
    var SCA_m_BNA_data = await d3.csv(SCA_m_BNA_watershed_selected)
    var SCA_m_elev_BNA_data = await d3.csv(SCA_m_elev_BNA_watershed_selected);
    var SCA_y_m_BNA_data = await d3.csv(SCA_y_m_BNA_watershed_selected);
    var SCA_m_trend_BNA_data = await d3.csv(SCA_m_trend_BNA_watershed_selected);
    var SCA_ym_BNA_data = await d3.csv (SCA_ym_BNA_watershed_selected);
    var SCA_ym_elev_BNA_data = await d3.csv(SCA_ym_elev_BNA_watershed_selected);
    var snowline_ym_BNA_data = await d3.csv(snowline_ym_BNA_watershed_selected);

    // todas las variables de los csv.



 const all = SCA_y_BNA_data 
            + SCA_y_t_area_BNA_data 
            + SCA_y_elev_BNA_data 
            + SCA_elev_BNA_data 
            + elev_BNA_data 
            + SCA_y_t_elev_BNA_data 
            + snowline_y_BNA__data 
            + SCA_m_BNA_data 
            + SCA_m_elev_BNA_data
            + SCA_y_m_BNA_data 
            + SCA_m_trend_BNA_data
            + SCA_ym_BNA_data
            + SCA_ym_elev_BNA_data
            + snowline_ym_BNA_data 

console.log(all)

    // Crear un botón de exportación dentro del SVG
var button = svg.append("foreignObject")
    .attr("width", 50) //\ ancho del botón
    .attr("height", 50) // alto del botón
    .attr("x", 0) //posiciona el botón en el eje x
    .attr("y", height + 35) // posiciona el botón en el eje Y
    .append("xhtml:body")
    .html('<button type="button" style="width:100%; height:100%; border: 0px solid black; border-radius:5px;">Exportar</button>') //esto es html
    .on("click", function() {
        var columnNames = Object.keys(data[0]); 

        // Crea una nueva fila con los nombres de las columnas y agrega tus datos
        var csvData = [columnNames].concat(data.map(row => Object.values(row))).join("\n");
        
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var fileName = all + watershed + ".csv";
        
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

