import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/dbConfig.js';

class Attendance extends Model { }

Attendance.init(
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
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('present', 'absent', 'late'),
            allowNull: false,
        },
        remarks: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: 'Attendance',
        tableName: 'attendances',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['student_id', 'class_id', 'date'],
            }
        ]
    }
);

export default Attendance;
