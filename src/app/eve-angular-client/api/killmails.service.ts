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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

// import { Observable }                                        from 'rxjs/Observable';
import { Observable } from 'rxjs';

import { BadRequest } from '../model/badRequest';
import { ErrorLimited } from '../model/errorLimited';
import { Forbidden } from '../model/forbidden';
import { GatewayTimeout } from '../model/gatewayTimeout';
import { GetCharactersCharacterIdKillmailsRecent200Ok } from '../model/getCharactersCharacterIdKillmailsRecent200Ok';
import { GetCorporationsCorporationIdKillmailsRecent200Ok } from '../model/getCorporationsCorporationIdKillmailsRecent200Ok';
import { GetKillmailsKillmailIdKillmailHashOk } from '../model/getKillmailsKillmailIdKillmailHashOk';
import { GetKillmailsKillmailIdKillmailHashUnprocessableEntity } from '../model/getKillmailsKillmailIdKillmailHashUnprocessableEntity';
import { InternalServerError } from '../model/internalServerError';
import { ServiceUnavailable } from '../model/serviceUnavailable';
import { Unauthorized } from '../model/unauthorized';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class KillmailsService {

    protected basePath = 'https://esi.evetech.net';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (let consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Get a character&#39;s recent kills and losses
     * Return a list of a character&#39;s kills and losses going back 90 days  ---  This route is cached for up to 300 seconds
     * @param characterId An EVE character ID
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param page Which page of results to return
     * @param token Access token to use if unable to set a header
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCharactersCharacterIdKillmailsRecent(characterId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<GetCharactersCharacterIdKillmailsRecent200Ok>>;
    public getCharactersCharacterIdKillmailsRecent(characterId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<GetCharactersCharacterIdKillmailsRecent200Ok>>>;
    public getCharactersCharacterIdKillmailsRecent(characterId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<GetCharactersCharacterIdKillmailsRecent200Ok>>>;
    public getCharactersCharacterIdKillmailsRecent(characterId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (characterId === null || characterId === undefined) {
            throw new Error('Required parameter characterId was null or undefined when calling getCharactersCharacterIdKillmailsRecent.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (datasource !== undefined) {
            queryParameters = queryParameters.set('datasource', <any>datasource);
        }
        if (page !== undefined) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (token !== undefined) {
            queryParameters = queryParameters.set('token', <any>token);
        }

        let headers = this.defaultHeaders;
        if (ifNoneMatch !== undefined && ifNoneMatch !== null) {
            headers = headers.set('If-None-Match', String(ifNoneMatch));
        }

        // authentication (evesso) required
        if (this.configuration.accessToken) {
            let accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.get<Array<GetCharactersCharacterIdKillmailsRecent200Ok>>(`${this.basePath}/v1/characters/${encodeURIComponent(String(characterId))}/killmails/recent/`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a corporation&#39;s recent kills and losses
     * Get a list of a corporation&#39;s kills and losses going back 90 days  ---  This route is cached for up to 300 seconds  --- Requires one of the following EVE corporation role(s): Director
     * @param corporationId An EVE corporation ID
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param page Which page of results to return
     * @param token Access token to use if unable to set a header
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCorporationsCorporationIdKillmailsRecent(corporationId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<GetCorporationsCorporationIdKillmailsRecent200Ok>>;
    public getCorporationsCorporationIdKillmailsRecent(corporationId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<GetCorporationsCorporationIdKillmailsRecent200Ok>>>;
    public getCorporationsCorporationIdKillmailsRecent(corporationId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<GetCorporationsCorporationIdKillmailsRecent200Ok>>>;
    public getCorporationsCorporationIdKillmailsRecent(corporationId: number, datasource?: string, ifNoneMatch?: string, page?: number, token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (corporationId === null || corporationId === undefined) {
            throw new Error('Required parameter corporationId was null or undefined when calling getCorporationsCorporationIdKillmailsRecent.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (datasource !== undefined) {
            queryParameters = queryParameters.set('datasource', <any>datasource);
        }
        if (page !== undefined) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (token !== undefined) {
            queryParameters = queryParameters.set('token', <any>token);
        }

        let headers = this.defaultHeaders;
        if (ifNoneMatch !== undefined && ifNoneMatch !== null) {
            headers = headers.set('If-None-Match', String(ifNoneMatch));
        }

        // authentication (evesso) required
        if (this.configuration.accessToken) {
            let accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.get<Array<GetCorporationsCorporationIdKillmailsRecent200Ok>>(`${this.basePath}/v1/corporations/${encodeURIComponent(String(corporationId))}/killmails/recent/`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a single killmail
     * Return a single killmail from its ID and hash  ---  This route is cached for up to 1209600 seconds
     * @param killmailHash The killmail hash for verification
     * @param killmailId The killmail ID to be queried
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getKillmailsKillmailIdKillmailHash(killmailHash: string, killmailId: number, datasource?: string, ifNoneMatch?: string, observe?: 'body', reportProgress?: boolean): Observable<GetKillmailsKillmailIdKillmailHashOk>;
    public getKillmailsKillmailIdKillmailHash(killmailHash: string, killmailId: number, datasource?: string, ifNoneMatch?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<GetKillmailsKillmailIdKillmailHashOk>>;
    public getKillmailsKillmailIdKillmailHash(killmailHash: string, killmailId: number, datasource?: string, ifNoneMatch?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<GetKillmailsKillmailIdKillmailHashOk>>;
    public getKillmailsKillmailIdKillmailHash(killmailHash: string, killmailId: number, datasource?: string, ifNoneMatch?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (killmailHash === null || killmailHash === undefined) {
            throw new Error('Required parameter killmailHash was null or undefined when calling getKillmailsKillmailIdKillmailHash.');
        }
        if (killmailId === null || killmailId === undefined) {
            throw new Error('Required parameter killmailId was null or undefined when calling getKillmailsKillmailIdKillmailHash.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (datasource !== undefined) {
            queryParameters = queryParameters.set('datasource', <any>datasource);
        }

        let headers = this.defaultHeaders;
        if (ifNoneMatch !== undefined && ifNoneMatch !== null) {
            headers = headers.set('If-None-Match', String(ifNoneMatch));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.get<GetKillmailsKillmailIdKillmailHashOk>(`${this.basePath}/v1/killmails/${encodeURIComponent(String(killmailId))}/${encodeURIComponent(String(killmailHash))}/`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
