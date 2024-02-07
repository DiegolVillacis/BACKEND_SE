import { Request, Response } from "express";
import {pool} from "../DB/conexionDB";
import fs from 'fs';

export const subirImageLista = async (req: Request, res: Response) => {

    try {
        const imagenfile:any = req['files'];
        if (imagenfile === null) {
            return res.status(200).jsonp({ cod: "OK", message: '' });
        }
        let data = fs.readFileSync(imagenfile.image.tempFilePath);
        const base64 = 'data:' + imagenfile.image.mimetype +';base64,' + data.toString('base64');
        const logo = imagenfile.image.name;
        const id_lista = req.params.id_lista;
        await pool.query('UPDATE listaestudiantil SET logo = $1, contenido = $3 WHERE id = $2', [logo, id_lista, base64])
    
        return res.status(200).jsonp({ cod: "OK", message: 'Foto guardada' });
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la subida de la imagen' });
    }
}

export const getListasElectoral = async (req: Request, res: Response) => {
    const id_proceso = req.params.id_proceso;
    try {
        const LISTA = await pool.query('SELECT * FROM listaestudiantil WHERE id_proceso = $1 ORDER BY id ASC', [id_proceso]).then(result => {
            return result.rows
        })
        if (LISTA.length === 0) {
            return res.status(200).jsonp({ cod: "OK", message: 'Agregar lista de postulantes' })
        } else {
            return res.status(200).jsonp({ cod: "OK", message: "", LISTA })
        }
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }

}

export const createListas = async (req: Request, res: Response) => {
    const { nom_lista, descripcion, estado, id_proceso } = req.body;
    try {

        const lista = await pool.query('INSERT INTO listaestudiantil(nom_lista, descripcion, estado, id_proceso) VALUES($1, $2, $3, $4) RETURNING id', [nom_lista, descripcion, estado, id_proceso]);

        return res.status(200).jsonp({
            id: (lista.rows.length > 0) ? lista.rows[0].id : null,
            cod: "OK",
            message: 'Registro ingresado con éxito'
        })
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }

}

export const actualizarListas = async (req: Request, res: Response) => {
    const { id, nom_lista, descripcion, estado, id_proceso } = req.body;
    try {
        const lista = await pool.query('UPDATE listaestudiantil SET nom_lista = $1, descripcion = $2, estado = $3, id_proceso = $4 WHERE id = $5 RETURNING id', [nom_lista, descripcion, estado, id_proceso, id]);

        return res.status(200).jsonp({
            id: (lista.rows.length > 0) ? lista.rows[0].id : null,
            cod: "OK",
            message: 'Registro actualizado con éxito'
        })
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }

}