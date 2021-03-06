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
export interface GetCorporationsCorporationIdShareholders200Ok {
    /**
     * share_count integer
     */
    shareCount: number;
    /**
     * shareholder_id integer
     */
    shareholderId: number;
    /**
     * shareholder_type string
     */
    shareholderType: GetCorporationsCorporationIdShareholders200Ok.ShareholderTypeEnum;
}
export namespace GetCorporationsCorporationIdShareholders200Ok {
    export type ShareholderTypeEnum = 'character' | 'corporation';
    export const ShareholderTypeEnum = {
        Character: 'character' as ShareholderTypeEnum,
        Corporation: 'corporation' as ShareholderTypeEnum
    }
}
