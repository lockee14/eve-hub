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
import { GetCharactersCharacterIdOpportunities200Ok } from '../model/getCharactersCharacterIdOpportunities200Ok';
import { GetOpportunitiesGroupsGroupIdOk } from '../model/getOpportunitiesGroupsGroupIdOk';
import { GetOpportunitiesTasksTaskIdOk } from '../model/getOpportunitiesTasksTaskIdOk';
import { InternalServerError } from '../model/internalServerError';
import { ServiceUnavailable } from '../model/serviceUnavailable';
import { Unauthorized } from '../model/unauthorized';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class OpportunitiesService {

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
     * Get a character&#39;s completed tasks
     * Return a list of tasks finished by a character  ---  This route is cached for up to 3600 seconds
     * @param characterId An EVE character ID
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param token Access token to use if unable to set a header
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCharactersCharacterIdOpportunities(characterId: number, datasource?: string, ifNoneMatch?: string, token?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<GetCharactersCharacterIdOpportunities200Ok>>;
    public getCharactersCharacterIdOpportunities(characterId: number, datasource?: string, ifNoneMatch?: string, token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<GetCharactersCharacterIdOpportunities200Ok>>>;
    public getCharactersCharacterIdOpportunities(characterId: number, datasource?: string, ifNoneMatch?: string, token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<GetCharactersCharacterIdOpportunities200Ok>>>;
    public getCharactersCharacterIdOpportunities(characterId: number, datasource?: string, ifNoneMatch?: string, token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (characterId === null || characterId === undefined) {
            throw new Error('Required parameter characterId was null or undefined when calling getCharactersCharacterIdOpportunities.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (datasource !== undefined) {
            queryParameters = queryParameters.set('datasource', <any>datasource);
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

        return this.httpClient.get<Array<GetCharactersCharacterIdOpportunities200Ok>>(`${this.basePath}/v1/characters/${encodeURIComponent(String(characterId))}/opportunities/`,
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
     * Get opportunities groups
     * Return a list of opportunities groups  ---  This route expires daily at 11:05
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOpportunitiesGroups(datasource?: string, ifNoneMatch?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<number>>;
    public getOpportunitiesGroups(datasource?: string, ifNoneMatch?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<number>>>;
    public getOpportunitiesGroups(datasource?: string, ifNoneMatch?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<number>>>;
    public getOpportunitiesGroups(datasource?: string, ifNoneMatch?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.get<Array<number>>(`${this.basePath}/v1/opportunities/groups/`,
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
     * Get opportunities group
     * Return information of an opportunities group  ---  This route expires daily at 11:05
     * @param groupId ID of an opportunities group
     * @param acceptLanguage Language to use in the response
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param language Language to use in the response, takes precedence over Accept-Language
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOpportunitiesGroupsGroupId(groupId: number, acceptLanguage?: string, datasource?: string, ifNoneMatch?: string, language?: string, observe?: 'body', reportProgress?: boolean): Observable<GetOpportunitiesGroupsGroupIdOk>;
    public getOpportunitiesGroupsGroupId(groupId: number, acceptLanguage?: string, datasource?: string, ifNoneMatch?: string, language?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<GetOpportunitiesGroupsGroupIdOk>>;
    public getOpportunitiesGroupsGroupId(groupId: number, acceptLanguage?: string, datasource?: string, ifNoneMatch?: string, language?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<GetOpportunitiesGroupsGroupIdOk>>;
    public getOpportunitiesGroupsGroupId(groupId: number, acceptLanguage?: string, datasource?: string, ifNoneMatch?: string, language?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (groupId === null || groupId === undefined) {
            throw new Error('Required parameter groupId was null or undefined when calling getOpportunitiesGroupsGroupId.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (datasource !== undefined) {
            queryParameters = queryParameters.set('datasource', <any>datasource);
        }
        if (language !== undefined) {
            queryParameters = queryParameters.set('language', <any>language);
        }

        let headers = this.defaultHeaders;
        if (acceptLanguage !== undefined && acceptLanguage !== null) {
            headers = headers.set('Accept-Language', String(acceptLanguage));
        }
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

        return this.httpClient.get<GetOpportunitiesGroupsGroupIdOk>(`${this.basePath}/v1/opportunities/groups/${encodeURIComponent(String(groupId))}/`,
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
     * Get opportunities tasks
     * Return a list of opportunities tasks  ---  This route expires daily at 11:05
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOpportunitiesTasks(datasource?: string, ifNoneMatch?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<number>>;
    public getOpportunitiesTasks(datasource?: string, ifNoneMatch?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<number>>>;
    public getOpportunitiesTasks(datasource?: string, ifNoneMatch?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<number>>>;
    public getOpportunitiesTasks(datasource?: string, ifNoneMatch?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.get<Array<number>>(`${this.basePath}/v1/opportunities/tasks/`,
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
     * Get opportunities task
     * Return information of an opportunities task  ---  This route expires daily at 11:05
     * @param taskId ID of an opportunities task
     * @param datasource The server name you would like data from
     * @param ifNoneMatch ETag from a previous request. A 304 will be returned if this matches the current ETag
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOpportunitiesTasksTaskId(taskId: number, datasource?: string, ifNoneMatch?: string, observe?: 'body', reportProgress?: boolean): Observable<GetOpportunitiesTasksTaskIdOk>;
    public getOpportunitiesTasksTaskId(taskId: number, datasource?: string, ifNoneMatch?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<GetOpportunitiesTasksTaskIdOk>>;
    public getOpportunitiesTasksTaskId(taskId: number, datasource?: string, ifNoneMatch?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<GetOpportunitiesTasksTaskIdOk>>;
    public getOpportunitiesTasksTaskId(taskId: number, datasource?: string, ifNoneMatch?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (taskId === null || taskId === undefined) {
            throw new Error('Required parameter taskId was null or undefined when calling getOpportunitiesTasksTaskId.');
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

        return this.httpClient.get<GetOpportunitiesTasksTaskIdOk>(`${this.basePath}/v1/opportunities/tasks/${encodeURIComponent(String(taskId))}/`,
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
