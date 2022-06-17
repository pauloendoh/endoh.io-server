import { getResourceRepository } from "../../../repositories/relearn/ResourceRepository";
import { isValidUrl } from "../../../utils/isValidUrl";
import { LinkPreviewDto } from "./types/LinkPreviewDto";

export default class LinkPreviewService {
  constructor(private resourceRepo = getResourceRepository()) {}

  getLinkPreview = async (url: string): Promise<LinkPreviewDto> => {
    if (!isValidUrl(url)) throw new Error("URL is not valid");

    // this.resourceRepo.findOneRelationsId({});
    return {
      description: "",
      image: "",
      title: "",
      url: "",
    };
  };
}
