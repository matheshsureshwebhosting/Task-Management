import {v4 as uuidv4, validate as uuidValidate, version as uuidVersion} from 'uuid';

export class Uuid {
  async createUUID() {
    return uuidv4()
  }
  async verifyUUID(uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }
}
