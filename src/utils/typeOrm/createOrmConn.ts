import { ConnectionOptions, createConnection } from "typeorm"

const createOrmConn = async () => {
  const ormconfig = require("../../../ormconfig.js")
  return createConnection(ormconfig)
}

export default createOrmConn