import * as dotenv from 'dotenv';
import { Router } from 'express';
import fetch from 'node-fetch';
import { LinkPreviewDto } from '../../dtos/relearn/LinkPreviewDto';
import authMiddleware from '../../middlewares/authMiddleware';
import { MyErrorsResponse } from '../../utils/ErrorMessage';
import { isValidUrl } from '../../utils/isValidUrl';
import { MyAuthRequest } from '../../utils/MyAuthRequest';
import { myConsoleError } from '../../utils/myConsoleError';
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