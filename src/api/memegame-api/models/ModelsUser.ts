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
import type { GormDeletedAt } from "./GormDeletedAt";
import {
  GormDeletedAtFromJSON,
  GormDeletedAtFromJSONTyped,
  GormDeletedAtToJSON,
} from "./GormDeletedAt";

/**
 *
 * @export
 * @interface ModelsUser
 */
export interface ModelsUser {
  /**
   *
   * @type {string}
   * @memberof ModelsUser
   */
  createdAt?: string;
  /**
   *
   * @type {GormDeletedAt}
   * @memberof ModelsUser
   */
  deletedAt?: GormDeletedAt;
  /**
   *
   * @type {string}
   * @memberof ModelsUser
   */
  firstName?: string;
  /**
   *
   * @type {number}
   * @memberof ModelsUser
   */
  id?: number;
  /**
   *
   * @type {boolean}
   * @memberof ModelsUser
   */
  isPremium?: boolean;
  /**
   *
   * @type {string}
   * @memberof ModelsUser
   */
  languageCode?: string;
  /**
   *
   * @type {string}
   * @memberof ModelsUser
   */
  lastName?: string;
  /**
   *
   * @type {number}
   * @memberof ModelsUser
   */
  referredAmount?: number;
  /**
   *
   * @type {number}
   * @memberof ModelsUser
   */
  referredById?: number;
  /**
   *
   * @type {string}
   * @memberof ModelsUser
   */
  updatedAt?: string;
  /**
   *
   * @type {string}
   * @memberof ModelsUser
   */
  username?: string;
}

/**
 * Check if a given object implements the ModelsUser interface.
 */
export function instanceOfModelsUser(value: object): value is ModelsUser {
  return true;
}

export function ModelsUserFromJSON(json: any): ModelsUser {
  return ModelsUserFromJSONTyped(json, false);
}

export function ModelsUserFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ModelsUser {
  if (json == null) {
    return json;
  }
  return {
    createdAt: json["createdAt"] == null ? undefined : json["createdAt"],
    deletedAt:
      json["deletedAt"] == null
        ? undefined
        : GormDeletedAtFromJSON(json["deletedAt"]),
    firstName: json["first_name"] == null ? undefined : json["first_name"],
    id: json["id"] == null ? undefined : json["id"],
    isPremium: json["is_premium"] == null ? undefined : json["is_premium"],
    languageCode:
      json["language_code"] == null ? undefined : json["language_code"],
    lastName: json["last_name"] == null ? undefined : json["last_name"],
    referredAmount:
      json["referred_amount"] == null ? undefined : json["referred_amount"],
    referredById:
      json["referred_by_id"] == null ? undefined : json["referred_by_id"],
    updatedAt: json["updatedAt"] == null ? undefined : json["updatedAt"],
    username: json["username"] == null ? undefined : json["username"],
  };
}

export function ModelsUserToJSON(value?: ModelsUser | null): any {
  if (value == null) {
    return value;
  }
  return {
    createdAt: value["createdAt"],
    deletedAt: GormDeletedAtToJSON(value["deletedAt"]),
    first_name: value["firstName"],
    id: value["id"],
    is_premium: value["isPremium"],
    language_code: value["languageCode"],
    last_name: value["lastName"],
    referred_amount: value["referredAmount"],
    referred_by_id: value["referredById"],
    updatedAt: value["updatedAt"],
    username: value["username"],
  };
}
