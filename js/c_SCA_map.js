import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función para dibujar el gráfico 
export async function c_SCA_map(watershed) {
    
    // Text to create .png file
    const text_ini = "images/map_SP_BNA_";
    const text_end = ".png";

    // .png file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);
    const img = document.createElement("img");
    img.src = watershed_selected;
    const src = document.getElementById("p02");
    src.appendChild(img);
   
    
}
