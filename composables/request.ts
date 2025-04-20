import ky, { type Options as KyOptions } from "ky";

export const useRequest = createSharedComposable(() => {
  const request = ref(ky.create());
  const endpointUrl = ref("");
  const wsUrl = ref("");

  const setup = (options: KyOptions) => {
    request.value = request.value.extend(options);

    if (options.prefixUrl) {
      const url = options.prefixUrl.toString();
      endpointUrl.value = url;
      wsUrl.value = url.replace("http", "ws");
    }
  };

  return {
    request,
    endpointUrl,
    wsUrl,
    setup,
  };
});
