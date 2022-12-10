import axios from "axios"
import { isValidUrl } from "../../../utils/isValidUrl"
import { buildLinkPreviewDto, LinkPreviewDto } from "./types/LinkPreviewDto"

import { Duration } from "luxon"
import createMetascraper from "metascraper"
import metascraperDescription from "metascraper-description"
import metascraperImage from "metascraper-image"
import metascraperTitle from "metascraper-title"
import { YOUTUBE_API_KEY } from "../../../config/config"
import ResourceRepository from "../../../repositories/relearn/ResourceRepository"
import { YoutubeDataDto } from "./types/YoutubeDataDto"

const metascraper = createMetascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
])

export default class LinkPreviewService {
  constructor(private resourceRepo = ResourceRepository) {}

  getLinkPreview = async (
    url: string,
    userId: number
  ): Promise<LinkPreviewDto> => {
    url = url.trim()
    if (!isValidUrl(url)) throw new Error("Invalid URL")

    const { data: html } = await axios.get(url, {
      headers: {
        "content-type": "text/html",
      },
    })

    if (!html) return buildLinkPreviewDto()

    const { title, image, description } = await metascraper({ html, url })

    const response = buildLinkPreviewDto({
      title,
      image,
      description,
      url,
    })

    const foundResource = await this.resourceRepo.findOne({
      where: {
        userId: userId,
        url,
      },
    })

    if (foundResource) response.alreadySavedResource = foundResource

    if (url.includes("youtube.com")) {
      const videoInfo = await this.getYoutubeVideoInfo(url)
      response.youtubeVideoLength = videoInfo.duration
      response.viewCount = videoInfo.viewCount
    }

    return response
  }

  // PE 1/3 - remove elses
  getYoutubeVideoInfo = async (
    url: string
  ): Promise<{ duration: string; viewCount: number }> => {
    const videoId = new URLSearchParams(url.split("?")[1]).get("v")
    let durationStr = "00:00h"
    let viewCount = 0

    await axios
      .get<YoutubeDataDto>(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
      )

      .then((res) => {
        viewCount = Number(res.data.items[0].statistics.viewCount)
        const durationObj = Duration.fromISO(
          res.data.items[0].contentDetails.duration
        ).toObject()

        durationStr = ""
        if (durationObj.hours) {
          if (durationObj.hours < 10) {
            durationStr += "0" + durationObj.hours
          } else {
            durationStr += durationObj.hours
          }
        } else {
          durationStr += "00"
        }
        if (durationObj.minutes) {
          if (durationObj.minutes < 10) {
            durationStr += ":0" + durationObj.minutes + "h"
          } else {
            durationStr += ":" + durationObj.minutes + "h"
          }
        } else {
          durationStr += ":00h"
        }
        return durationStr
      })

    return {
      duration: durationStr,
      viewCount,
    }
  }
}
