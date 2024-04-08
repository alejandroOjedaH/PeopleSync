const crypto = await import("crypto");

const secretKey =
  "2fa748eba28ed613b9c46c440f77ed29c9de56427118e0c7745cea804fde0877";

//Encripta la contraseña
export async function encrypt(password) {
  try {
    let hash = crypto.createHmac("sha256", secretKey);
    hash.update(password);
    hash = hash.digest("hex");
    return hash;
  } catch (e) {
    console.log(e);
  }
}

//Contasta la contraseña con la de la base de datos
export async function login(username, password, bdPassword) {
  try {
    if (
      username &&
      bdPassword ===
      crypto.createHmac("sha256", secretKey).update(password).digest("hex")
    ) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
}
