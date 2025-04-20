import type { Rule, RuleProvider } from "~/typings";

export const useRule = createSharedComposable(() => {
  const { request } = useRequest();

  const asyncState = useAsyncState(
    async () => {
      const [{ rules }, { providers }] = await Promise.all([
        request.value.get<{ rules: Record<string, Rule> }>("rules").json(),
        request.value
          .get<{ providers: Record<string, RuleProvider> }>("providers/rules")
          .json(),
      ]);

      return {
        rules: Object.values(rules),
        ruleProviders: Object.values(providers),
      };
    },
    {
      rules: [],
      ruleProviders: [],
    },
    { resetOnExecute: false },
  );

  const updateAllRuleProvider = async () => {
    await Promise.all(
      asyncState.state.value.ruleProviders.map((provider) =>
        request.value.put(
          `providers/rules/${encodeURIComponent(provider.name)}`,
        ),
      ),
    );
    await asyncState.execute();
  };

  const updateRuleProvider = async (providerName: string) => {
    await request.value.put(
      `providers/rules/${encodeURIComponent(providerName)}`,
    );
    await asyncState.execute();
  };

  return {
    asyncState,
    updateAllRuleProvider,
    updateRuleProvider,
  };
});
