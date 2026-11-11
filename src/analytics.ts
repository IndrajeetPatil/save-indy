// Google Analytics, as on every page of www.indrapatil.com (see its privacy
// notice at https://www.indrapatil.com/privacy/). The tag loads from this
// same-origin module rather than an inline script, so the Content Security
// Policy stays free of 'unsafe-inline'. Local runs and tests load nothing.
const MEASUREMENT_ID = "G-3BQ49J7KYH";
const TAG_URL = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Load Google Analytics unless the page runs on a local host.
 * @param root Document to add the tag to.
 * @param hostname Host the page is served from.
 * @param target Global object that holds gtag.js's `dataLayer` queue.
 * @returns Whether the tag was added.
 */
function startAnalytics(
  root: Document,
  hostname: string,
  target: object,
): boolean {
  if (LOCAL_HOSTS.has(hostname)) {
    return false;
  }
  const script = root.createElement("script");
  script.src = TAG_URL;
  script.async = true;
  root.head.append(script);

  // Keep commands another script may already have queued.
  const existing: unknown = Reflect.get(target, "dataLayer");
  const queue: unknown[] = Array.isArray(existing) ? existing : [];
  Reflect.set(target, "dataLayer", queue);
  // Gtag.js only processes `arguments` objects, never plain arrays, so the
  // queued commands cannot use rest parameters.
  function gtag(..._command: unknown[]): void {
    // oxlint-disable-next-line prefer-rest-params
    queue.push(arguments);
  }
  gtag("js", new Date());
  // The site is served over HTTPS only, so scope the _ga cookies to secure
  // transport and same-site requests.
  gtag("config", MEASUREMENT_ID, { cookie_flags: "SameSite=Lax;Secure" });
  return true;
}

export { startAnalytics };
