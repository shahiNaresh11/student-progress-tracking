import { DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';
import sequelize from '../configs/dbConfig.js';

// Load environment variables from .env file
dotenv.config();

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        img: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                public_id: '',
                secure_url: '',
            },
        },
        role: {
            type: DataTypes.ENUM('student', 'teacher', 'superAdmin'),
            defaultValue: 'student',
        },

        class: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        section: {
            type: DataTypes.STRING,
            allowNull: true,
        },


    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
    }
);

await sequelize.sync();

export default User;
