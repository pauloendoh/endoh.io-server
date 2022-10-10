import { Application } from "express"
import { Resource } from "express-automatic-routes"

export default function tagLastOpenedAtRoute(expressApp: Application) {
  return <Resource>{
    // get: {
    //   middleware: authMiddleware,
    //   handler: async (req: MyAuthRequest, res: Response) => {
    //     const url = req.query["url"] as string;
    //     if (!isValidUrl(url)) {
    //       return res
    //         .status(400)
    //         .json(new MyErrorsResponse("URL is not valid", "url"));
    //     }
    //     try {
    //       const foundResource =
    //         await getResourceRepository().findOneRelationsId({
    //           userId: req.user.id,
    //           url,
    //           tagId: Not(IsNull()),
    //         });
    //       let durationStr = "00:00h";
    //       if (url.includes("youtube.com")) {
    //         const videoId = new URLSearchParams(url.split("?")[1]).get("v");
    //         await fetch(
    //           `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    //         )
    //           .then((res) => res.json())
    //           .then((json) => {
    //             const durationObj = Duration.fromISO(
    //               json.items[0].contentDetails.duration
    //             ).toObject();
    //             durationStr = "";
    //             if (durationObj.hours) {
    //               if (durationObj.hours < 10) {
    //                 durationStr += "0" + durationObj.hours;
    //               } else {
    //                 durationStr += durationObj.hours;
    //               }
    //             } else {
    //               durationStr += "00";
    //             }
    //             if (durationObj.minutes) {
    //               if (durationObj.minutes < 10) {
    //                 durationStr += ":0" + durationObj.minutes + "h";
    //               } else {
    //                 durationStr += ":" + durationObj.minutes + "h";
    //               }
    //             } else {
    //               durationStr += ":00h";
    //             }
    //             return durationStr;
    //           });
    //       }
    //       const linkPreview = await fetch(
    //         "http://api.linkpreview.net/?key=" +
    //           process.env.LINK_PREVIEW_KEY +
    //           "&q=" +
    //           url
    //       )
    //         .then((res) => res.json())
    //         .then((json) => {
    //           return json as LinkPreviewDto;
    //         });
    //       linkPreview.duration = durationStr;
    //       linkPreview["alreadySavedResource"] = foundResource;
    //       return res.status(200).json(linkPreview);
    //     } catch (err) {
    //       myConsoleError(err.message);
    //       return res.status(400).json(new MyErrorsResponse(err.message));
    //     }
    //   },
    // },
  }
}
