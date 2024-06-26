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
  HttpGetStateLevelsResp,
  HttpUpdateStateLevelResp,
} from "../models/index";
import {
  HttpGetStateLevelsRespFromJSON,
  HttpGetStateLevelsRespToJSON,
  HttpUpdateStateLevelRespFromJSON,
  HttpUpdateStateLevelRespToJSON,
} from "../models/index";

export interface StatesLevelsLevelNamePutRequest {
  levelName: string;
}

/**
 *
 */
export class StatesLevelsApi extends runtime.BaseAPI {
  /**
   * get state levels
   */
  async statesLevelsGetRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<HttpGetStateLevelsResp>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/states/levels`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      HttpGetStateLevelsRespFromJSON(jsonValue),
    );
  }

  /**
   * get state levels
   */
  async statesLevelsGet(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<HttpGetStateLevelsResp> {
    const response = await this.statesLevelsGetRaw(initOverrides);
    return await response.value();
  }

  /**
   * upgrade state level
   */
  async statesLevelsLevelNamePutRaw(
    requestParameters: StatesLevelsLevelNamePutRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<HttpUpdateStateLevelResp>> {
    if (requestParameters["levelName"] == null) {
      throw new runtime.RequiredError(
        "levelName",
        'Required parameter "levelName" was null or undefined when calling statesLevelsLevelNamePut().',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/states/levels/{level_name}`.replace(
          `{${"level_name"}}`,
          encodeURIComponent(String(requestParameters["levelName"])),
        ),
        method: "PUT",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      HttpUpdateStateLevelRespFromJSON(jsonValue),
    );
  }

  /**
   * upgrade state level
   */
  async statesLevelsLevelNamePut(
    requestParameters: StatesLevelsLevelNamePutRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<HttpUpdateStateLevelResp> {
    const response = await this.statesLevelsLevelNamePutRaw(
      requestParameters,
      initOverrides,
    );
    return await response.value();
  }
}
