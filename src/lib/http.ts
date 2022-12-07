import { getClient, RequestOptions, ResponseType } from "@tauri-apps/api/http";

export async function _get<T>(url: string, options?: RequestOptions) {
  const client = await getClient();

  return client.get<T>(url, {
    responseType: ResponseType.JSON,
    ...options,
  });
}
export async function get<T>(url: string, options?: RequestOptions) {
  const invoke = (await import("@tauri-apps/api")).invoke;
  const token = await invoke("get_token");

  return _get<T>(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
