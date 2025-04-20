import { z } from "zod";

export const COOKIE_STORAGE_KEY_ENDPOINT_URL =
  "open-clashui:endpointUrl" as const;
export const COOKIE_STORAGE_KEY_SECRET = "open-clashui:secret" as const;

export enum PROXIES_ORDERING_TYPE {
  NATURAL = "orderNatural",
  LATENCY_ASC = "orderLatency_asc",
  LATENCY_DESC = "orderLatency_desc",
  NAME_ASC = "orderName_asc",
  NAME_DESC = "orderName_desc",
}

export enum CONNECTIONS_TABLE_ACCESSOR_KEY {
  Details = "details",
  Close = "close",
  ID = "ID",
  Type = "type",
  Process = "process",
  Host = "host",
  SniffHost = "sniffHost",
  Rule = "rule",
  Chains = "chains",
  DlSpeed = "dlSpeed",
  UlSpeed = "ulSpeed",
  Download = "dl",
  Upload = "ul",
  ConnectTime = "connectTime",
  SourceIP = "sourceIP",
  SourcePort = "sourcePort",
  Destination = "destination",
  InboundUser = "inboundUser",
}

export const CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER = Object.values(
  CONNECTIONS_TABLE_ACCESSOR_KEY,
);

export const CONNECTIONS_TABLE_INITIAL_COLUMN_VISIBILITY = {
  ...Object.fromEntries(
    CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER.map((i) => [i, false]),
  ),
  [CONNECTIONS_TABLE_ACCESSOR_KEY.Details]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.Close]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.Host]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.Rule]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.Chains]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.DlSpeed]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.UlSpeed]: true,
  [CONNECTIONS_TABLE_ACCESSOR_KEY.SourceIP]: true,
} as Record<CONNECTIONS_TABLE_ACCESSOR_KEY, boolean>;

export enum LOG_LEVEL {
  Info = "info",
  Error = "error",
  Warning = "warning",
  Debug = "debug",
  Silent = "silent",
}

export const modeTypeSchema = z.enum(["direct", "rule", "global"]);
export const tunStackTypeSchema = z.enum(["Mixed", "gVisor", "System", "LWIP"]);
export const portSchema = z.number().min(0).max(65535);

export const configSchema = z.object({
  port: portSchema,
  "socks-port": portSchema,
  "redir-port": portSchema,
  "tproxy-port": portSchema,
  "mixed-port": portSchema,
  mode: modeTypeSchema,
  "allow-lan": z.boolean(),
  "interface-name": z.string(),
  tun: z.object({
    enable: z.boolean(),
    stack: tunStackTypeSchema,
    device: z.string(),
  }),
});
