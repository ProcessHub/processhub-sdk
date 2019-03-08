import { isFieldValue } from "../data/datainterfaces";
import { isDefaultRole } from "../process/processrights";
import { InstanceDetails } from "./instanceinterfaces";
import { isValidMailAddress, stringExcerpt } from "../tools/stringtools";
import { isId } from "../tools/guid";
import * as Config from "../config";
import { parseAndInsertStringWithFieldContent } from "../data";
import { ProcessDetails } from "../process";

export function parseIdMailAddress(prefix: string, mail: string): string {
  mail = mail.toLowerCase();
  if (!isValidMailAddress(mail) || !mail.startsWith(prefix))
    return null;

  let instanceId = mail.split("@")[0].substr(prefix.length).toUpperCase();
  if (isId(instanceId))
    return instanceId;
  else
    return null;
}
export function getInstanceMailAddress(instanceId: string): string {
  if (Config.getBackendUrl() == "http://localhost:8080")
    return "i-" + instanceId.toLowerCase() + "@testmail.processhub.com";
  else
    return "i-" + instanceId.toLowerCase() + "@mail.processhub.com";
}
export function parseInstanceMailAddress(mail: string): string {
  return parseIdMailAddress("i-", mail);
}
export function parseInstanceMailSubject(mail: string): string {
  const regex: RegExp = /(\[)(i-)(.*?)(\])/gm;
  let match: RegExpExecArray;
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regex.exec(mail)) != null) {
    let maybeId: string = match[3];
    maybeId = maybeId.toUpperCase();
    if (isId(maybeId)) {
      return maybeId;
    }
  }
  return null;
}

// roleID == null -> check for any role membership
export function isRoleOwner(userId: string, roleId: string, instance: InstanceDetails): boolean {
  if (instance.extras.roleOwners == null)
    return false;

  if (roleId == null || roleId == "") {
    // check if user is owner of any role
    for (let role in instance.extras.roleOwners) {
      if (!isDefaultRole(role) && isRoleOwner(userId, role, instance))
        return true;
    }
    return false;
  }

  if (instance.extras.roleOwners[roleId] == null)
    return false;

  for (let roleOwner of instance.extras.roleOwners[roleId]) {
    if (roleOwner.memberId == userId)
      return true;
  }

  return false;
}

export function fieldContentsExcerpt(instance: InstanceDetails, maxLen: number): string {
  if (instance == null || instance.extras.fieldContents == null)
    return "";

  let excerpt = "";
  for (const key in instance.extras.fieldContents) {
    const field = instance.extras.fieldContents[key];

    if (isFieldValue(field)) {
      let value = field.value;
      if (typeof value == "string") {
        if (field.type == "ProcessHubDate") {
          // format date
          const date: Date = new Date(value);
          value = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
        }
        if (field.type != "ProcessHubTextArea")
          excerpt += value.toString() + " / ";
      }
    } else {
      if (typeof (field) == "string"
        && (field as string).trim() != ""
        && !(field as string).startsWith("http://")
        && !(field as string).startsWith("https://")) {
        excerpt += instance.extras.fieldContents[key] + " / ";
      }
    }
  }
  if (excerpt.endsWith(" / "))
    excerpt = excerpt.substr(0, excerpt.length - 3);

  return stringExcerpt(excerpt, maxLen);
}

export function getInstanceTitle(instance: InstanceDetails, process: ProcessDetails): string {
  if (process.extras.settings && process.extras.settings.dashboard && process.extras.settings.dashboard.cardTitle) {
    // legacy code, settings are not available for new processes any more
    return parseAndInsertStringWithFieldContent(process.extras.settings.dashboard.cardTitle, instance.extras.fieldContents, process.extras.bpmnProcess, instance.extras.roleOwners);
  } else if (instance.displayName && instance.displayName != "")
    return instance.displayName;
  else
    return process.displayName + " " + instance.instanceNumber;
}
