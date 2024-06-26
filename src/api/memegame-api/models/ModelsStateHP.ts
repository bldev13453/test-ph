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
/**
 *
 * @export
 * @interface ModelsStateHP
 */
export interface ModelsStateHP {
  /**
   *
   * @type {number}
   * @memberof ModelsStateHP
   */
  amount?: number;
  /**
   *
   * @type {number}
   * @memberof ModelsStateHP
   */
  price?: number;
}

/**
 * Check if a given object implements the ModelsStateHP interface.
 */
export function instanceOfModelsStateHP(value: object): value is ModelsStateHP {
  return true;
}

export function ModelsStateHPFromJSON(json: any): ModelsStateHP {
  return ModelsStateHPFromJSONTyped(json, false);
}

export function ModelsStateHPFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ModelsStateHP {
  if (json == null) {
    return json;
  }
  return {
    amount: json["amount"] == null ? undefined : json["amount"],
    price: json["price"] == null ? undefined : json["price"],
  };
}

export function ModelsStateHPToJSON(value?: ModelsStateHP | null): any {
  if (value == null) {
    return value;
  }
  return {
    amount: value["amount"],
    price: value["price"],
  };
}
