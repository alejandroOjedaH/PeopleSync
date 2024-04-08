import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Chat } from "./Chat.js";
import { UserChat } from "./UserChat.js";
import { Message } from "./Message.js";

export const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
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
    profileImage: {
      type: DataTypes.BLOB,
    }
  },
  {
    timestamps: false,
  }
);

//Relaciones;
User.belongsToMany(Chat, { through: UserChat });
Chat.belongsToMany(User, { through: UserChat });

User.hasMany(Message, {
  foreignKey: "userId",
  sourceKey: "id"
})

Message.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id"
})