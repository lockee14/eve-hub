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
export interface GetCorporationsCorporationIdMedals200Ok {
    /**
     * created_at string
     */
    createdAt: Date;
    /**
     * ID of the character who created this medal
     */
    creatorId: number;
    /**
     * description string
     */
    description: string;
    /**
     * medal_id integer
     */
    medalId: number;
    /**
     * title string
     */
    title: string;
}
