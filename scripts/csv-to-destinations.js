#!/usr/bin/env node
/**
 * Converts vAirAsia "Airports" CSV (from vAMSYS export) to asset/data/destinations.json
 * for the Destinations map page. Resolves lat/lng from OurAirports data.
 *
 * Usage: node scripts/csv-to-destinations.js [path-to-airports.csv]
 *        If no path given, uses asset/data/airports.csv (copy your CSV there first).
 */

const fs = require('fs');
const path = require('path');

const OURAIRPORTS_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const OUTPUT_PATH = path.join(__dirname, '..', 'asset', 'data', 'destinations.json');
const DEFAULT_CSV = path.join(__dirname, '..', 'asset', 'data', 'airports.csv');

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === ',' && !inQuotes) || c === '\r') {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

function buildCoordLookup(csvText) {
  const lines = csvText.split('\n').filter(Boolean);
  const map = new Map(); // code (ICAO or IATA) -> { lat, lng }
  const header = lines[0].toLowerCase();
  const cols = header.includes('latitude_deg')
    ? { ident: 1, lat: 4, lng: 5, iata: 13 }
    : { ident: 0, lat: 6, lng: 7, iata: 4 }; // fallback for different format
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    if (parts.length < 8) continue;
    const ident = (parts[cols.ident] || '').trim();
    const iata = (parts[cols.iata] || '').trim();
    const lat = parseFloat(parts[cols.lat]);
    const lng = parseFloat(parts[cols.lng]);
    if (!ident || isNaN(lat) || isNaN(lng)) continue;
    map.set(ident, { lat, lng });
    if (iata && iata !== ident) map.set(iata, { lat, lng });
  }
  return map;
}

function parseOurAirportsCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const map = new Map();
  const headerRow = parseCsvLine(lines[0]);
  const idx = (name) => headerRow.findIndex((h) => h.replace(/^"|"$/g, '').toLowerCase() === name.toLowerCase());
  const iIdent = idx('ident') >= 0 ? idx('ident') : 1;
  const iLat = idx('latitude_deg') >= 0 ? idx('latitude_deg') : idx('latitude') >= 0 ? idx('latitude') : 4;
  const iLng = idx('longitude_deg') >= 0 ? idx('longitude_deg') : idx('longitude') >= 0 ? idx('longitude') : 5;
  const iIata = idx('iata_code') >= 0 ? idx('iata_code') : 13;
  const maxCol = Math.max(iIdent, iLat, iLng, iIata) + 1;
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    if (parts.length < maxCol) continue;
    const ident = (parts[iIdent] || '').trim().replace(/^"|"$/g, '');
    const iata = (parts[iIata] || '').trim().replace(/^"|"$/g, '');
    const lat = parseFloat(String(parts[iLat] || '').replace(/"/g, ''));
    const lng = parseFloat(String(parts[iLng] || '').replace(/"/g, ''));
    if (!ident || isNaN(lat) || isNaN(lng)) continue;
    map.set(ident, { lat, lng });
    if (iata && iata.length <= 4) map.set(iata, { lat, lng });
  }
  return map;
}

async function run() {
  const csvPath = process.argv[2] || DEFAULT_CSV;
  const csvAbs = path.isAbsolute(csvPath) ? csvPath : path.join(process.cwd(), csvPath);
  if (!fs.existsSync(csvAbs)) {
    console.error('CSV not found:', csvAbs);
    console.error('Usage: node scripts/csv-to-destinations.js [path-to-airports.csv]');
    process.exit(1);
  }
  const csvText = fs.readFileSync(csvAbs, 'utf8');
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    console.error('CSV has no data rows.');
    process.exit(1);
  }

  let coords = new Map();
  try {
    console.log('Fetching airport coordinates from OurAirports...');
    const oaText = await fetchText(OURAIRPORTS_URL);
    coords = parseOurAirportsCsv(oaText);
    console.log('Loaded', coords.size, 'airport coordinates.');
  } catch (e) {
    console.warn('Could not fetch OurAirports data:', e.message);
    console.warn('Output will use lat/lng 0,0 where unknown. You can edit asset/data/destinations.json later.');
  }

  const dests = [];
  let skipped = 0;
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    if (parts.length < 4) continue;
    const icao = (parts[0] || '').trim();
    const name = (parts[1] || '').trim();
    const base = (parts[3] || '').toUpperCase() === 'TRUE';
    if (!icao || !name) continue;
    const c = coords.get(icao) || (icao.length === 3 ? coords.get(icao) : null);
    const lat = c ? c.lat : 0;
    const lng = c ? c.lng : 0;
    if (!c) skipped++;
    dests.push({
      name: name.includes(icao) ? name : `${name} (${icao})`,
      lat,
      lng,
      type: base ? 'hub' : 'international',
    });
  }

  const asOf = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const out = { asOf, destinations: dests };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', dests.length, 'destinations to', OUTPUT_PATH);
  if (skipped) console.log('Missing coords for', skipped, 'airport(s). Edit destinations.json or add ICAO to OurAirports.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
