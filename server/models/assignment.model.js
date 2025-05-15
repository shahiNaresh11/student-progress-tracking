import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/dbConfig.js';

class Assignment extends Model { }

Assignment.init(
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
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('submitted', 'late', 'missed'),
            allowNull: false,
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Assignment',
        tableName: 'assignments',
        timestamps: true,
    }
);

export default Assignment;
