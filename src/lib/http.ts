import { getClient, RequestOptions, ResponseType } from "@tauri-apps/api/http";

export async function _get<T>(url: string, options?: RequestOptions) {
  const client = await getClient();

  return client.get<T>(url, {
    responseType: ResponseType.JSON,
    ...options,
  });
}
export async function get<T>(url: string, options?: RequestOptions) {
  return _get<T>(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
    },
  });
}
