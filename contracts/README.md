# Contracts

Solidity (^0.8.24) contracts for the Solmate butler on Avalanche C-Chain (EVM).
Foundry is the build tool (`forge build`, `forge test`).

## Design

Two files, mapping one-to-one onto the README's execution book:

- **Mandate.sol** — the revocable envelope. Owned by the user. Holds allowed venues,
  per-venue and total caps, a daily-loss veto line, and an instant kill switch
  (`revoke()`). A bank or regulator can read exactly what the agent was permitted to do.
- **SolmateAccount.sol** — the thin per-user smart account. Emits a `RebalanceExecuted`
  receipt (from venue, to venue, amount, reason code, realized USD) on every move —
  that log is the credit artifact a lender can underwrite on. Signing is bound to
  **session keys** set by the owner, so a model prompt can never widen its own envelope:
  the only write path, `executeRebalance`, validates against the mandate first.

## Security posture

- Owner-only: venue configuration, session keys, pause, mandate revocation.
- Agent-only: `executeRebalance`, gated by `notPaused` + mandate validation.
- CRC / daily-loss line enforced in `Mandate.validateMove` before any move is signed.
- No external dependencies — safe to compile offline with `forge build`.

## Run

```bash
forge build    # compile (optimizer on, evm_version = cancun)
forge test     # run tests
```

Deploy via your framework of choice (Foundry script, Hardhat, or remix). One
`SolmateAccount` per user; default venues mirror the Butlers' adapters
(BENQI, Aave, LFJ, Pharaoh, Blackhole, Yield Yak, Avant).