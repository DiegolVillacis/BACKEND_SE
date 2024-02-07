import { pool } from '../DB/conexionDB';
import { log } from 'console';
import { Menu } from 'models/userModels';



export const verMenuRol = async (rol: number) => {
    const q = `SELECT * FROM menu WHERE id_rol = ${rol} order by id_recursivo`;
    try {
        const menu = await pool.query(q).then(result => { return result.rows });
        let menunode: any = [];
        if (menu.length > 0) {
            const menupadres = menu.filter((o: Menu) => { return o.direccion_menu == null && o.id_recursivo == null });
            menupadres.forEach((o: Menu) => {
                o.hijos = menu.filter((m: Menu) => { return o.id_menu == m.id_recursivo })
                menunode.push(o)
            })
        }
        return menunode;
    } catch (error) {
        return []
    }
}




export const secuencia = async (tname: string, pk: string) => {

    try {
        const q = `SELECT MAX( ${pk} ) as ${tname} FROM ${tname} `
        const secuencia: any[] = await pool.query(q).then(result => { return result.rows });
        if (secuencia.length === 0) {
            return 0;
        }
        return secuencia[0][tname];
    } catch (error) {
        throw new Error("ERROR EN LA EJECUCION DE SECUENCIA");
    }
}




export const getParametros = async function (nombre: string) {
    try {
        const query = `select texto from parametros where nombre = $1`;
        const [ item ] = await pool.query(query, [nombre]).then( (result) => { return result.rows});
        return (item == undefined) ? "" : item.texto;
    } catch (error) {
        log(error);
        return ''
    }
}