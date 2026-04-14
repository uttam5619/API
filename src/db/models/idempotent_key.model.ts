import sequelize from "../../config/db.js";
import { Sequelize, DataTypes } from "sequelize";

export const Idempotent_key = sequelize.define(
    'Idempotent_key',
    {
        id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        idempotent_key: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING(50),
        },
        request_method: {
          type: DataTypes.STRING(10),
          allowNull: false
        },
        endpoint: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        request_hash: {
          type: DataTypes.CHAR(64),
          allowNull: false
        },
        response_data: {
          type: DataTypes.JSON
        },
        status: {
          type: DataTypes.ENUM('PROCESSING', 'COMPLETED', 'FAILED'),
          defaultValue: 'PROCESSING'
        },
        expires_at: {
          type: DataTypes.DATE
        }
    },
    {timestamps:true}
)