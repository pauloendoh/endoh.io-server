import { dataSource } from "../../dataSource"
import { UserGotIt } from "../../entities/UserGotIt"

export const gotItRepository2 = dataSource.getRepository(UserGotIt).extend({})
