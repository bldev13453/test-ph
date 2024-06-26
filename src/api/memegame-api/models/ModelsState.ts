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
 * @interface ModelsState
 */
export interface ModelsState {
  /**
   *
   * @type {string}
   * @memberof ModelsState
   */
  createdAt?: string;
  /**
   *
   * @type {GormDeletedAt}
   * @memberof ModelsState
   */
  deletedAt?: GormDeletedAt;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  dogeLevel?: number;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  hpAmount?: number;
  /**
   *
   * @type {string}
   * @memberof ModelsState
   */
  hpFillsAt?: string;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  hpLevel?: number;
  /**
   *
   * @type {string}
   * @memberof ModelsState
   */
  hpRefilledAt?: string;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  hpRegenLevel?: number;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof ModelsState
   */
  notificationSentAt?: string;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  pepeLevel?: number;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  tokenAmount?: number;
  /**
   *
   * @type {string}
   * @memberof ModelsState
   */
  updatedAt?: string;
  /**
   *
   * @type {number}
   * @memberof ModelsState
   */
  userId?: number;
}

/**
 * Check if a given object implements the ModelsState interface.
 */
export function instanceOfModelsState(value: object): value is ModelsState {
  return true;
}

export function ModelsStateFromJSON(json: any): ModelsState {
  return ModelsStateFromJSONTyped(json, false);
}

export function ModelsStateFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ModelsState {
  if (json == null) {
    return json;
  }
  return {
    createdAt: json["createdAt"] == null ? undefined : json["createdAt"],
    deletedAt:
      json["deletedAt"] == null
        ? undefined
        : GormDeletedAtFromJSON(json["deletedAt"]),
    dogeLevel: json["doge_level"] == null ? undefined : json["doge_level"],
    hpAmount: json["hp_amount"] == null ? undefined : json["hp_amount"],
    hpFillsAt: json["hp_fills_at"] == null ? undefined : json["hp_fills_at"],
    hpLevel: json["hp_level"] == null ? undefined : json["hp_level"],
    hpRefilledAt:
      json["hp_refilled_at"] == null ? undefined : json["hp_refilled_at"],
    hpRegenLevel:
      json["hp_regen_level"] == null ? undefined : json["hp_regen_level"],
    id: json["id"] == null ? undefined : json["id"],
    notificationSentAt:
      json["notification_sent_at"] == null
        ? undefined
        : json["notification_sent_at"],
    pepeLevel: json["pepe_level"] == null ? undefined : json["pepe_level"],
    tokenAmount:
      json["token_amount"] == null ? undefined : json["token_amount"],
    updatedAt: json["updatedAt"] == null ? undefined : json["updatedAt"],
    userId: json["user_id"] == null ? undefined : json["user_id"],
  };
}

export function ModelsStateToJSON(value?: ModelsState | null): any {
  if (value == null) {
    return value;
  }
  return {
    createdAt: value["createdAt"],
    deletedAt: GormDeletedAtToJSON(value["deletedAt"]),
    doge_level: value["dogeLevel"],
    hp_amount: value["hpAmount"],
    hp_fills_at: value["hpFillsAt"],
    hp_level: value["hpLevel"],
    hp_refilled_at: value["hpRefilledAt"],
    hp_regen_level: value["hpRegenLevel"],
    id: value["id"],
    notification_sent_at: value["notificationSentAt"],
    pepe_level: value["pepeLevel"],
    token_amount: value["tokenAmount"],
    updatedAt: value["updatedAt"],
    user_id: value["userId"],
  };
}
