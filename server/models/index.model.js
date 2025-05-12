// models/index.js
import sequelize from '../configs/dbConfig.js';
import User from './user.model.js';
import Point from './points.model.js';

// Setup associations after all models are imported
User.hasOne(Point, {
    foreignKey: 'student_id',
    as: 'points',
    onDelete: 'CASCADE',
});

Point.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
});

// Export after associations are set
export { sequelize, User, Point };
