import { query, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { Tag } from '../../entity/relearn/Tag';
import authMiddleware from '../../middlewares/authMiddleware';
import TagRepository from '../../repositories/relearn/TagRepository';
import ErrorMessage, { MyErrorsResponse } from '../../utils/ErrorMessage';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';
import fetch from 'node-fetch'
import { LinkPreviewDto } from '../../dtos/relearn/LinkPreviewDto';

const utilsRoute = Router()

utilsRoute.get('/link-preview',
    authMiddleware,
    async (req: MyAuthRequest, res) => {
        const url = req.query['url']

        // TODO: checar se url é link válido
        try {
            fetch('http://api.linkpreview.net/?key=f51ee6760236cefe8c54b58a9e1a64c7&q=' + url)
                .then(res => res.json())
                .then(json => {
                    const linkPreview = json as LinkPreviewDto
                    return res.status(200).json(linkPreview)
                })
        }
        catch (err) {
            myConsoleError(err.message)
            return res.status(400).json(new MyErrorsResponse(err.message))
        }
    })


export default utilsRoute