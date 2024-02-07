export interface Votacion {
    id_votacion: number,
    descripcion_votacion: string,
    estado_votacion: boolean,
    periodo_votacion: string,
    fecha_votacion: string,
    hora_inicio: string,
    hora_final: string,
    listaestudiantil?: Listaestudiantil[]
}

export interface Listaestudiantil {
    id: number,
    nom_lista: string,
    descripcion: string,
    logo: string,
    estado: boolean,
    id_proceso: number
}

