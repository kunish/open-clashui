export type ProxyGroup = {
  id: string;
  alive: string;
  name: string;
  type: string;
  all?: string[];
  icon?: string;
  extra: Record<string, unknown>;
  history: {
    time: string;
    delay: number;
  }[];
  hidden: boolean;
  udp: boolean;
  xudp: boolean;
  tfo: boolean;
  now: string;
  testUrl?: string;
  timeout?: number;
  "dialer-proxy": string;
  interface: string;
  mptcp: string;
  "routing-mark": number;
  uot: string;
  smux: boolean;
};

export type ProxyNode = {
  alive: boolean;
  type: string;
  name: string;
  tfo: boolean;
  udp: boolean;
  xudp: boolean;
  now: string;
  id: string;
  extra: Record<string, unknown>;
  history: {
    time: string;
    delay: number;
  }[];
};

export type SubscriptionInfo = {
  Download?: number;
  Upload?: number;
  Total?: number;
  Expire?: number;
};

export type ProxyProvider = {
  subscriptionInfo?: SubscriptionInfo;
  name: string;
  proxies: ProxyNode[];
  testUrl: string;
  timeout?: number;
  updatedAt: string;
  vehicleType: string;
};

export type Rule = {
  type: string;
  payload: string;
  proxy: string;
  size: number;
};

export type RuleProvider = {
  behavior: string;
  format: string;
  name: string;
  ruleCount: number;
  type: string;
  updatedAt: string;
  vehicleType: string;
};

export type ConnectionRawMessage = {
  id: string;
  download: number;
  upload: number;
  chains: string[];
  rule: string;
  rulePayload: string;
  start: string;
  metadata: {
    network: string;
    type: string;
    destinationIP: string;
    destinationPort: string;
    dnsMode: string;
    host: string;
    inboundIP: string;
    inboundName: string;
    inboundPort: string;
    inboundUser: string;
    process: string;
    processPath: string;
    remoteDestination: string;
    sniffHost: string;
    sourceIP: string;
    sourcePort: string;
    specialProxy: string;
    specialRules: string;
    uid: number;
  };
};

export type Connection = ConnectionRawMessage & {
  downloadSpeed: number;
  uploadSpeed: number;
};

export enum LOG_LEVEL {
  Info = "info",
  Error = "error",
  Warning = "warning",
  Debug = "debug",
  Silent = "silent",
}

export type Log = {
  type: LOG_LEVEL;
  payload: string;
};

export type LogWithSeq = Log & { seq: number };

export type Config = {
  mode: "direct" | "rule" | "global";
  // sing-box added
  "mode-list": string[];
  // sing-box-p added
  modes?: string[];
  port: number;
  "socks-port": number;
  "redir-port": number;
  "tproxy-port": number;
  "mixed-port": number;
  tun: {
    enable: boolean;
    device: string;
    stack: "Mixed" | "gVisor" | "System" | "LWIP";
    "dns-hijack": null;
    "auto-route": boolean;
    "auto-detect-interface": boolean;
    "file-descriptor": number;
  };
  "tuic-server": {
    enable: boolean;
    listen: string;
    certificate: string;
    "private-key": string;
  };
  "ss-config": string;
  "vmess-config": string;
  authentication: null;
  "allow-lan": boolean;
  "bind-address": string;
  "inbound-tfo": boolean;
  UnifiedDelay: boolean;
  "log-level": string;
  ipv6: boolean;
  "interface-name": string;
  "geodata-mode": boolean;
  "geodata-loader": string;
  "tcp-concurrent": boolean;
  "find-process-mode": string;
  sniffing: boolean;
  "global-client-fingerprint": boolean;
};

export type DNSQuery = {
  AD: boolean;
  CD: boolean;
  RA: boolean;
  RD: boolean;
  TC: boolean;
  status: number;
  Question: {
    Name: string;
    Qtype: number;
    Qclass: number;
  }[];
  Answer?: {
    TTL: number;
    data: string;
    name: string;
    type: number;
  }[];
};

export type BackendVersion = {
  meta: boolean;
  version: string;
};
