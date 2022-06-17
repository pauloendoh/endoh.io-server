import axios from "axios";
import createMetascraper from "metascraper";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperTitle from "metascraper-title";
import { Arg, Query, Resolver } from "type-graphql";
import { isValidUrl } from "../../../utils/isValidUrl";
import { LinkPreviewDto } from "./types/LinkPreviewDto";

const metascraper = createMetascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
]);

@Resolver()
export class LinkPreviewResolver {
  // @Query(() => [Resource])
  @Query(() => LinkPreviewDto)
  async getLinkPreview(@Arg("url") url: string) {
    if (!isValidUrl(url)) throw new Error("Invalid URL");

    const { data: html } = await axios.get(url, {
      headers: {
        "content-type": "text/html",
      },
    });

    const { title, image, description } = await metascraper({ html, url });

    const response: LinkPreviewDto = {
      title,
      image,
      description,
      url,
    };
    return response;
  }
}
