import { Har } from "har-format";
export = BrowserMobClient;

type ClientConfig = {
  browserMob: { host: string; port: number; protocol: "http" };
};

type CreateHarOptions = {
  //  Boolean, capture headers or not. Optional, default to "false".
  captureHeaders?: boolean;

  // capture cookies or not. Optional, default to "false".
  captureCookies?: boolean;

  // Boolean, capture content bodies or not. Optional, default to "false".
  captureContent?: boolean;

  // Boolean, capture binary content or not. Optional, default to "false".
  captureBinaryContent?: boolean;

  // The string name of The first page ref that should be used in the HAR. Optional, default to "Page 1".
  initialPageRef?: string;

  // The title of first HAR page. Optional, default to initialPageRef.
  initialPageTitle?: string;
};

type SetLimitsOptions = {
  // Sets the downstream bandwidth limit in kbps. Optional.
  downstreamKbps?: string;

  // Sets the upstream bandwidth limit kbps. Optional, by default unlimited.
  upstreamKbps?: string;

  // Specifies how many kilobytes in total the client is allowed to download through the proxy. Optional, by default unlimited.
  downstreamMaxKB?: string;

  // Specifies how many kilobytes in total the client is allowed to upload through the proxy. Optional, by default unlimited.
  upstreamMaxKB?: string;

  // Add the given latency to each HTTP request. Optional, by default all requests are invoked without latency.
  latency?: number;

  // A boolean that enables the bandwidth limiter. Optional, by default to "false", but setting any of the properties above will implicitly enable throttling.
  enable?: boolean;

  // Specifying what percentage of data sent is payload, e.g. use this to take into account overhead due to tcp/ip. Optional.
  payloadPercentage?: number;

  // The max bits per seconds you want this instance of StreamManager to respect. Optional.
  maxBitsPerSecond?: number;
};

type StartOptions = {
  // Integer, The specific port to start the proxy service on. Optional, default is generated and returned in response.
  port?: number;

  // String, The username to use to authenticate with the chained proxy. Optional, default to null.
  proxyUsername?: string;

  // String, The password to use to authenticate with the chained proxy. Optional, default to null.
  proxyPassword?: string;

  // String, If running BrowserMob Proxy in a multi-homed environment, specify a desired bind address. Optional, default to "0.0.0.0".
  bindAddress?: string;

  // String, If running BrowserMob Proxy in a multi-homed environment, specify a desired server bind address. Optional, default to "0.0.0.0".
  serverBindAddress?: string;

  // Boolean. True, Uses Elliptic Curve Cryptography for certificate impersonation. Optional, default to "false".
  useEcc?: boolean;

  // Boolean. True, Disables verification of all upstream servers' SSL certificates. All upstream servers will be trusted, even if they do not present valid certificates signed by certification authorities in the JDK's trust store. Optional, default to "false".
  trustAllServers?: boolean;
};

type MethodType = "GET" | "POST" | "DELETE" | "PUT";

type StartReturn = {
  port: number;
};

declare class BrowserMobClient {
  static createClient(config: ClientConfig): BrowserMobClient;
  constructor(config: ClientConfig);
  createHar(options: CreateHarOptions): Promise<null>;
  getHar(): Promise<Har>;
  closeProxies(): Promise<any>;
  setLimits(options: SetLimitsOptions): Promise<any>;
  limits: any;
  start(options: StartOptions): Promise<StartReturn>;
  end(port: number): Promise<void>;
  listProxies(): Promise<Object>;
  callRest(url: string, method: MethodType, data: Object): Promise<any>;
  _callProxy(
    ext: string,
    method: MethodType,
    data: Object,
    proxyPort: number
  ): Promise<any>;
}
