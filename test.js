import fs from "fs";
import PDF from "pdf-extraction";


const dataBuffer = fs.readFileSync("./cv.pdf");

PDF(dataBuffer).then(data => {
    console.log("Texto extraído:\n", data.text);
}).catch(err => {
    console.error("Error al leer PDF:", err);
});