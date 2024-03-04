import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export const myColor = d3.scaleThreshold()
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

    