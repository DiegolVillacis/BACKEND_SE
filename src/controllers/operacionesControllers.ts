import { Request, Response } from "express";
import { pool } from '../DB/conexionDB'
import { Menu } from "../models/navegacionItemsModels";
import { secuencia } from '../security/securityBlock';
import { Operaciones } from "../models/operacionesModels";
import { Rol } from "../models/rolModels";
import { MenuAtributos, RolAtributos, OperacionesAtributos } from "models/userModels";


export const obtenerMenu = async (req: Request, res: Response) => {
    try {
        const subquery = '(select s.nombre_rol from rol s where s.id_rol = t.id_rol) as nrol';
        const q = `SELECT t.*, ${subquery} FROM menu t order by t.id_rol`
        
        const menu = await pool.query(q).then(result => { return result.rows });

        return res.status(200).jsonp({ cod: "OK", message: "", menu });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};

export const obtenerTransaccion = async (req: Request, res: Response) => {
    try {
        const q = `SELECT t.* FROM operaciones t order by t.direccion_operacion`

        const operaciones = await pool.query(q).then(result => { return result.rows });

        return res.status(200).jsonp({ cod: "OK", message: "", operaciones });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};



export const obtenerRol = async (req: Request, res: Response) => {
    try {
        const q = `SELECT t.* FROM rol t order by t.id_rol`
        
        const rol = await pool.query(q).then(result => { return result.rows });

        return res.status(200).jsonp({ cod: "OK", message: "", rol });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};

export const mantenimientoMenu = async (req: Request, res: Response) => {
    try {
        const {update} = req.query;
        let menu: MenuAtributos = req.body.data;
        switch (update) {
            case '0': // Graba
                const sec: number = await secuencia('menu','id_menu')
                menu.id_menu = sec + 1;
                await Menu.create(menu,{ returning: false});
                break;
            case '1': // Actualiza
                await Menu.update(menu, { where: { id_menu: menu.id_menu } });
                break;
            default:
                throw new Error("ERROR EN LA TRANSACCION");
        }        

        return res.status(200).jsonp({ cod: "OK", message: "Transaccion exitosa" });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};

export const mantenimientoTransaccion = async (req: Request, res: Response) => {
    try {
        const {update} = req.query;
        let operaciones: OperacionesAtributos = req.body.data;
        switch (update) {
            case '0': // Graba
                await Operaciones.create(operaciones,{ returning: false});
                break;
            case '1': // Actualiza
                await Operaciones.update(operaciones, { where: { archivo_operacion: operaciones.archivo_operacion } });
                break;
            default:
                throw new Error("ERROR EN LA TRANSACCION");
        }        

        return res.status(200).jsonp({ cod: "OK", message: "Transaccion exitosa" });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};

export const mantenimientoRol = async (req: Request, res: Response) => {
    try {
        const {update} = req.query;
        let rol: RolAtributos = req.body.data;
        switch (update) {
            case '0': // Graba
                const sec: number = await secuencia('rol','id_rol')
                rol.id_rol = sec + 1;
                await Rol.create(rol,{ returning: false});
                break;
            case '1': // Actualiza
                await Rol.update(rol, { where: { id_rol: rol.id_rol } });
                break;
            default:
                throw new Error("ERROR EN LA TRANSACCION");
        }        

        return res.status(200).jsonp({ cod: "OK", message: "Transaccion exitosa" });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};