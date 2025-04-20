import * as v from "valibot";
import { PROXIES_ORDERING_TYPE } from "~/constants";
import type { ProxyGroup, ProxyProvider } from "~/typings";

export const proxySettingsSchema = v.object({
  autoCloseConns: v.boolean(),
  hideUnAvailableProxies: v.boolean(),
  urlForLatencyTest: v.pipe(v.string(), v.url()),
  latencyTestTimeoutDuration: v.pipe(v.number(), v.minValue(0)),
  renderInTwoColumns: v.boolean(),
  proxySorting: v.enum(PROXIES_ORDERING_TYPE),
});

export const proxySettingsInitialState: ProxySettingsSchema = {
  autoCloseConns: false,
  hideUnAvailableProxies: false,
  urlForLatencyTest: "",
  latencyTestTimeoutDuration: 5000,
  renderInTwoColumns: true,
  proxySorting: PROXIES_ORDERING_TYPE.NATURAL,
};

export type ProxySettingsSchema = v.InferOutput<typeof proxySettingsSchema>;

export const useProxy = createSharedComposable(() => {
  const { request } = useRequest();
  const proxySettingsStorage = useLocalStorage<ProxySettingsSchema>(
    "proxySettings",
    proxySettingsInitialState,
  );

  const asyncState = useAsyncState(
    async () => {
      const [{ providers }, { proxies }] = await Promise.all([
        request.value
          .get("providers/proxies")
          .json<{ providers: Record<string, ProxyProvider> }>(),
        request.value
          .get("proxies")
          .json<{ proxies: Record<string, ProxyGroup> }>(),
      ]);

      const proxiesWithTestUrl = Object.values(proxies).map((proxy) => {
        if (proxy.all?.length && !proxy.testUrl) {
          const { testUrl, timeout } = providers?.[proxy.name] || {};

          return { ...proxy, testUrl, timeout };
        }

        return proxy;
      });

      const sortIndex = [...(proxies["GLOBAL"].all ?? []), "GLOBAL"];
      const sortedProxyGroups = Object.values(proxiesWithTestUrl)
        .filter((proxy) => proxy.all?.length)
        .sort(
          (prev, next) =>
            sortIndex.indexOf(prev.name) - sortIndex.indexOf(next.name),
        );
      const sortedProviders = Object.values(providers).filter(
        (provider) =>
          provider.name !== "default" && provider.vehicleType !== "Compatible",
      );

      return {
        proxies: proxiesWithTestUrl,
        proxyGroups: sortedProxyGroups,
        proxyProviders: sortedProviders,
      };
    },
    {
      proxies: [],
      proxyGroups: [],
      proxyProviders: [],
    },
    { resetOnExecute: false },
  );

  const selectProxyInGroup = async ({
    groupName,
    proxyName,
  }: {
    groupName: string;
    proxyName: string;
  }) => {
    await request.value.put(`proxies/${encodeURIComponent(groupName)}`, {
      body: JSON.stringify({
        name: proxyName,
      }),
    });

    await asyncState.execute();

    console.log(proxySettingsStorage.value);

    if (proxySettingsStorage.value.autoCloseConns) {
      // await request.value.post("proxies/close");
    }
  };

  const proxyLatencyTest = async ({ proxyName }: { proxyName: string }) => {
    await request.value.get(`proxies/${encodeURIComponent(proxyName)}/delay`, {
      searchParams: {
        url: "https://www.gstatic.com/generate_204",
        timeout: 5000,
      },
    });

    await asyncState.execute();
  };

  return {
    asyncState,
    selectProxyInGroup,
    proxyLatencyTest,
    proxySettingsStorage,
  };
});
