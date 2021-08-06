import {promisify} from "util"
const jwt = require("jsonwebtoken")
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)

const key = "thisNot@JwtKey"

export class JwtToken {
  async createToken(clientid: string) {
    const newToken = await sign(clientid, key)
    return newToken
  }
  async verifyToken(token: string) {
    const verifytoken = await verify(token, key)
    return verifytoken
  }
}
