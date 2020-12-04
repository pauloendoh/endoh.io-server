
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import Place from '../../entity/monerate/Place';
import authMiddleware from '../../middlewares/authMiddleware';
import PlaceRepository from '../../repositories/PlaceRepository';
import ErrorMessage, { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';


const placeRoute = Router()

placeRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
    const sentPlace = req.body as Place
    const user = req.user
    const placeRepo = getCustomRepository(PlaceRepository)

    try {

        await placeRepo.save({ ...sentPlace, userId: user.id });
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


placeRoute.delete('/:id', authMiddleware, async (req: MyAuthRequest, res) => {
    const placeRepo = getCustomRepository(PlaceRepository)
    const { user } = req
    const placeId = parseFloat(req.params.id)

    try {
        const result = await placeRepo.delete({ id: placeId, user })
        if (result.affected) {
            const places = await placeRepo.getPlacesFromUser(user)
            return res.status(200).json(places)
        }
        else {
            return res.status(400).json(new MyErrorsResponse('Place id not found, or user is not owner.'))
        }
    }
    catch (err) {
        myConsoleError(err.message)
        return res.status(400).json(new MyErrorsResponse(err.message))
    }
})



export default placeRoute