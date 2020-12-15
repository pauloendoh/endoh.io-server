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
import { isValidUrl } from '../../utils/isValidUrl';
import * as dotenv from 'dotenv'
dotenv.config()

const utilsRoute = Router()

utilsRoute.get('/link-preview',
    authMiddleware,
    async (req: MyAuthRequest, res) => {
        const url = req.query['url'] as string

        if(!isValidUrl(url)){
            return res.status(400).json(new MyErrorsResponse('URL is not valid', 'url'))
        }

        try {
            fetch('http://api.linkpreview.net/?key='+ process.env.LINK_PREVIEW_KEY +'&q=' + url)
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