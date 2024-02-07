import { CreationOptional, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../DB/conexionDB';

type RolAtributos = {
  id_rol: number,
  nombre_rol: string,
  habilitado_rol: boolean,
};

type RolAtributosCreados = Optional<RolAtributos, 'id_rol'>;

class Rol extends Model<RolAtributos, RolAtributosCreados> {
  declare id_rol: CreationOptional<number>;
  declare nombre_rol: string;
  declare habilitado_rol: boolean;
}

Rol.init({
  id_rol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  habilitado_rol: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'rol',
  timestamps: false
})

export { Rol };