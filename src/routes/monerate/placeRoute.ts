import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import PlacePostDto from '../../dtos/monerate/PlacePostDto';
import Place from '../../entity/monerate/Place';
import authMiddleware from '../../middlewares/authMiddleware';
import PlaceRepository from '../../repositories/PlaceRepository';
import ErrorMessage from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const placeRoute = Router()

placeRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentPlace = req.body as PlacePostDto
    const user = req.user
    const placeRepo = getCustomRepository(PlaceRepository)

    try {

        await placeRepo.savePlacePostDto(sentPlace, user);
        const places = await placeRepo.getPlacesFromUser(user)
        return res.json(places)
    } catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

placeRoute.get('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const placeRepo = getCustomRepository(PlaceRepository)

    const user = req.user

    try {
        const places = await placeRepo.getPlacesFromUser(user)
        return res.json(places)
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new ErrorMessage(err.message))
    }
})

export default placeRoute