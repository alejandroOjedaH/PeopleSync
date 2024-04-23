import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";

const secret = "roitygh584ghvgfsj";
const algorithms = ["HS256"];
const authenticate = "/api/users/authenticate";
const register = "/api/users/authenticate/new";

//Poteccion jwt para la api
export const checkCredentials = expressjwt({
  secret: secret,
  algorithms: algorithms,
}).unless({ path: [authenticate, register] });

//generacion token
export function generateToken(user) {
  delete user.dataValues.password;
  const payload = {
    username: user,
  };

  //Genera y firma el token con la clave secreta
  try {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
  } catch (err) {
    console.log(err);
  }
}

//Comprobar si la sesion sigue activa
export function checkToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    if (decoded && decoded.exp && Date.now() / 1000 < decoded.exp) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export function getUser(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.username;
  } catch (e) {
    return false;
  }
}
