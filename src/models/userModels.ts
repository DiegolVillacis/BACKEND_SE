export interface User {
    id_usuario: number,
    fullname: string,
    nombre_usuario: string,
    apellido_usuario: string,
    cedula_usuario: string,
    correo_usuario: string,
    rol_usuario: number,
    iniciales: string,
    uservoto: boolean,
    matriculado: boolean | null,
    userestudiante: boolean | null,
    pass_usuario: string,
    habilitado_rol?: boolean
    duracion_rol?: number,
    nrol?: string
}

export interface UsuarioAtributos {
    id_usuario: number
    nombre_usuario: string
    apellido_usuario: string
    cedula_usuario: string
    pass_usuario: string
    correo_usuario: string
    rol_usuario: number
    matriculado: boolean
    uservoto: boolean
    userestudiante: boolean
    createdat: Date
    updatedat: Date | null
}

export interface Menu {
    id_menu: number,
    id_rol: number,
    direccion_menu: string | null,
    id_recursivo: number | null,
    nombre_menu: string,
    icono_menu: string,
    opcion_crear: boolean,
    opcion_editar: boolean,
    opcion_eliminar: boolean,
    mostrar_menu: boolean,
    hijos?: Menu[]
}

export interface MenuAtributos {
    id_menu: number
    id_rol: number,
    direccion_menu: string,
    id_recursivo: number,
    nombre_menu: string,
    icono_menu: string,
    opcion_crear: boolean,
    opcion_editar: boolean,
    opcion_eliminar: boolean,
    mostrar_menu: boolean,
}

export interface OperacionesAtributos {
    direccion_operacion: string,
    archivo_operacion: string,
}

export interface RolAtributos {
    id_rol: number,
    nombre_rol: string,
    duracion_rol: number,
    habilitado_rol: boolean,
};