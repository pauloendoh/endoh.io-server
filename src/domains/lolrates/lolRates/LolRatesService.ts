import actualAxios from "axios"
import { myEnvs } from "../../../utils/myEnvs"
import myRedis from "../../../utils/redis/myRedis"
import { redisKeys } from "../../../utils/redis/redisKeys"
import { LeagueMatchDetails } from "./types/LeagueMatchDetails"

export class LolRatesService {
  constructor(private axios = actualAxios.create(), private redis = myRedis) {}

  async getPlaytime(params: {
    offsetHours: number
    summonerName: string
    startingWeekday: number
  }) {
    const { offsetHours, summonerName, startingWeekday } = params

    const apiKey = myEnvs.RIOT_API_KEY

    const data = await this.axios
      .get<{ puuid: string }>(
        `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`
      )
      .then((res) => res.data)

    let lastMonday = new Date()

    const serverHoursOffset = new Date().getTimezoneOffset() / 60

    for (let i = 0; i < 7; i++) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      day.setHours(day.getHours() - offsetHours)

      if (day.getDay() === startingWeekday) {
        day.setHours(0, 0, 0, 0)
        day.setHours(offsetHours - serverHoursOffset)
        lastMonday = day
        break
      }
    }

    const epochLastMonday = lastMonday.getTime() / 1000

    const matchesIds = await this.axios
      .get<string[]>(
        `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${data.puuid}/ids?startTime=${epochLastMonday}&count=100&api_key=${apiKey}`
      )
      .then((res) => res.data)

    const matches = await this.#getMatchesDetails(matchesIds)

    const totalPlaytimeInSeconds = matches.reduce(
      (acc, match) => acc + match.gameDuration,
      0
    )

    const playtimeInMinutes = totalPlaytimeInSeconds / 60
    const playtimeInHours = playtimeInMinutes / 60

    return {
      playtimeInMinutes,
      playtimeInHours,
    }
  }

  async #getMatchesDetails(matchesIds: string[]) {
    const matches: {
      gameDuration: number
      gameMode: string
    }[] = []
    for (const id of matchesIds) {
      const cachedInfo = await this.redis.get(redisKeys.leagueMatch(id))

      if (cachedInfo) {
        matches.push(JSON.parse(cachedInfo))
        continue
      }

      const matchDetails = await this.axios
        .get<LeagueMatchDetails>(
          `https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${myEnvs.RIOT_API_KEY}`
        )
        .then((res) => res.data)

      const relevantInfo = {
        gameDuration: matchDetails.info.gameDuration,
        gameMode: matchDetails.info.gameMode,
      }

      await this.redis.set(
        redisKeys.leagueMatch(id),
        JSON.stringify(relevantInfo),
        "EX",
        60 * 60 * 24 * 14
      )

      matches.push(relevantInfo)
    }

    return matches
  }
}
