import * as PH from "../";

export function fieldContentsExcerpt(instance: PH.Instance.InstanceDetails, maxLen: number): string {
  if (instance == null || instance.extras.fieldContents == null)
    return "";

  let excerpt = "";
  for (const key in instance.extras.fieldContents) {
    const value = instance.extras.fieldContents[key];
    if (typeof (value) == "string"
      && (value as string).trim() != ""
      && !(value as string).startsWith("http://")
      && !(value as string).startsWith("https://")) {
      excerpt += instance.extras.fieldContents[key] + " / ";
    }
  }
  if (excerpt.endsWith(" / "))
    excerpt = excerpt.substr(0, excerpt.length - 3);

  return PH.Tools.stringExcerpt(excerpt, maxLen);
}