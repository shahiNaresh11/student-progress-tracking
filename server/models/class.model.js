import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/dbConfig.js';

class Class extends Model { }

Class.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        className: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

    },

    {
        sequelize,
        modelName: 'Class',
        tableName: 'classes',
        timestamps: true, 
    }
);

export default Class;
