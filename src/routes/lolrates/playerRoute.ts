import { Router } from "express"
import { getCustomRepository } from "typeorm"
import PlayerRepo from "../../repositories/lolrates/PlayerRepo"

const playerRoute = Router()
const playerRepo = getCustomRepository(PlayerRepo)

// playerRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
//   try {
//     const players = await playerRepo.findAllFullByUserId(req.user.id);
//     return res.status(200).json(players);
//   } catch (err) {
//     myConsoleError(err.message);
//     return res.status(400).json(new MyErrorsResponse(err.message));
//   }
// });

// playerRoute.post("/", authMiddleware, async (req: MyAuthRequest, res) => {
//   try {
//     const sentPlayer = plainToClass(Player, req.body);
//     sentPlayer.userId = req.user.id;

//     const saved = await playerRepo.save(sentPlayer);
//     const savedFull = await playerRepo.findOneFull(saved.id);
//     return res.status(200).json(savedFull);
//   } catch (err) {
//     myConsoleError(err.message);
//     return res.status(400).json(new MyErrorsResponse(err.message));
//   }
// });

export default playerRoute
