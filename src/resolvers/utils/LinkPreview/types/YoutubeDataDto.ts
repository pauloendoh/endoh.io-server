export interface YoutubeDataDto {
  kind: string
  etag: string
  items: Item[]
  pageInfo: PageInfo
}

interface PageInfo {
  totalResults: number
  resultsPerPage: number
}

interface Item {
  kind: string
  etag: string
  id: string
  snippet: Snippet
  contentDetails: ContentDetails
  statistics: Statistics
}

interface Statistics {
  viewCount: string
  likeCount: string
  favoriteCount: string
  commentCount: string
}

interface ContentDetails {
  duration: string
  dimension: string
  definition: string
  caption: string
  licensedContent: boolean
  contentRating: ContentRating
  projection: string
}

interface ContentRating {}

interface Snippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: Thumbnails
  channelTitle: string
  categoryId: string
  liveBroadcastContent: string
  defaultLanguage: string
  localized: Localized
  defaultAudioLanguage: string
}

interface Localized {
  title: string
  description: string
}

interface Thumbnails {
  default: Default
  medium: Default
  high: Default
  standard: Default
  maxres: Default
}

interface Default {
  url: string
  width: number
  height: number
}
