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
 * route object
 */
export interface GetCharactersCharacterIdPlanetsPlanetIdRoute {
    /**
     * content_type_id integer
     */
    contentTypeId: number;
    /**
     * destination_pin_id integer
     */
    destinationPinId: number;
    /**
     * quantity number
     */
    quantity: number;
    /**
     * route_id integer
     */
    routeId: number;
    /**
     * source_pin_id integer
     */
    sourcePinId: number;
    /**
     * list of pin ID waypoints
     */
    waypoints?: Array<number>;
}
