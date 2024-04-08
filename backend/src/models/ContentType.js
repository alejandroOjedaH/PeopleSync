import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ContentType = sequelize.define(
  "content_types",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["text", "image", "document"]],
      },
    }
  },
  {
    timestamps: false,
  }
);
