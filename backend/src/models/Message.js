import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";


export const Message = sequelize.define(
  "messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contentType: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["text", "img", "pdf"]]
      }
    }
  },
);
