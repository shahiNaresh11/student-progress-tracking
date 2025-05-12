// models/Point.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/dbConfig.js';

class Point extends Model { }

Point.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        deduce_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        bonus_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        total_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Point',
        tableName: 'points',
        timestamps: true,
    }
);

await sequelize.sync();

export default Point;
