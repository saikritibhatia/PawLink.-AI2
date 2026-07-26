const MAX_BYTES = 900 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Only fetch photos we host on Vercel Blob. Without this check the endpoint
 * would fetch any URL a caller handed it, which is a server-side request
 * forgery hole: someone could point it at an internal address and read the reply.
 */
function ours(url) {
  try {
    return new URL(url).host.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** An Anthropic image content block, or null if the photo is unusable. */
export async function imageBlock(url) {
  if (!url || !ours(url)) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const type = (res.headers.get("content-type") || "").split(";")[0].trim();
    if (!OK_TYPES.includes(type)) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) return null;

    return { type: "image", source: { type: "base64", media_type: type, data: buf.toString("base64") } };
  } catch (e) {
    console.error("photo fetch failed", e.message);
    return null;
  }
}
