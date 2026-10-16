const origin = "https://wafulock.cn";
const key = "182786d4efc5cfb0046975275ca7df58";
const keyLocation = `${origin}/${key}.txt`;

const keyResponse = await fetch(keyLocation);
if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) {
  throw new Error(`IndexNow key file is not available at ${keyLocation}. Deploy the site and retry.`);
}

const submitted = process.argv.slice(2);
let candidates = submitted;
if (candidates.length === 0) {
  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    throw new Error(`Could not load the live sitemap: HTTP ${sitemapResponse.status}.`);
  }
  const sitemap = await sitemapResponse.text();
  candidates = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, "&"));
}
const urls = [...new Set(candidates.map((value) => new URL(value, origin).href))];

for (const value of urls) {
  const url = new URL(value);
  if (url.origin !== origin) {
    throw new Error(`Only ${origin} URLs can be submitted: ${value}`);
  }
}

if (urls.length === 0) {
  throw new Error("No URLs found to submit.");
}

if (urls.length > 10000) {
  throw new Error(`IndexNow accepts at most 10,000 URLs per request; found ${urls.length}.`);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "wafulock.cn", key, keyLocation, urlList: urls }),
});

if (!response.ok) {
  const details = await response.text();
  throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${details}`);
}

console.log(`IndexNow accepted ${urls.length} URL${urls.length === 1 ? "" : "s"} (HTTP ${response.status}).`);
