// models/index.js
import sequelize from '../configs/dbConfig.js';
import User from './user.model.js';
import Point from './points.model.js';
import Attendance from './attendence.model.js';
import Activity from './activity.model.js';
import Assignment from './assignment.model.js';
import Class from './class.model.js';


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
User.hasMany(Attendance, {
    foreignKey: 'student_id',
    as: 'attendances',
    onDelete: 'CASCADE',
});
Attendance.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
});

User.hasMany(Activity, {
    foreignKey: 'student_id',
    as: 'activities',
    onDelete: 'CASCADE',
});
Activity.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
});

User.hasMany(Assignment, {
    foreignKey: 'student_id',
    as: 'assignments',
    onDelete: 'CASCADE',
});
Assignment.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
});

Class.hasMany(User, {
    foreignKey: 'classId',
    as: 'students',
    onDelete: 'SET NULL',
});
User.belongsTo(Class, {
    foreignKey: 'classId',
    as: 'class',
});


export { sequelize, User, Point, Attendance, Activity, Assignment, Class };
