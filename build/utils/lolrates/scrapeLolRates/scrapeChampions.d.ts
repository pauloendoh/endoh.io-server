export interface IChampion {
    name: string;
    iconUrl: string;
}
export declare function scrapeChampions(): Promise<import("../../../entities/LolRate").LolRate[]>;
