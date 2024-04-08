import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { ContentType } from "./ContentType.js";

export const Message = sequelize.define(
  "messages",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.BLOB,
      allowNull: false
    }
  },
);

ContentType.hasMany(Message, {
  foreignKey: "contentTypeId",
  onUpdate: "CASCADE",
  sourceKey: "id"
});

Message.belongsTo(ContentType, {
  foreignKey: "contentTypeId",
  targetKey: "id"
});