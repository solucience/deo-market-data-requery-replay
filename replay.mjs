import assert from "node:assert/strict";

// Fixed synthetic inputs; no feeds are called and no orders are placed.
const input = {
  "decision_time": "2026-11-24T12:00:00Z",
  "max_age_seconds": 90,
  "snapshots": [
    {
      "source": "feed-a",
      "chain_id": "demo:chain-a",
      "asset_id": "demo:asset-a",
      "quote_unit": "USD",
      "metric": "spot_mid",
      "observed_at": "2026-11-24T11:59:50Z"
    },
    {
      "source": "feed-b",
      "chain_id": "demo:chain-a",
      "asset_id": "demo:asset-a",
      "quote_unit": "USD",
      "metric": "spot_mid",
      "observed_at": "2026-11-24T11:52:00Z"
    }
  ]
};
const expected = {
  "full_refresh_sources": [
    "feed-a",
    "feed-b"
  ],
  "targeted_refresh_sources": [
    "feed-b"
  ],
  "planned_full_refresh_calls": 2,
  "planned_targeted_refresh_calls": 1,
  "planned_calls_avoided": 1
};

const [a, b] = input.snapshots;
for (const field of ["chain_id", "asset_id", "quote_unit", "metric"]) {
  assert.equal(a[field], b[field], "Do not refresh for comparison if identities or metrics disagree");
}

const referenceTime = Date.parse(input.decision_time);
const targeted = input.snapshots.filter(({ observed_at }) => {
  const ageMs = observed_at === null ? NaN : referenceTime - Date.parse(observed_at);
  return !Number.isFinite(ageMs) || ageMs < 0 || ageMs > input.max_age_seconds * 1000;
}).map(({ source }) => source);

// The comparison baseline refreshes every source if any source needs a refresh.
const all = targeted.length ? input.snapshots.map(({ source }) => source) : [];
const actual = {
  full_refresh_sources: all,
  targeted_refresh_sources: targeted,
  planned_full_refresh_calls: all.length,
  planned_targeted_refresh_calls: targeted.length,
  planned_calls_avoided: all.length - targeted.length
};

assert.deepEqual(actual, expected);
console.log(JSON.stringify(actual, null, 2));
