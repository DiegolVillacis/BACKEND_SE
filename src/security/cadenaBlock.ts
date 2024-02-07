import { log } from "console";
import fs from "fs";
import path from 'path'
const DIR_PATH = "../../uploads/"



export const createRedBlockchain = (filename: string, contenido: string) => {
    try {
        const pathtotal = path.resolve(__dirname, DIR_PATH + filename+ '.json')
        fs.writeFile(pathtotal, contenido, function (err) {
            if (err) throw err;
            console.log('Archivo guardado!');
        });
    } catch (error) {
        log(error);
        throw new Error("Archivo no creado.");
    }
}



export const updateRedBlockchain = (filename: string, contenido: string) => {
    try {
        const pathtotal = path.resolve(__dirname, DIR_PATH + filename+ '.json');
        fs.writeFile(pathtotal, contenido, function (err) {
            if (err) throw err;
            console.log('Archivo guardado!');
        });
    } catch (error) {
        log(error);
        throw new Error("Archivo no actualizado.");
    }
}




export const readRedBlockchain = async(filename: string) => {
    try {
        const pathtotal = path.resolve(__dirname, DIR_PATH + filename+ '.json');
        const data = await fs.readFileSync(pathtotal,'utf8');
        const lobj  = JSON.parse(data)
        return lobj
    } catch (error) {
        log(error);
        throw new Error("Archivo no existe.");
    }
}
