import { Request, Response } from "express";
import { log } from 'console';
import { Blockchain } from "../models/blockchainModels";
import { Votacion } from "../models/votacionesModelsInterface";
import { pool } from "../DB/conexionDB";

let BLOCK_CHAIN: Blockchain;



export const registrarVoto = async (req: Request, res: Response) => {
    try {
        const id_est = req.userId;
        if (!id_est) return res.status(200).jsonp({ cod: "ERROR", message: "No esiste identificacion de usuario" });

        const [user] = await pool.query('UPDATE usuario SET uservoto = true WHERE id_usuario = $1 RETURNING id_usuario', [id_est]).then(result => { return result.rows })

        BLOCK_CHAIN = new Blockchain();
        const [votacion]: Votacion[] = req.votacion;
        const filename = votacion.periodo_votacion + votacion.descripcion_votacion.trim();
        await BLOCK_CHAIN.getDataArchivo(filename)
        BLOCK_CHAIN.createBlock(filename, req.body);

        return res.status(200).jsonp({ cod: "OK", message: "Voto Registrado" });
    } catch (error) {
        return res.status(500).jsonp({ cod: "ERROR", message: "Falla de la BDD" });
    }
};

export const verVotos = async(req: Request, res: Response) => {

    try {
        if (req.votacion == undefined || req.votacion.length == 0) {
            return res.status(200).jsonp([]);
        }
        const [votacion]: Votacion[] = req.votacion;
        BLOCK_CHAIN = new Blockchain(); 
        await BLOCK_CHAIN.getDataArchivo(votacion.periodo_votacion + votacion.descripcion_votacion.trim())
        return res.status(200).jsonp(BLOCK_CHAIN.verVotos());
    } catch (error: any) {
        log(error);
        return res.status(200).jsonp({ cod: "ERROR", message: error.message });
    }
}