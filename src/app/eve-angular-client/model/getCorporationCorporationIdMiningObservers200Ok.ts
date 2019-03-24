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
export interface GetCorporationCorporationIdMiningObservers200Ok {
    /**
     * last_updated string
     */
    lastUpdated: string;
    /**
     * The entity that was observing the asteroid field when it was mined. 
     */
    observerId: number;
    /**
     * The category of the observing entity
     */
    observerType: GetCorporationCorporationIdMiningObservers200Ok.ObserverTypeEnum;
}
export namespace GetCorporationCorporationIdMiningObservers200Ok {
    export type ObserverTypeEnum = 'structure';
    export const ObserverTypeEnum = {
        Structure: 'structure' as ObserverTypeEnum
    }
}
