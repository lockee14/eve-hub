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
export interface GetUniverseGraphicsGraphicIdOk {
    /**
     * collision_file string
     */
    collisionFile?: string;
    /**
     * graphic_file string
     */
    graphicFile?: string;
    /**
     * graphic_id integer
     */
    graphicId: number;
    /**
     * icon_folder string
     */
    iconFolder?: string;
    /**
     * sof_dna string
     */
    sofDna?: string;
    /**
     * sof_fation_name string
     */
    sofFationName?: string;
    /**
     * sof_hull_name string
     */
    sofHullName?: string;
    /**
     * sof_race_name string
     */
    sofRaceName?: string;
}
