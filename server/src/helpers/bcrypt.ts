import {compare, genSalt, hashSync} from "bcryptjs"

interface PasswordHash<T = string> {
  createHash(password: T): Promise<T>
}

export class Hasher implements PasswordHash<string> {

  async createHash(password: string) {
    const rounds = 10
    const salt = await genSalt(rounds)
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const hashpwd = await hashSync(password, salt)
    return hashpwd
  }
  async verifyHash(password: string, hashpwd: string) {
    try {
      const verify: boolean = await compare(password, hashpwd)
      return verify
    } catch (error) {
      if (error) return false
    }
  }
}
