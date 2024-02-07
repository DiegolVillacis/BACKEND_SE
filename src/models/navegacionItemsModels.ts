import { CreationOptional, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../DB/conexionDB';

type MenuAtributos = {
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
};

type MenuAtributosCreados = Optional<MenuAtributos, 'id_menu'>;

class Menu extends Model<MenuAtributos, MenuAtributosCreados> {
  declare id_menu: CreationOptional<number>;
  declare id_rol: number;
  declare direccion_menu: string;
  declare id_recursivo: number;
  declare nombre_menu: string;
  declare icono_menu: string;
  declare opcion_crear: boolean;
  declare opcion_editar: boolean;
  declare opcion_eliminar: boolean;
  declare mostrar_menu: boolean;
}

Menu.init({
  id_menu: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  direccion_menu: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_recursivo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nombre_menu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icono_menu: {
    type: DataTypes.STRING,
    allowNull: true
  },
  opcion_crear: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  opcion_editar: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  opcion_eliminar: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mostrar_menu: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'menu',
  timestamps: false
})

export { Menu };


