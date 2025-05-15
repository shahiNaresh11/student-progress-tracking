
import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/dbConfig.js';

class Activity extends Model {}

Activity.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        activity: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Negative or positive points for this activity',
        },
    },
    {
        sequelize,
        modelName: 'Activity',
        tableName: 'activities',
        timestamps: true,
    }
);

export default Activity;
