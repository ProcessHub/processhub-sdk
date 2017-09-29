/**
 * Wrapper for WebStorage localStorage (https://html.spec.whatwg.org/multipage/webstorage.html#dom-localstorage) to handle exceptions in a single place
 */
export class LocalWebStorage {

  public static getItem(key: string): string {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem failed");
      console.warn(e);
      return undefined;
    }
  }
  
  public static setItem(key: string, data: string): void {
    try {
      localStorage.setItem(key, data);
    } catch (e) {
      console.warn("localStorage.setItem failed");
      console.warn(e);
    }
  }


}