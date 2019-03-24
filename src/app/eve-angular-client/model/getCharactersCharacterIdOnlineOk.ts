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
export interface GetCharactersCharacterIdOnlineOk {
    /**
     * Timestamp of the last login
     */
    lastLogin?: Date;
    /**
     * Timestamp of the last logout
     */
    lastLogout?: Date;
    /**
     * Total number of times the character has logged in
     */
    logins?: number;
    /**
     * If the character is online
     */
    online: boolean;
}
