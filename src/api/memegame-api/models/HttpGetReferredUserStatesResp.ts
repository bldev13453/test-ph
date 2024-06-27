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
 * @interface HttpGetReferredUserStatesResp
 */
export interface HttpGetReferredUserStatesResp {
  /**
   *
   * @type {Array<ModelsUserState>}
   * @memberof HttpGetReferredUserStatesResp
   */
  userStates?: Array<ModelsUserState>;
}

/**
 * Check if a given object implements the HttpGetReferredUserStatesResp interface.
 */
export function instanceOfHttpGetReferredUserStatesResp(
  value: object,
): value is HttpGetReferredUserStatesResp {
  return true;
}

export function HttpGetReferredUserStatesRespFromJSON(
  json: any,
): HttpGetReferredUserStatesResp {
  return HttpGetReferredUserStatesRespFromJSONTyped(json, false);
}

export function HttpGetReferredUserStatesRespFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): HttpGetReferredUserStatesResp {
  if (json == null) {
    return json;
  }
  return {
    userStates:
      json["user_states"] == null
        ? undefined
        : (json["user_states"] as Array<any>).map(ModelsUserStateFromJSON),
  };
}

export function HttpGetReferredUserStatesRespToJSON(
  value?: HttpGetReferredUserStatesResp | null,
): any {
  if (value == null) {
    return value;
  }
  return {
    user_states:
      value["userStates"] == null
        ? undefined
        : (value["userStates"] as Array<any>).map(ModelsUserStateToJSON),
  };
}
