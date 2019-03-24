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
 * item object
 */
export interface GetKillmailsKillmailIdKillmailHashItemsItem {
    /**
     * flag integer
     */
    flag: number;
    /**
     * item_type_id integer
     */
    itemTypeId: number;
    /**
     * quantity_destroyed integer
     */
    quantityDestroyed?: number;
    /**
     * quantity_dropped integer
     */
    quantityDropped?: number;
    /**
     * singleton integer
     */
    singleton: number;
}
