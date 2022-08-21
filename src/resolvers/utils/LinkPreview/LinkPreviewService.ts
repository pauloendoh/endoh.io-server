import axios from "axios";
import { getResourceRepository } from "../../../repositories/relearn/ResourceRepository";
import { isValidUrl } from "../../../utils/isValidUrl";
import { buildLinkPreviewDto, LinkPreviewDto } from "./types/LinkPreviewDto";

import { Duration } from "luxon";
import createMetascraper from "metascraper";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperTitle from "metascraper-title";
import { YOUTUBE_API_KEY } from "../../../config/config";

const metascraper = createMetascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
]);

export default class LinkPreviewService {
  constructor(private resourceRepo = getResourceRepository()) {}

  getLinkPreview = async (
    url: string,
    userId: number
  ): Promise<LinkPreviewDto> => {
    if (!isValidUrl(url)) throw new Error("Invalid URL");

    const { data: html } = await axios.get(url, {
      headers: {
        "content-type": "text/html",
      },
    });

    if (!html) return buildLinkPreviewDto();

    const { title, image, description } = await metascraper({ html, url });

    const response = buildLinkPreviewDto({
      title,
      image,
      description,
      url,
    });

    const foundResource = await getResourceRepository().findOne({
      userId: userId,
      url,
    });

    if (foundResource) response.alreadySavedResource = foundResource;

    if (url.includes("youtube.com"))
      response.youtubeVideoLength = await this.getYoutubeVideoLength(url);

    return response;
  };

  getYoutubeVideoLength = async (url: string): Promise<string> => {
    const videoId = new URLSearchParams(url.split("?")[1]).get("v");
    let durationStr = "00:00h";

    await axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
      )

      .then((res) => {
        const durationObj = Duration.fromISO(
          res.data.items[0].contentDetails.duration
        ).toObject();

        durationStr = "";
        if (durationObj.hours) {
          if (durationObj.hours < 10) {
            durationStr += "0" + durationObj.hours;
          } else {
            durationStr += durationObj.hours;
          }
        } else {
          durationStr += "00";
        }
        if (durationObj.minutes) {
          if (durationObj.minutes < 10) {
            durationStr += ":0" + durationObj.minutes + "h";
          } else {
            durationStr += ":" + durationObj.minutes + "h";
          }
        } else {
          durationStr += ":00h";
        }
        return durationStr;
      });

    return durationStr;
  };
}