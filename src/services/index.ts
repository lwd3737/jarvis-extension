import { ConfigService } from "./config.service";

export * from "./bind";
export * from "./service";
export * from "./config.service";
export * from "./chat-completion.service";
export * from "./di-container";

export type MyConfig = { apiKey: string; gptModel: string };

export type MyConfigService = ConfigService<MyConfig>;
