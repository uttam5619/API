import sequelize from "../../config/db.js";
import { Sequelize, DataTypes } from "sequelize";

export const User = sequelize.define(
    'Users',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          unique: true
        },
        password:{
            type:DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'engineer','analyst'),
            defaultValue: 'user'
        },
        phone:{
            type:DataTypes.STRING
        },
        is_verified:{
            type:DataTypes.BOOLEAN
        },
        token_version:{
            type:DataTypes.INTEGER
        },
        is_deleted:{
            type: DataTypes.DATE
        }

    },
    {timestamps:true}
)