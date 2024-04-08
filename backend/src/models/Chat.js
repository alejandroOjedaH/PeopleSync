import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Message } from "./Message.js";


export const Chat = sequelize.define(
  "chats",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    videocall: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: false,
  }
);

Chat.hasMany(Message, {
  onDelete: "cascade",
  foreignKey: "chatId",
  sourceKey: "id"
})

Message.belongsTo(Chat, {
  foreignKey: "chatId",
  targetKey: "id"
})