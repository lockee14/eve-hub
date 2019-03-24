/**
 * EVE Swagger Interface
 * An OpenAPI for EVE Online
 *
 * OpenAPI spec version: 0.8.4
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { GetFwLeaderboardsCorporationsActiveTotalActiveTotal1 } from './getFwLeaderboardsCorporationsActiveTotalActiveTotal1';
import { GetFwLeaderboardsCorporationsLastWeekLastWeek1 } from './getFwLeaderboardsCorporationsLastWeekLastWeek1';
import { GetFwLeaderboardsCorporationsYesterdayYesterday1 } from './getFwLeaderboardsCorporationsYesterdayYesterday1';


/**
 * Top 10 rankings of corporations by victory points from yesterday, last week and in total
 */
export interface GetFwLeaderboardsCorporationsVictoryPoints {
    /**
     * Top 10 ranking of corporations active in faction warfare by total victory points. A corporation is considered \"active\" if they have participated in faction warfare in the past 14 days.
     */
    activeTotal: Array<GetFwLeaderboardsCorporationsActiveTotalActiveTotal1>;
    /**
     * Top 10 ranking of corporations by victory points in the past week
     */
    lastWeek: Array<GetFwLeaderboardsCorporationsLastWeekLastWeek1>;
    /**
     * Top 10 ranking of corporations by victory points in the past day
     */
    yesterday: Array<GetFwLeaderboardsCorporationsYesterdayYesterday1>;
}
