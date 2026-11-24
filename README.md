# Refresh only the stale market data feed

This standalone DEO example compares refreshing both market data feeds with refreshing only the stale one. It uses the same fixed synthetic snapshots for both approaches: Feed A is 10 seconds old, Feed B is 8 minutes old, and the caller's limit is 90 seconds.

## Reproduce offline

With Node.js 18 or newer, run this command from the example directory:

```sh
node replay.mjs
```

The script checks its output and exits with a nonzero status on a mismatch. The bundled `input.json` and `expected.json` expose the exact embedded input and expected output separately for inspection. No dependencies, network access, API key, account, or wallet are needed.

| Compared approach | Planned requests | Sources to refresh |
| --- | ---: | --- |
| Refresh both if any source is stale | 2 | `feed-a`, `feed-b` |
| Check `observed_at` and refresh only stale sources | 1 | `feed-b` |

This is one avoided **planned** request in one fixed example. It is not a live latency, fee, trading, or accuracy measurement. Do not use this example as a market data source or as permission to place a trade. Source identity and quote observation time are different from a matching ticker symbol or HTTP response time.

- [Market Data Checkpoint: Which feed should I refresh?](https://agentdecisiongate.com/workflows/market-data-checkpoint#stale-feed)
- [Free input and decision as JSON](https://agentdecisiongate.com/v1/workflows/market-data-checkpoint/examples/one_stale_source)

Developed with OpenAI Codex in the Dynamic Equilibrium Operation (DEO) project. [DEOMATH.ORG](https://deomath.org/)
