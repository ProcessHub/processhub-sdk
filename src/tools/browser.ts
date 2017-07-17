export function isMicrosoftEdge(): boolean {
  return /Edge\/1./i.test(navigator.userAgent);
}

export function isIE11(): boolean {
  return /Trident\/7\./.test(navigator.userAgent);
}