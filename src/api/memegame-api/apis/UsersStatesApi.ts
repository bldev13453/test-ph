// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * Meme Game
 * Meme Game API
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from "../runtime";
import type {
  HttpGetReferredUserStatesResp,
  HttpGetUserStateResp,
} from "../models/index";
import {
  HttpGetReferredUserStatesRespFromJSON,
  HttpGetReferredUserStatesRespToJSON,
  HttpGetUserStateRespFromJSON,
  HttpGetUserStateRespToJSON,
} from "../models/index";

export interface UsersStatesReferredGetRequest {
  limit?: number;
  user?: string;
}

/**
 *
 */
export class UsersStatesApi extends runtime.BaseAPI {
  /**
   * get user state
   */
  async usersStatesGetRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<HttpGetUserStateResp>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/users/states`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      HttpGetUserStateRespFromJSON(jsonValue),
    );
  }

  /**
   * get user state
   */
  async usersStatesGet(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<HttpGetUserStateResp> {
    const response = await this.usersStatesGetRaw(initOverrides);
    return await response.value();
  }

  /**
   * get referred user states
   */
  async usersStatesReferredGetRaw(
    requestParameters: UsersStatesReferredGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<HttpGetReferredUserStatesResp>> {
    const queryParameters: any = {};

    if (requestParameters["limit"] != null) {
      queryParameters["limit"] = requestParameters["limit"];
    }

    if (requestParameters["user"] != null) {
      queryParameters["user"] = requestParameters["user"];
    }

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/users/states/referred`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      HttpGetReferredUserStatesRespFromJSON(jsonValue),
    );
  }

  /**
   * get referred user states
   */
  async usersStatesReferredGet(
    requestParameters: UsersStatesReferredGetRequest = {},
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<HttpGetReferredUserStatesResp> {
    const response = await this.usersStatesReferredGetRaw(
      requestParameters,
      initOverrides,
    );
    return await response.value();
  }
}
