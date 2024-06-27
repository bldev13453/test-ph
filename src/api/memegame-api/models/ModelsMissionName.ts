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

/**
 *
 * @export
 */
export const ModelsMissionName = {
  MissionNameInviteFriend: "invite_friend",
  MissionNameInviteFriends: "invite_friends",
  MissionNameSubscribeToChannel: "subscribe_to_channel",
} as const;
export type ModelsMissionName =
  (typeof ModelsMissionName)[keyof typeof ModelsMissionName];

export function instanceOfModelsMissionName(value: any): boolean {
  for (const key in ModelsMissionName) {
    if (Object.prototype.hasOwnProperty.call(ModelsMissionName, key)) {
      if (ModelsMissionName[key] === value) {
        return true;
      }
    }
  }
  return false;
}

export function ModelsMissionNameFromJSON(json: any): ModelsMissionName {
  return ModelsMissionNameFromJSONTyped(json, false);
}

export function ModelsMissionNameFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ModelsMissionName {
  return json as ModelsMissionName;
}

export function ModelsMissionNameToJSON(value?: ModelsMissionName | null): any {
  return value as any;
}