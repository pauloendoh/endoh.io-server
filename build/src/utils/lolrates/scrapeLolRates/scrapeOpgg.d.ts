export interface IOpggResult {
    role: string;
    championName: string;
    winRate: string;
    pickRate: string;
}
export declare function scrapeOpgg(): Promise<void>;
