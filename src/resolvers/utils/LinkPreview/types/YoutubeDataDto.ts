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
