import type { Config } from "~/typings";

export const useConfig = () => {
  const { request } = useRequest();

  const asyncState = useAsyncState(async () => {
    return await request.value.get("configs").json<Config>();
  }, {} as Config);

  return {
    asyncState,
  };
};
