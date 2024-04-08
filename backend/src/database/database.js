import { Sequelize } from "sequelize";

//Conexion a la base de datos
export const sequelize = new Sequelize("peoplesync", "root", "", {
  host: "localhost",
  dialect: "mariadb",
});
