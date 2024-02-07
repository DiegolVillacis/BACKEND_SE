import { Request, Response } from "express";
import { pool } from "../DB/conexionDB";
import { Blockchain } from "../models/blockchainModels";
import { Listaestudiantil, Votacion } from "../models/votacionesModelsInterface";





export const registerVotacion = async (req: Request, res: Response) => {

    let { descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final } = req.body

    try {
        const [votacion] = await pool.query('INSERT INTO votacion(descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final) VALUES($1, $2, $3, $4, $5) RETURNING id_votacion', [descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final]).then(result => { return result.rows })
        
        if (!votacion) return res.status(200).jsonp({ cod: "ERROR", message: "El proceso no se registro" });
        
        let bc = new Blockchain();

        bc.createBlockchain(periodo_votacion + descripcion_votacion.trim());
        
        return res.status(200).jsonp({ cod: "OK", message: 'Se registro el proceso' });
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }
}




export const updateVotacion = async (req: Request, res: Response) => {
    
    let { id_votacion, descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final, estado_votacion } = req.body

    try {
        const [votacion] = await pool.query('UPDATE votacion SET descripcion_votacion = $1, periodo_votacion = $2, fecha_votacion = $3, hora_inicio = $4, hora_final = $5, estado_votacion = $6 WHERE id_votacion = $7 RETURNING id_votacion', [descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final, estado_votacion, id_votacion]).then(result => { return result.rows })
        
        if (!votacion) return res.status(200).jsonp({ cod: "ERROR", message: "El proceso no se actualizo" });
        let bc = new Blockchain();
        bc.createBlockchain(periodo_votacion + descripcion_votacion.trim());
        return res.status(200).jsonp({ cod: "OK", message: 'Se actualizo el proceso' });
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }
}

export const getVotaciones = async (req: Request, res: Response) => {

    let datosConsulta: any[] = await pool.query('SELECT * FROM votacion')
        .then(result => {
            return result.rows.map(obj => {
                if (obj.estado_votacion === true) {
                    obj.estado_votacion = 'activo'
                } else if (obj.estado_votacion === false) {
                    obj.estado_votacion = 'cerrado'
                }
                return obj
            })
        });

    return res.status(200).jsonp({ cod: "OK", message: "", votaciones: datosConsulta });
}

export const getVotacionesUser = async (req: Request, res: Response) => {

    try {
        let [votacion] = await pool.query('SELECT * FROM votacion WHERE estado_votacion = true ORDER BY fecha_votacion DESC LIMIT 1')
            .then(result => {
                const votacion: Votacion[] = result.rows
                return votacion
            });

        if (!votacion) return res.status(200).jsonp({ cod: "ERROR", message: "No hay procesos electorales activos" });
    
        votacion.listaestudiantil = await pool.query('SELECT * FROM listaestudiantil WHERE id_proceso = $1 ORDER BY id ASC', [votacion.id_votacion])
            .then(result => {
                const lista: Listaestudiantil[] = result.rows
                return lista
            })

        return res.status(200).jsonp({ cod: "OK", message: "Transaccion exitosa", VOTACION: votacion });
    } catch (error) {
        return res.status(500).jsonp({ message: 'Fallo en la BDD' });
    }
}



// export const getVotacionesUser = async (req: Request, res: Response) => {
//     try {
//         let [votacion] = await pool.query('SELECT * FROM votacion WHERE estado_votacion = true ORDER BY fecha_votacion DESC LIMIT 1')
//             .then(result => {
//                 const votacion: Votacion[] = result.rows
//                 return votacion
//             });

//         if (!votacion) return res.status(200).jsonp({ cod: "ERROR", message: "No hay procesos electorales activos" });
    
//         votacion.listaestudiantil = await pool.query(`SELECT listaestudiantil.*, candidatos.nombre_candidato
//                                                         FROM listaestudiantil
//                                                         INNER JOIN candidatos ON listaestudiantil.id = candidatos.lista_candidato
//                                                         WHERE listaestudiantil.id_proceso = 7
//                                                         ORDER BY listaestudiantil.id ASC;`, [votacion.id_votacion])
//             .then(result => {
//                 const lista: Listaestudiantil[] = result.rows
//                 return lista
//             })

        

//         return res.status(200).jsonp({ cod: "OK", message: "Transaccion exitosa", VOTACION: votacion });
//     } catch (error) {
//         return res.status(500).jsonp({ message: 'Fallo en la BDD' });
//     }
// }







// export const registerVotacion = async (req: Request, res: Response) => {

//     let { descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final } = req.body

//     try {
//         const votacion = await insertSQL(descripcion_votacion, periodo_votacion, 
//                                                         fecha_votacion, hora_inicio, hora_final);

//         if (!votacion) {
//             return res.status(200).jsonp({
//                 cod: "ERROR",
//                 message: "No se guardo el proceso",
//             });
//         }

//         const blockchain = new Blockchain();
//         blockchain.createBlockchain(periodo_votacion + descripcion_votacion.trim());

//         return res.status(200).jsonp({
//             cod: "OK",
//             message: 'Se guardo el proceso',
//         });
//     } catch (error) {
//         return res.status(500).jsonp({
//             message: 'Fallo en la DB',
//         });
//     }
// };

// const insertSQL = async (descripcion_votacion: string, periodo_votacion: string, fecha_votacion: string, hora_inicio: string, hora_final: string) => {
//     try {
//         const [votingProcess] = await pool.query(
//             'INSERT INTO votacion(descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final) VALUES($1, $2, $3, $4, $5) RETURNING id_votacion',
//             [descripcion_votacion, periodo_votacion, fecha_votacion, hora_inicio, hora_final]
//         ).then(result => result.rows);

//         return votingProcess || null;
//     } catch (error) {
//         throw error;
//     }
// };