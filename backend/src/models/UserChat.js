import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";


export const UserChat = sequelize.define(
  "users_chats",
  {
    isNewMessage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
  }
);
