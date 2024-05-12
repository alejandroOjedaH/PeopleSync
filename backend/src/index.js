import app from "./app.js";
import { sequelize } from "./database/database.js";

async function main() {
  try {
    //sequelize ini
    await sequelize.sync({ force: false, alter: false });

    console.log("Connection has been established");

    //express ini
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (e) {
    console.error("unable to connect to database " + e);
  }
}

main();
