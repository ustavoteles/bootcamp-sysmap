import { API_URL } from "@env";

export function normalizeImageUrl(url: string): string {
  if (!url) return "";

  if (__DEV__) {
    const devUrl = API_URL.replace(/:\d+$/, "");
    let normalizedUrl = url.replace("localhost", devUrl);

    if (normalizedUrl.startsWith("http://http://")) {
      normalizedUrl = normalizedUrl.replace("http://http://", "http://");
    }

    return normalizedUrl;
  }

  return url;
}
