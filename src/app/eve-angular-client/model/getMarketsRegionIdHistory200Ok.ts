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


/**
 * 200 ok object
 */
export interface GetMarketsRegionIdHistory200Ok {
    /**
     * average number
     */
    average: number;
    /**
     * The date of this historical statistic entry
     */
    date: string;
    /**
     * highest number
     */
    highest: number;
    /**
     * lowest number
     */
    lowest: number;
    /**
     * Total number of orders happened that day
     */
    orderCount: number;
    /**
     * Total
     */
    volume: number;
}
