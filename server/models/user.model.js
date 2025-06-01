import { DataTypes, Model } from 'sequelize';
import sequelize from '../configs/dbConfig.js';

// Load environment variables from .env file


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
        profilePic: {
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

        section: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'classes',
                key: 'id',
            },
            onDelete: 'SET NULL',
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
