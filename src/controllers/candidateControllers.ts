import { Request, Response } from "express";
import {pool} from "../DB/conexionDB";

export const getListaCandidatos = async (req: Request, res: Response) => {
    const lista_candidato = req.params.lista_candidato;
    try {
        const LISTA_CANDIDATOS = await pool.query('SELECT c.*, ( nombre_candidato || \' \' || apellido_candidato) as candidato FROM candidatos c WHERE lista_candidato = $1 ORDER BY id_candidato', [lista_candidato]).then(result => {
            return result.rows
        })
        if (LISTA_CANDIDATOS.length === 0) {
            return res.status(200).jsonp({ cod: "ERROR", message: 'No hay registros' })
        } else {
            return res.status(200).jsonp({ cod: "OK", message: "Lista de candidatos", LISTA_CANDIDATOS })
        }
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }

}

export const getListaCandidatosEstudiante = async (req: Request, res: Response) => {
    const lista_candidato = req.params.lista_candidato;
    try {
        const LISTA_CANDIDATOS = await pool.query('SELECT c.*, ( nombre_candidato || \' \' || apellido_candidato) as candidato FROM candidatos c WHERE lista_candidato = $1 ORDER BY id_candidato', [lista_candidato]).then(result => {
            console.log(LISTA_CANDIDATOS)
            return result.rows
        })
        if (LISTA_CANDIDATOS.length === 0) {
            return res.status(200).jsonp({ cod: "ERROR", message: 'No hay registros' })
        } else {
            return res.status(200).jsonp({ cod: "OK", message: "Lista de candidatos", LISTA_CANDIDATOS })
        }
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }

}


export const createCandidato = async (req: Request, res: Response) => {
    try {
        let { nombre_candidato, apellido_candidato, cargo_candidato, lista_candidato } = req.body
        let estado = await pool.query('SELECT estado FROM listaestudiantil WHERE id = $1', [lista_candidato]).then(result => { return result.rows[0].estado });
        
        if (estado === true) {
            await pool.query('INSERT INTO candidatos(nombre_candidato, apellido_candidato, cargo_candidato, lista_candidato) VALUES($1, $2, $3, $4)', [nombre_candidato, apellido_candidato, cargo_candidato, lista_candidato])
            return res.status(200).jsonp({ cod: "OK", message: 'Registro guardado exitosamente' })
        } else if (estado === false) {
            return res.status(200).jsonp({ cod: "ERROR", message: 'Registro no guardado, la lista electoral esta desactivada' })
        } else if (estado === undefined) {
            return res.status(200).jsonp({ cod: "ERROR", message: 'Registro no guardado, la lista electoral no existe' })
        }
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }
}

export const updateCandidato = async (req: Request, res: Response) => {
    try {
        let {id_candidato, nombre_candidato, apellido_candidato, cargo_candidato, lista_candidato } = req.body;
        let estado = await pool.query('SELECT estado FROM listaestudiantil WHERE id = $1', [lista_candidato]).then(result => { return result.rows[0].estado });
        
        if (estado === true) {
            const query = `UPDATE candidatos SET nombre_candidato = $2, apellido_candidato = $3, cargo_candidato = $4 WHERE id_candidato = $1 RETURNING id_candidato`
            const resultado = await pool.query( query, [id_candidato, nombre_candidato, apellido_candidato, cargo_candidato] ).then(result => { return result.rows})
            return res.status(200).jsonp({ cod: "OK", message: 'Registro guardado exitosamente', resultado})
        } else if (estado === false) {
            return res.status(200).jsonp({ cod: "ERROR", message: 'Registro no guardado, la lista electoral esta desactivada' })
        } else if (estado === undefined) {
            return res.status(200).jsonp({ cod: "ERROR", message: 'Registro no guardado, la lista electoral no existe' })
        }
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }
}
