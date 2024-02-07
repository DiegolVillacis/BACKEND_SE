import { CreationOptional, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../DB/conexionDB';

type OperacionesAtributos = {
  direccion_operacion: string,
  archivo_operacion: string,
};

type OperacionesAtributosCreados = Optional<OperacionesAtributos, 'direccion_operacion'>;

class Operaciones extends Model<OperacionesAtributos, OperacionesAtributosCreados> {
  declare direccion_operacion: CreationOptional<string>;
  declare archivo_operacion: string;
}

Operaciones.init({
  direccion_operacion: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  archivo_operacion: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'operaciones',
  timestamps: false
})

export { Operaciones };