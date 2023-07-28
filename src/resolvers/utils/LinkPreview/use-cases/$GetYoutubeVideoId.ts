export class $GetYoutubeVideoId {
  exec(url: string) {
    if (url.includes("/shorts")) {
      // eg: https://www.youtube.com/shorts/eexmdt3Q8yk/ or https://www.youtube.com/shorts/eexmdt3Q8yk  or https://youtube.com/shorts/eexmdt3Q8yk?feature=share
      return url.split("/")[url.split("/").length - 2]
    }

    const videoId = url.includes("youtube.com")
      ? new URLSearchParams(url.split("?")[1]).get("v")
      : url.split("/")[url.split("/").length - 1].split("?")[0] // eg: https://youtu.be/ZV5yTm4pT8g?t=1
    return videoId
  }
}
