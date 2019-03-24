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
import { GetFwLeaderboardsCorporationsKills } from './getFwLeaderboardsCorporationsKills';
import { GetFwLeaderboardsCorporationsVictoryPoints } from './getFwLeaderboardsCorporationsVictoryPoints';


/**
 * 200 ok object
 */
export interface GetFwLeaderboardsCorporationsOk {
    kills: GetFwLeaderboardsCorporationsKills;
    victoryPoints: GetFwLeaderboardsCorporationsVictoryPoints;
}
