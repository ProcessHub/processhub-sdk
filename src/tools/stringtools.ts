// Mailadresse auf Gültigkeit prüfen
export function isValidMailAddress(mail: string): boolean {
  // fault tolerant - don't block too many
  let re = /\S+@\S+\.\S+/;
  return re.test(mail);
}

export function isValidWorkspaceName(workspaceName: string): boolean {
  if ((workspaceName == null) 
  || (workspaceName.length < 5)
  || (workspaceName.indexOf(" ") >= 0)) {
    return false;
  }

  // all UTF-Characters are allowed, because the workspace name 
  // is created from the user name at registration
  return true;  
}

// Benutzer-Realname auf Gültigkeit prüfen
export function isValidRealname(realName: string): boolean {
  // Nur Mindestlänge 5 Zeichen einfordern
  if (realName == null || realName.length < 5)
    return false;
  else
    return true;
}

// Konvertiert einen String in ein Url-taugliches Format
// Bsp.: Mein schöner Titel -> Mein-schoner-Titel
export function toCleanUrl(text: string): string {
  return text.toLowerCase()
    .replace("ä", "ae")
    .replace("ö", "oe")
    .replace("ü", "ue")
    .replace("ß", "ss")
    .replace(/[\/\\+\.?=&%_#| -]+/g, "-")
    .replace(/[\(\)]+/g, "")
    .trim();
}

export function stringExcerpt(source: string, maxLen: number) {
  if (source == null || source.length <= maxLen)
    return source;
  else {
    let dest = source.substr(0, maxLen);
    if (source.substr(maxLen, 1) != " ") { }
    // String bis zum letzten vollständigen Wort zurückgeben  
    let last = dest.lastIndexOf(" ");
    if (last != -1)
      dest = dest.substr(0, last);

    return dest + "...";
  }
}

export function getQueryParameter(parameter: string, location?: string) {
  if (location == null && typeof window != "undefined") {
    location = window.location.href;
  }

  parameter = parameter.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + parameter + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(location);
  if (!results) 
    return null;
  if (!results[2]) 
    return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const SPLITSIGN_EMAILADDRESSES: string[] = [",", ";", " ", "\n"];

export function splitStringOnMultipleSigns(parameter: string, splitSignListOrdner: number = 0): string[] {
  if (parameter.length === 0) {
    return null;
  }

  let splitResult = parameter.split(SPLITSIGN_EMAILADDRESSES[splitSignListOrdner]);

  if (splitResult.length == 1 && (splitSignListOrdner + 1) == SPLITSIGN_EMAILADDRESSES.length) {
    return splitResult;
  }

  // Wenn das splitzeichen nicht korrekt war nochmal
  if (splitResult.length == 1) {
    return splitStringOnMultipleSigns(parameter, (splitSignListOrdner + 1));
  }

  let result: string[] = [];
  for (let split of splitResult) { 
    if (split.trim().length > 0)
      result.push(split.trim());
  }

  return result;
}

export function getShuffledNumberArray(amountOfElements: number, numberLenght: number = 3) {
  let array: number[] = [];
  for (let i = 0; i < amountOfElements; i++) {
    let value = ("000" + i).slice(-(numberLenght));
    array.push(parseInt(value));
  }
  return shuffleArray(array);
}

// Randomize array element order in-place.
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

