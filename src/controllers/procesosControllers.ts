import { Request, Response } from "express";
import { Usuario } from "../models/userModelsnterface";
import excel from 'xlsx';
import { QueryResult } from "pg";
import { pool } from "../DB/conexionDB";
import { log } from "console";
const SHA256 = require('crypto-js/sha256');




export const deleteMetodoGeneral = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { nametable, idreg, pkatributo } = req.query;

        // Validar si la columna de clave primaria existe en la tabla
        const columnExistsQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${nametable}' AND column_name = '${pkatributo}'`;
        const columnExistsResult: QueryResult = await pool.query(columnExistsQuery);

        if (columnExistsResult.rows.length === 0) {
            throw new Error(`La columna ${pkatributo} no existe en la tabla ${nametable}`);
        }

        // Construir la consulta de eliminación de manera dinámica
        const query = `DELETE FROM ${nametable} WHERE ${pkatributo} = '${idreg}' RETURNING *`;
        
        console.log('SQL Query:', query);

        const response: QueryResult = await pool.query(query);
        console.log('Response:', response.rows);

        return res.status(200).jsonp({ cod: "OK", message: "Registro eliminado con éxito", delete: response.rows });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(200).jsonp({ cod: "ERROR", message: error.message });
    }
};




