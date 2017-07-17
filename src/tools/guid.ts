const ID_LENGTH = 16;
const TEMP_USERID_PREFIX = "tmpUserId_";

function idHelper(count: number) {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += (((1 + Math.random()) * 0x10000) | 0).toString(ID_LENGTH).substring(1);
  }
  return out;
}

// Wir verwenden keine echten Ids, sondern Hexstrings mit 16 Zeichen länge.
// Das spart in Summe Platz, steigert langfristig die Performance und bietet ausreichend Genauigkeit
export function createId(): string {
  // Wir verwenden UpperCase-Ids da MySql HEX()-Funktion ebenfalls Uppercase liefert - das vereinfacht das Handling
  return idHelper(4).toUpperCase();
}

export function createUserId(): string {
  // UserIds beginnen mit 0
  return "0" + createId().substr(1);
}

export function createGroupId(): string {
  // GroupIds beginnen mit 0
  return "1" + createId().substr(1);
}

export function createWorkspaceId(): string {
  // Ids beginnen mit 2 zur Unterscheidung von UserId/GroupIds
  // 000 reserviert für evtl. Unterscheidung Region/Datenbank
  return "2000" + createId().substr(4);
}

// Ist String eine Id?
export function isId(id: string): boolean {
  return (id.length === ID_LENGTH && id.toUpperCase() === id);
}

export function isUserId(id: string): boolean {
  return (isId(id) && id.substr(0, 1) == "0");
}

export function isGroupId(id: string): boolean {
  return (isId(id) && id.substr(0, 1) == "1");
}

export function isWorkspaceId(id: string): boolean {
  return (isId(id) && id.substr(0, 4) == "2000");
}

export function nullId(): string {
  return "0000000000000000";
}

export function isTempUserId(id: string): boolean {
  let prefixLength = TEMP_USERID_PREFIX.length;
  return (id.substr(0, prefixLength) == TEMP_USERID_PREFIX);
}

// Nummer im Format 123.456
export function createInstanceNumber(): string {
  return Math.floor(1000 + Math.random() * 1000).toString().substr(1, 3) + "." + Math.floor(1000 + Math.random() * 1000).toString().substr(1, 3);
}
