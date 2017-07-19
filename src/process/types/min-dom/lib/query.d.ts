declare module "min-dom/lib/query" {
  export = query;

  function query(selector: string, el: {}): HTMLElement;
}