# Visitor globe

The footer globe is a custom, locally served Cobe 2.0.1 visualization inspired
by https://github.com/Selenium39/umami-maps. Its country coordinate table is
served locally under the upstream MIT license, alongside the vendored Cobe
license. The separate `visitor-globe-service` backend validates country codes.
The vendored renderer has one local fix: redraw after the embedded land-map
texture loads, so a paused or reduced-motion globe still shows continents.

The globe works before statistics are connected, showing the world map and
an explicit disconnected status. It does not invent visits. All markers
come from aggregate visitor data; there is no owner location or personal
landmark. Controls support rotation, resetting the view, country focus,
dragging, arrow keys, and reduced motion. Rendering pauses outside the
viewport or while the tab is hidden. The renderer loads only when the widget
approaches view.

The public API returns only countries and visit counts. Totals, approximate
country coordinates, and dot brightness are derived in the frontend. Brighter
dots represent more visits, on a logarithmic scale relative to the busiest
country. A visible dim-to-bright legend explains the density encoding.

## Enable real statistics

1. Deploy the sibling `visitor-globe-service` using its saved Sites project.
2. Make that backend accessible to anonymous visitors, with the owner's
   explicit request to change its audience. GitHub Pages cannot access an
   owner-private Sites endpoint.
3. Set `visitor_globe.endpoint` in `_config.yml` to the published backend's
   full `/api/visitor-globe` URL, rebuild, and publish GitHub Pages.

The frontend POSTs to the sibling `/api/visit` route and refreshes aggregate
counts every minute. Tracking is enabled only on
`itheresaapocalypse.github.io`; localhost previews only read data. DNT/GPC
opt-out signals disable recording but allow the globe to be viewed.

## Counting rules

“Visits” means browsing sessions, not pageviews or unique people. A random
session ID lives in sessionStorage. Reloads in the same tab reuse it for
30 minutes after the last recorded navigation. A new tab or a navigation
after 30 minutes creates another visit. The backend hashes the ID and uses
a unique database key, so concurrent retries cannot inflate a session.
Blocking browser storage can cause reloads to count separately.

Country/region is derived from Cloudflare's server-side GeoIP, never from
browser-submitted coordinates. Unknown locations count toward visits but
do not produce a globe dot. All country dots are approximate centroids,
not actual visitor addresses. All-time counts begin at activation and cannot
recover traffic from before installation. Internal session dates use
Asia/Shanghai and are never included in the public API.

Known bots and opted-out browsers are skipped. Public counters are approximate:
ad blockers can hide visits, and Origin checks are not complete bot protection.
Only anonymous aggregate country counts are returned to browsers. No API
keys, IP addresses, location lookups, or Umami credentials are sent by the
homepage. Cloudflare and Sites still process requests to host the service.
