# Destination map data

The **Destinations** page loads routes from `destinations.json` so the map matches your vAMSYS vAirAsia network.

## Format of `destinations.json`

```json
{
  "asOf": "30 September 2025",
  "destinations": [
    {
      "name": "Kuala Lumpur (WMKK)",
      "lat": 2.7456,
      "lng": 101.7099,
      "type": "hub"
    },
    {
      "name": "Singapore (WSSS)",
      "lat": 1.3644,
      "lng": 103.9915,
      "type": "international"
    }
  ]
}
```

- **name** – Display name (e.g. city and ICAO).
- **lat**, **lng** – Latitude and longitude (decimal degrees).
- **type** – `"hub"` (operation hubs), `"international"` or `"domestic"`.
- **asOf** – Optional; shown as “As of …” on the map.

## Syncing with vAMSYS vAirAsia

### Option A: From vAirAsia Airports CSV (recommended)

If you export **Airports** from vAMSYS as CSV (e.g. “vAirAsia Import CSV - Airports.csv”):

1. Run the converter script (Node.js 18+):
   ```bash
   node scripts/csv-to-destinations.js "path\to\vAirAsia Import CSV - Airports.csv"
   ```
   Or copy the CSV to `asset/data/airports.csv` and run:
   ```bash
   node scripts/csv-to-destinations.js
   ```
2. The script fetches coordinates from OurAirports and writes `asset/data/destinations.json`. Bases from the CSV become **hubs**; all others are **international**.

### Option B: Manual

1. In vAMSYS, get the list of airports you operate.
2. For each destination, add an object with `name`, `lat`, `lng`, and `type`.
3. Save as `asset/data/destinations.json`. The Destinations page will load it automatically.

You can look up airport coordinates from [airport-data.com](https://www.airport-data.com/), OurAirports, or similar.
