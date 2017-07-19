declare module "min-dom/lib/domify" {
  export = domify;

  function domify(html: string): HTMLElement;
}