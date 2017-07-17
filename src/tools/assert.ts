// Wir nutzen im gesamten Code ausgiebig Assertion-Tests, da hiermit Fehler sehr schnell entdeckt werden.

// In allen Bereichen außer /test sollen nur die hier gekapselten Asserts verwendet werden,
// die wir später so implementieren, dass sie im Production-Code automatisch entfernt werden.

import * as Chai from "chai";

// Production Environment?
let isProduction: boolean = false;

export function error(message?: string): void {
  if (!isProduction)
    Chai.assert.fail(true, false, message);
}

export function equal(actual: any, expected: any, message?: string): void {
  if (!isProduction)
    Chai.assert.equal(actual, expected, message);
}

export function isTrue(actual: boolean, message?: string): void {
  if (!isProduction)
    Chai.assert.isTrue(actual, message);
}

export function isFalse(actual: boolean, message?: string): void {
  if (!isProduction)
    Chai.assert.isFalse(actual, message);
}
