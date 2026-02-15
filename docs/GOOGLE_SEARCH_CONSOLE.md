# Google Search Console setup (vAirAsia)

This doc explains how to verify the site in Google Search Console and how the site is tuned so **real AirAsia** keeps showing for real-flight searches and **vAirAsia** shows for virtual-airline searches.

---

## 1. Verify the site in Search Console

### Domain property (recommended) — you used this and it’s detected

1. In Search Console, choose **Domain** and enter your domain (e.g. `vairasia.com`).
2. Google gives you a **DNS TXT record** to add at your domain registrar (or Cloudflare, etc.).
3. Add that TXT record to your DNS; Google will detect it and verify the domain.
4. **Done.** This covers all URLs on the domain (http, https, www, non-www). No HTML tag needed.

### URL prefix (alternative)

If you add a **URL prefix** property instead (e.g. `https://vairasia.com`), you can verify with the **HTML tag**: paste the code from Search Console into the `<meta name="google-site-verification" content="">` in **`index.html`**, then deploy and click Verify.

---

## 2. Submit the sitemap

1. In Search Console, open your property.
2. Go to **Sitemaps** (left menu).
3. Under “Add a new sitemap”, enter: `sitemap.xml`
4. Click **Submit**.

If your site is **not** at `https://vairasia.com`, update the URLs in **`sitemap.xml`** and **`robots.txt`** to your real domain before submitting.

---

## 3. How we stay separate from real AirAsia (no confusion, no lawsuits)

We **cannot** tell Google “don’t rank us for airasia”. We **can** make the site clearly about **virtual** aviation so:

- Queries like **“airasia”**, **“airasia flights”**, **“airasia to Kinabalu”** → Google keeps showing the **real** AirAsia (airasia.com, booking, etc.).
- Queries like **“vairasia”**, **“virtual airasia”**, **“vatsim airasia”**, **“airasia virtual”**, **“airasia va”**, **“airasia ivao”** → Google is more likely to show **this** site.

What we did:

| What we did | Why it helps |
|-------------|----------------|
| **Title & meta description** | Every page says “virtual airline”, “VATSIM”, “IVAO”, “flight sim”, “not real flights”. So search snippets are clearly virtual. |
| **Meta keywords** | We target terms like “vairasia, virtual airasia, vatsim airasia, airasia va, airasia ivao”. We do **not** target “airasia flights”, “airasia booking”, “airasia Kinabalu”. |
| **Open Graph** | When the site is shared, it says “Virtual Airline \| VATSIM & IVAO” and “Not real flights.” |
| **Footer disclaimer** | “vAirAsia is a virtual airline… not affiliated with any AirAsia Group… No real-world flight services.” |

So:

- **Real AirAsia** stays dominant for real travel (flights, bookings, destinations).
- **vAirAsia** is positioned for virtual / sim / VATSIM / IVAO / VA searches.

You’re not competing for “airasia flights” or “airasia to Kinabalu”; you’re aiming at “virtual airasia” and “vairasia” type queries. That keeps the brand separation clear and reduces legal risk.

---

## 4. Optional: check indexing

After verification and sitemap submission:

- Use **URL Inspection** in Search Console to request indexing of `https://yoursite.com/`.
- In **Coverage** / **Pages**, you can see which URLs are indexed over time.

If the site is new, it can take a few days to a few weeks for new or updated pages to appear in search.
