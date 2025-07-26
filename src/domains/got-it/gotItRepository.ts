import { dataSource } from "../../dataSource"
import { UserGotIt } from "../../entities/UserGotIt"

export const gotItRepository = dataSource.getRepository(UserGotIt).extend({})
