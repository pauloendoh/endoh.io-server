import { Resource } from "../../../entities/relearn/Resource";

export interface LinkPreviewDto {
  title: string;
  image: string;
  description: string;
  url: string;
  duration: string;

  alreadySavedResource: Resource | undefined;
}
