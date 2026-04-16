/**
 * TvssService - TVSS module for geoblocking and token auth
 *
 * Replicates the TVSS module from the Broadcast SDK web (broadcast-sdk.js).
 *
 * SDK reference (module at index 268769):
 *
 *   getGeoblockingStatus(tvssDomain)
 *     → GET {tvssDomain}/{v1|v2}/geoblocking/validate
 *     Used for regular live streams (non-UID based)
 *
 *   verifyAuth(tvssDomain)
 *     → GET {tvssDomain}/verify-auth
 *     Used for UID-based live streams ← used by this app (NPLUS_FORO_UID, NPLUS_UID, etc.)
 *
 * From the SDK source:
 *   verifyAuth(e) {
 *     var t = e.startsWith("http") ? "" : "https://";
 *     var a = new Request(t + e + "/verify-auth");
 *     return n.ZP.request(a);
 *   }
 */

/**
 * Verifies geoblock status via IP using the TVSS endpoint.
 * Identical to verifyAuth(tvssDomain) in the Broadcast SDK web.
 *
 * @param tvssDomain - TVSS domain from signal response (e.g. "notusaauth.univision.com")
 * @returns true = blocked (user is in restricted region), false = allowed
 */
export const verifyAuth = async (tvssDomain: string): Promise<boolean> => {
  if (!tvssDomain) return false;

  // SDK guard: prepend https:// only if the domain doesn't already start with http
  const prefix = tvssDomain.startsWith('http') ? '' : 'https://';
  const url = `${prefix}${tvssDomain}/verify-auth`;

  try {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      return true; // fail-safe: block if server rejects
    }

    const authorized = await response.json(); // `true` = allowed, `false` = blocked
    return !authorized; // invert: authorized=true → blocked=false
  } catch {
    // SDK web behavior: any error (network, timeout, etc.) rejects the Promise
    // and triggers the GeoblockWarning poster — same behavior here.
    return true; // treat error as blocked, same as SDK
  }
};
