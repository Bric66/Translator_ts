const jwt = require("jsonwebtoken");
//import jwt from "jsonwebtoken";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";
const secretKey = process.env.SECRET_KEY;

export function authorization(req: AuthentifiedRequest, res, next) {
  try {
    const decodedJwt = jwt.verify(req.headers.access_key, secretKey);
    req.user = {
      email: decodedJwt.email,
      userId: decodedJwt.userId,
      firstName: decodedJwt.firstName,
      lastName: decodedJwt.firstName,
    };
    return next();
  } catch (error) {
    return res.sendStatus(401);
  }
}
