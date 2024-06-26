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

import { mapValues } from "../runtime";
import type { ModelsUserState } from "./ModelsUserState";
import {
  ModelsUserStateFromJSON,
  ModelsUserStateFromJSONTyped,
  ModelsUserStateToJSON,
} from "./ModelsUserState";

/**
 *
 * @export
 * @interface HttpGetUserStateResp
 */
export interface HttpGetUserStateResp {
  /**
   *
   * @type {ModelsUserState}
   * @memberof HttpGetUserStateResp
   */
  userState?: ModelsUserState;
}

/**
 * Check if a given object implements the HttpGetUserStateResp interface.
 */
export function instanceOfHttpGetUserStateResp(
  value: object,
): value is HttpGetUserStateResp {
  return true;
}

export function HttpGetUserStateRespFromJSON(json: any): HttpGetUserStateResp {
  return HttpGetUserStateRespFromJSONTyped(json, false);
}

export function HttpGetUserStateRespFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): HttpGetUserStateResp {
  if (json == null) {
    return json;
  }
  return {
    userState:
      json["user_state"] == null
        ? undefined
        : ModelsUserStateFromJSON(json["user_state"]),
  };
}

export function HttpGetUserStateRespToJSON(
  value?: HttpGetUserStateResp | null,
): any {
  if (value == null) {
    return value;
  }
  return {
    user_state: ModelsUserStateToJSON(value["userState"]),
  };
}
