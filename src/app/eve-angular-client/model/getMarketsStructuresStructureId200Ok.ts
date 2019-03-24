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
export interface GetMarketsStructuresStructureId200Ok {
    /**
     * duration integer
     */
    duration: number;
    /**
     * is_buy_order boolean
     */
    isBuyOrder: boolean;
    /**
     * issued string
     */
    issued: Date;
    /**
     * location_id integer
     */
    locationId: number;
    /**
     * min_volume integer
     */
    minVolume: number;
    /**
     * order_id integer
     */
    orderId: number;
    /**
     * price number
     */
    price: number;
    /**
     * range string
     */
    range: GetMarketsStructuresStructureId200Ok.RangeEnum;
    /**
     * type_id integer
     */
    typeId: number;
    /**
     * volume_remain integer
     */
    volumeRemain: number;
    /**
     * volume_total integer
     */
    volumeTotal: number;
}
export namespace GetMarketsStructuresStructureId200Ok {
    export type RangeEnum = 'station' | 'region' | 'solarsystem' | '1' | '2' | '3' | '4' | '5' | '10' | '20' | '30' | '40';
    export const RangeEnum = {
        Station: 'station' as RangeEnum,
        Region: 'region' as RangeEnum,
        Solarsystem: 'solarsystem' as RangeEnum,
        _1: '1' as RangeEnum,
        _2: '2' as RangeEnum,
        _3: '3' as RangeEnum,
        _4: '4' as RangeEnum,
        _5: '5' as RangeEnum,
        _10: '10' as RangeEnum,
        _20: '20' as RangeEnum,
        _30: '30' as RangeEnum,
        _40: '40' as RangeEnum
    }
}
