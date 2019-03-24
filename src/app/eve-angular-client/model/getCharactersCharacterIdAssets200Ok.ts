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
export interface GetCharactersCharacterIdAssets200Ok {
    /**
     * is_blueprint_copy boolean
     */
    isBlueprintCopy?: boolean;
    /**
     * is_singleton boolean
     */
    isSingleton: boolean;
    /**
     * item_id integer
     */
    itemId: number;
    /**
     * location_flag string
     */
    locationFlag: GetCharactersCharacterIdAssets200Ok.LocationFlagEnum;
    /**
     * location_id integer
     */
    locationId: number;
    /**
     * location_type string
     */
    locationType: GetCharactersCharacterIdAssets200Ok.LocationTypeEnum;
    /**
     * quantity integer
     */
    quantity: number;
    /**
     * type_id integer
     */
    typeId: number;
}
export namespace GetCharactersCharacterIdAssets200Ok {
    export type LocationFlagEnum = 'AssetSafety' | 'AutoFit' | 'BoosterBay' | 'Cargo' | 'CorpseBay' | 'Deliveries' | 'DroneBay' | 'FighterBay' | 'FighterTube0' | 'FighterTube1' | 'FighterTube2' | 'FighterTube3' | 'FighterTube4' | 'FleetHangar' | 'Hangar' | 'HangarAll' | 'HiSlot0' | 'HiSlot1' | 'HiSlot2' | 'HiSlot3' | 'HiSlot4' | 'HiSlot5' | 'HiSlot6' | 'HiSlot7' | 'HiddenModifiers' | 'Implant' | 'LoSlot0' | 'LoSlot1' | 'LoSlot2' | 'LoSlot3' | 'LoSlot4' | 'LoSlot5' | 'LoSlot6' | 'LoSlot7' | 'Locked' | 'MedSlot0' | 'MedSlot1' | 'MedSlot2' | 'MedSlot3' | 'MedSlot4' | 'MedSlot5' | 'MedSlot6' | 'MedSlot7' | 'QuafeBay' | 'RigSlot0' | 'RigSlot1' | 'RigSlot2' | 'RigSlot3' | 'RigSlot4' | 'RigSlot5' | 'RigSlot6' | 'RigSlot7' | 'ShipHangar' | 'Skill' | 'SpecializedAmmoHold' | 'SpecializedCommandCenterHold' | 'SpecializedFuelBay' | 'SpecializedGasHold' | 'SpecializedIndustrialShipHold' | 'SpecializedLargeShipHold' | 'SpecializedMaterialBay' | 'SpecializedMediumShipHold' | 'SpecializedMineralHold' | 'SpecializedOreHold' | 'SpecializedPlanetaryCommoditiesHold' | 'SpecializedSalvageHold' | 'SpecializedShipHold' | 'SpecializedSmallShipHold' | 'SubSystemBay' | 'SubSystemSlot0' | 'SubSystemSlot1' | 'SubSystemSlot2' | 'SubSystemSlot3' | 'SubSystemSlot4' | 'SubSystemSlot5' | 'SubSystemSlot6' | 'SubSystemSlot7' | 'Unlocked' | 'Wardrobe';
    export const LocationFlagEnum = {
        AssetSafety: 'AssetSafety' as LocationFlagEnum,
        AutoFit: 'AutoFit' as LocationFlagEnum,
        BoosterBay: 'BoosterBay' as LocationFlagEnum,
        Cargo: 'Cargo' as LocationFlagEnum,
        CorpseBay: 'CorpseBay' as LocationFlagEnum,
        Deliveries: 'Deliveries' as LocationFlagEnum,
        DroneBay: 'DroneBay' as LocationFlagEnum,
        FighterBay: 'FighterBay' as LocationFlagEnum,
        FighterTube0: 'FighterTube0' as LocationFlagEnum,
        FighterTube1: 'FighterTube1' as LocationFlagEnum,
        FighterTube2: 'FighterTube2' as LocationFlagEnum,
        FighterTube3: 'FighterTube3' as LocationFlagEnum,
        FighterTube4: 'FighterTube4' as LocationFlagEnum,
        FleetHangar: 'FleetHangar' as LocationFlagEnum,
        Hangar: 'Hangar' as LocationFlagEnum,
        HangarAll: 'HangarAll' as LocationFlagEnum,
        HiSlot0: 'HiSlot0' as LocationFlagEnum,
        HiSlot1: 'HiSlot1' as LocationFlagEnum,
        HiSlot2: 'HiSlot2' as LocationFlagEnum,
        HiSlot3: 'HiSlot3' as LocationFlagEnum,
        HiSlot4: 'HiSlot4' as LocationFlagEnum,
        HiSlot5: 'HiSlot5' as LocationFlagEnum,
        HiSlot6: 'HiSlot6' as LocationFlagEnum,
        HiSlot7: 'HiSlot7' as LocationFlagEnum,
        HiddenModifiers: 'HiddenModifiers' as LocationFlagEnum,
        Implant: 'Implant' as LocationFlagEnum,
        LoSlot0: 'LoSlot0' as LocationFlagEnum,
        LoSlot1: 'LoSlot1' as LocationFlagEnum,
        LoSlot2: 'LoSlot2' as LocationFlagEnum,
        LoSlot3: 'LoSlot3' as LocationFlagEnum,
        LoSlot4: 'LoSlot4' as LocationFlagEnum,
        LoSlot5: 'LoSlot5' as LocationFlagEnum,
        LoSlot6: 'LoSlot6' as LocationFlagEnum,
        LoSlot7: 'LoSlot7' as LocationFlagEnum,
        Locked: 'Locked' as LocationFlagEnum,
        MedSlot0: 'MedSlot0' as LocationFlagEnum,
        MedSlot1: 'MedSlot1' as LocationFlagEnum,
        MedSlot2: 'MedSlot2' as LocationFlagEnum,
        MedSlot3: 'MedSlot3' as LocationFlagEnum,
        MedSlot4: 'MedSlot4' as LocationFlagEnum,
        MedSlot5: 'MedSlot5' as LocationFlagEnum,
        MedSlot6: 'MedSlot6' as LocationFlagEnum,
        MedSlot7: 'MedSlot7' as LocationFlagEnum,
        QuafeBay: 'QuafeBay' as LocationFlagEnum,
        RigSlot0: 'RigSlot0' as LocationFlagEnum,
        RigSlot1: 'RigSlot1' as LocationFlagEnum,
        RigSlot2: 'RigSlot2' as LocationFlagEnum,
        RigSlot3: 'RigSlot3' as LocationFlagEnum,
        RigSlot4: 'RigSlot4' as LocationFlagEnum,
        RigSlot5: 'RigSlot5' as LocationFlagEnum,
        RigSlot6: 'RigSlot6' as LocationFlagEnum,
        RigSlot7: 'RigSlot7' as LocationFlagEnum,
        ShipHangar: 'ShipHangar' as LocationFlagEnum,
        Skill: 'Skill' as LocationFlagEnum,
        SpecializedAmmoHold: 'SpecializedAmmoHold' as LocationFlagEnum,
        SpecializedCommandCenterHold: 'SpecializedCommandCenterHold' as LocationFlagEnum,
        SpecializedFuelBay: 'SpecializedFuelBay' as LocationFlagEnum,
        SpecializedGasHold: 'SpecializedGasHold' as LocationFlagEnum,
        SpecializedIndustrialShipHold: 'SpecializedIndustrialShipHold' as LocationFlagEnum,
        SpecializedLargeShipHold: 'SpecializedLargeShipHold' as LocationFlagEnum,
        SpecializedMaterialBay: 'SpecializedMaterialBay' as LocationFlagEnum,
        SpecializedMediumShipHold: 'SpecializedMediumShipHold' as LocationFlagEnum,
        SpecializedMineralHold: 'SpecializedMineralHold' as LocationFlagEnum,
        SpecializedOreHold: 'SpecializedOreHold' as LocationFlagEnum,
        SpecializedPlanetaryCommoditiesHold: 'SpecializedPlanetaryCommoditiesHold' as LocationFlagEnum,
        SpecializedSalvageHold: 'SpecializedSalvageHold' as LocationFlagEnum,
        SpecializedShipHold: 'SpecializedShipHold' as LocationFlagEnum,
        SpecializedSmallShipHold: 'SpecializedSmallShipHold' as LocationFlagEnum,
        SubSystemBay: 'SubSystemBay' as LocationFlagEnum,
        SubSystemSlot0: 'SubSystemSlot0' as LocationFlagEnum,
        SubSystemSlot1: 'SubSystemSlot1' as LocationFlagEnum,
        SubSystemSlot2: 'SubSystemSlot2' as LocationFlagEnum,
        SubSystemSlot3: 'SubSystemSlot3' as LocationFlagEnum,
        SubSystemSlot4: 'SubSystemSlot4' as LocationFlagEnum,
        SubSystemSlot5: 'SubSystemSlot5' as LocationFlagEnum,
        SubSystemSlot6: 'SubSystemSlot6' as LocationFlagEnum,
        SubSystemSlot7: 'SubSystemSlot7' as LocationFlagEnum,
        Unlocked: 'Unlocked' as LocationFlagEnum,
        Wardrobe: 'Wardrobe' as LocationFlagEnum
    }
    export type LocationTypeEnum = 'station' | 'solar_system' | 'other';
    export const LocationTypeEnum = {
        Station: 'station' as LocationTypeEnum,
        SolarSystem: 'solar_system' as LocationTypeEnum,
        Other: 'other' as LocationTypeEnum
    }
}
