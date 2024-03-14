import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función para dibujar el gráfico 
export async function c_SCA_trend_map(watershed) {
    
    // Text to create .png file
    const text_ini = "images//map_SP_trend_BNA//map_SP_trend_BNA_";
    const text_end = ".png";

    // .png file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);
    const img = document.createElement("img");

    // Mantén la relación de aspecto original
    const originalWidth = '760px'; // real ancho
    const originalHeight = '527px'; // real largo
    const targetWidth = '450px'; // tamaño esperado
    const scaleFactor = targetWidth / originalWidth; // tamaño esperado dividio por el original
    const targetHeight = originalHeight * scaleFactor; // y el largo dividio por la division de los dos anchos

    img.setAttribute('height', targetHeight );
    img.setAttribute('width', targetWidth);
    img.src = watershed_selected;
    const src = document.getElementById("p03");
    src.appendChild(img);
}
