import { CreationOptional, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../DB/conexionDB';

type UsuarioAtributos = {
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
  createdat: Date | null
  updatedat: Date | null
};

type UsuarioAtributosCreados = Optional<UsuarioAtributos, 'id_usuario'>;

class Usuario extends Model<UsuarioAtributos, UsuarioAtributosCreados> {
  declare id_usuario: CreationOptional<number>;
  declare nombre_usuario: string;
  declare apellido_usuario: string;
  declare cedula_usuario: string;
  declare pass_usuario: string;
  declare correo_usuario: string;
  declare rol_usuario: number;
  declare matriculado: boolean;
  declare uservoto: boolean;
  declare userestudiante: boolean;  
  declare createdat: CreationOptional<Date> | null;
  declare updatedat: CreationOptional<Date> | null;
}

Usuario.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedula_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pass_usuario: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  correo_usuario: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  rol_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  matriculado: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  uservoto: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  userestudiante: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  createdat: DataTypes.DATE,
  updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  sequelize,
  tableName: 'usuario',
  timestamps: false
})

export { Usuario };