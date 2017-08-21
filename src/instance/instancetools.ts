import * as PH from "../";

export function fieldContentsExcerpt(instance: PH.Instance.InstanceDetails, maxLen: number): string {
  if (instance == null || instance.extras.fieldContents == null)
    return "";

  let excerpt = "";
  for (const key in instance.extras.fieldContents) {
    if (typeof(instance.extras.fieldContents[key]) == "string"
      && instance.extras.fieldContents[key].trim() != ""
      && !instance.extras.fieldContents[key].startsWith("http://")
      && !instance.extras.fieldContents[key].startsWith("https://"))
    excerpt += instance.extras.fieldContents[key] + " / ";
  }
  if (excerpt.endsWith(" / "))
    excerpt = excerpt.substr(0, excerpt.length - 3);

  return PH.Tools.stringExcerpt(excerpt, maxLen);
}