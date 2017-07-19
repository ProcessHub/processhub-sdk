declare module "diagram-js/lib/command/CommandInterceptor" {
  import EventBus = require("diagram-js/lib/core/EventBus");

  export = CommandInterceptor;

  class CommandInterceptor {
    constructor(eventBus: EventBus);
  }
}
