# Solmate

**A crypto butler on Avalanche**

Solmate is an authorized allocation agent for Avalanche. Fiat and stablecoin value that is sitting still — on M-Pesa, Airtel Money, in a bank balance, or idle USDC — goes to work earning yield inside a revocable mandate, and can come back to a phone, paybill, till, or bank when the user needs cash. Every move writes a verifiable receipt on-chain. That same ledger becomes a credit file a lender can actually respect.

## Description

Solmate is a rails-first agent. Most users do not start on-chain, so the front door is fiat. Coupled with the Pretium API, Solmate treats shillings as the point of entry: Pretium collects mobile money or bank fiat, converts it to USDC, and lands that USDC where the butler can allocate it on Avalanche. The same API reverses the path — harvested yield, a withdrawal, or loan proceeds off-ramp to a phone number, paybill, till, or bank. Crypto-native users can deposit USDC or AVAX directly and skip the ramp. In both cases the job is identical: fiat and stables are put to work so they earn instead of sleeping, then they can return to fiat when the user wants cash.

Three responsibilities share one book:

1. **An agent on the fiat rail.** Pretium is the collect-and-disburse API; Solmate is what happens after the USDC arrives — allocate, harvest, and send value back to the phone. Idle fiat becomes working USDC; working USDC can become fiat again.
2. **An authorized agent you can inspect.** Every allocation sits inside a revocable mandate: allowed venues, size caps, concentration limits, a kill switch. The unbanked user is not handing an unconstrained script their on-ramp, and the crypto user is not handing it an open wallet. A bank or regulator can inspect what the agent was allowed to do.
3. **A credit file.** Every rebalance writes where funds came from, where they went, how much, why, and what they returned. Fiat-in users and USDC-in users produce the same kind of footprint: verified earnings, not SMS metadata.

That split is deliberate. If credit is slow to land, Solmate still earns its keep as an allocation agent on a fiat on-ramp. If a mandate standard shifts, the rail and the yield book still run. No single story has to carry the whole product.

## Problem Statement

Productive capital in this market is stuck in the wrong form.

The unbanked and underbanked already hold value on M-Pesa, Airtel Money, or cash — but that balance does not earn and does not build a file a lender will respect. People who already hold USDC, USDT, or AVAX have the opposite problem: the yield exists, but it is scattered across lending, liquid staking, AMMs, vaults, and stable products, and operating it from a phone is unrealistic.

- **Fiat sitting still loses to inflation.**
- **Crypto sitting still loses to idle opportunity.**
- **A raw bot with an open wallet solves neither group**, because nobody can prove the agent was allowed to move that size into that venue.

What the user gets is bigger than a better APY number. An unbanked user can fund from M-Pesa, earn on USDC, and withdraw to the same phone without becoming a trader. A crypto user can park USDC or AVAX and stop farming by hand. Both can pause or revoke the agent, see each move on-chain, and walk toward a lender with a record instead of a story.

## The Solution

### The fiat rail — Pretium

Pretium is how the unbanked enter and exit:

- **On-ramp:** collect KES (or another supported currency) from M-Pesa, Airtel Money, or bank; release USDC/USDT to the user's Solmate address.
- **Off-ramp / disburse:** burn or send stables and pay a mobile number, paybill, till, or bank.
- **Webhooks:** confirmed collection, confirmed payout, failed STK, FX used.
- **Partner fee field:** Solmate can take its cut in fiat at the ramp instead of only on-chain.
- **Spend policies:** per-tx and daily caps on the Pretium side, mirrored by the on-chain mandate so the rail and the butler cannot disagree.

Pretium settles stables on networks such as Celo, Base, and BNB, while Solmate's book lives on Avalanche. The integration therefore includes a short bridge or settlement hop from the Pretium-credited stable to USDC on C-Chain; the butler then takes over. Cash-out reverses that hop before the Pretium payout call.

### The authorized agent — Gemini APIs

The agent layer is where Gemini sits:

- **Planner.** A Gemini call takes the mandate, balances, and a live market snapshot and returns a structured action — `hold`, `migrate`, `harvest`, or `unwind` — never a chat paragraph it might treat as a signature.
- **Explainer.** A second Gemini call writes a short, human-readable reason into the log, so users and lenders can read why funds moved.
- **Rules not model.** Risk limits are coded rules — caps, banned venues, concentration, and a daily loss line — that can veto a Gemini plan before anything is signed.
- **Router.** Turns an approved plan into transaction steps. It does not hold an unconstrained key.
- **Orchestration:** LangChain or CrewAI as the coordination layer; Gemini is the model those tools call. Keys stay in a KMS or HSM-backed signer. The model never holds an open wallet.

### The execution book — Avalanche C-Chain

- A thin Solmate account (safe-style module) per user stores the active mandate, accepted venues, and a pointer to the latest strategy.
- Rebalance events emit as logs: from venue, to venue, amount, reason code, realized result. That log is the credit artifact.
- No new AMM. Liquidity stays in protocols that already exist, behind adapters: **BENQI** (lending + sAVAX liquid staking, the idle default), **Aave** (blue-chip supply/withdraw), **LFJ, Pharaoh, Blackhole** (DEX/AMM liquidity for balanced strategies), **Yield Yak** (vault deposit so compounding is one transaction), **Avant** (USDC/avUSD park when risk-off).
- Oracles (Chainlink or venue-native) feed prices and rates so the planner is not guessing from a screenshot.

### The credit artifact

An indexer (The Graph or a small C-Chain listener) stores rebalance receipts for the app and the credit export. A snapshot job turns 30 days of activity into a payload: net yield, drawdown, number of successful settles, mandate hash — a verifyable earnings record a lender can underwrite on. The success fee on a disbursed loan is the upside, not the only reason the product exists.

## Project Structure

```
solmate/                              # Monorepo root — landing page + the Butler
├── app/                              # Next.js app (App Router)
│   ├── layout.tsx
│   ├── page.tsx                      # Landing page: sections composed here
│   └── globals.css                   # Tailwind v4 theme — brand colors + keyframes
├── components/
│   ├── solmate/                      # Landing sections
│   │   ├── Navbar.tsx                # Nav with AGENT → http://localhost:3001
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Opportunity.tsx
│   │   ├── Protocols.tsx             # Animated protocol network
│   │   ├── LogoMark.tsx
│   │   └── AnimatedFlywheel.tsx
│   └── ui/                           # shadcn/ui primitives
├── hooks/                            # React hooks (MiniPay/Celo removed)
├── lib/
├── styles/
├── public/
│   └── assets/                       # logo.png, cm.png, yield.png, image.jpg, hero-video.mp4
├── scripts/                          # Dev tooling (auto-commits.sh)
├── contracts/                        # Avalanche C-Chain contracts (Solidity, Foundry)
│   ├── src/
│   │   ├── Mandate.sol               # Revocable envelope: venues, caps, kill switch
│   │   └── SolmateAccount.sol        # Thin per-user account; emits rebalance receipts
│   └── foundry.toml
├── solmate-interface/                # The Butler — the agent UI + backend
│   ├── server.js                     # Express API: GET /api/rates, POST /api/rebalance
│   ├── public/
│   │   ├── index.html                # Butler UI (dark/green brand palette, wallet connect)
│   │   └── logo.png
│   ├── src/
│   │   ├── butlerBackend.ts          # Rate fetching (Aave/BENQI) + rebalance routing
│   │   ├── testRates.ts / testRouting.ts / testWallet.ts
│   │   └── index.ts
│   ├── dist/                         # Compiled backend (tsc output, committed)
│   ├── package.json
│   └── tsconfig.json
├── package.json                      # Next.js app (pnpm)
└── netlify.toml
```

## Architecture

Three layers, stacked the same way as the product story: a fiat rail, an authorized agent, an Avalanche execution book.

```
                         ┌──────────────────────────────────────────────┐
                         │                  USER                        │
                         │  wallet user (AVAX/USDC)  ·  phone user (KES)│
                         └──────────────┬───────────────────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────────┐
              │                    FRONTEND                           │
              │        Next.js landing · Butler web app (phone wrap)  │
              │        mandate setup · deposit · pause · activity log │
              └──────────────┬──────────────────────────┬─────────────┘
                             │                          │
                    phone number /            wallet connect
                    amount (no seed phrase)    (AVAX / USDC)
                             │                          │
                             ▼                          ▼
              ┌──────────────┴──────────────┐   ┌────────────────────────┐
              │     PRETIUM (fiat rail)     │   │   AVALANCHE C-CHAIN    │
              │  collect M-Pesa/Airtel/bank │   │  Solmate account module│
              │  → USDC  ·  USDC → phone/   │   │  active mandate · caps │
              │  paybill/till/bank          │   │  rebalance receipts    │
              │  webhooks · FX · fee        │   │                        │
              └──────────────┬──────────────┘   └───────────┬────────────┘
                             │  short bridge/hop            │ adapters
                             ▼                              ▼
              ┌─────────────────────────────────────────────────────────┐
              │                  AGENT (policy layer)                   │
              │  Planner (Gemini): hold / migrate / harvest / unwind    │
              │  Explainer (Gemini): human-readable reason in the log   │
              │  Risk (rules-first): caps · banned list · daily loss    │
              │  Router: emits txn steps — no unconstrained key         │
              │  Orchestration: LangChain / CrewAI · KMS/HSM signer     │
              └──────────────────────────────┬──────────────────────────┘
                                             ▼
              ┌─────────────────────────────────────────────────────────┐
              │                    AVALANCHE VENUES                     │
              │ BENQI · sAVAX · Aave · LFJ · Pharaoh · Blackhole        │
              │ Yield Yak · Avant   (Chainlink-class oracles feed rates)│
              └──────────────────────────────┬──────────────────────────┘
                                             ▼
              ┌─────────────────────────────────────────────────────────┐
              │     INDEXER → app log · credit export (PS06 payload)    │
              │     alerts: Telegram / WhatsApp                          │
              └─────────────────────────────────────────────────────────┘
```

**How a deposit travels**

```
FIAT USER   phone → Pretium on-ramp → USDC → (bridge if needed)
             → Avalanche USDC → mandate check → adapter deposit (BENQI / Aave)
CRYPTO USER wallet USDC/AVAX → mandate check → same adapters
WITHDRAWAL  adapter exit → USDC → Pretium off-ramp → M-Pesa
             (or straight to the wallet, staying on-chain)
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, TypeScript |
| Agent UI | Vanilla HTML/CSS/JS Express app (`solmate-interface`) |
| Wallet | Core (Avalanche-native), MetaMask fallback (C-Chain) via injected EIP-1193 |
| Agent / AI | Gemini APIs (planner + explainer), LangChain or CrewAI orchestration |
| Fiat rail | Pretium Payment API (on-ramp, pay/disburse, webhooks, FX, partner fee) |
| Blockchain | Avalanche C-Chain (EVM), Solidity 0.8.24 (Foundry), thin Solmate account / safe-style module, session keys |
| Identity | W3C DIDs + Verifiable Credentials (Know Your Agent mandate shape) |
| DeFi adapters | BENQI, sAVAX, Aave, LFJ, Pharaoh, Blackhole, Yield Yak, Avant |
| Oracles | Chainlink-class / venue-native price and rate feeds |
| Indexing | The Graph or lightweight C-Chain listener; 30-day credit snapshot |
| Backend (current) | Express, viem/wagmi (rates + rebalance routing) |
| Alerts | Telegram / WhatsApp |
| Signing | KMS or HSM-backed signer above retail thresholds |

## What's Built Today

- **Landing page** (Next.js) — Avalanche-branded, animated protocol network, dark/green palette, docs link.
- **The Butler** (Express + `index.html`) — live BENQI/Aave market rates with trends, portfolio panel, simulated rebalance proposals with execute/not-now actions, and a pill-shaped **Connect Wallet** button (Core or MetaMask).
- **Navbar AGENT link** — points to the running Butler at `http://localhost:3001`.

Pretium, the Gemini planner, on-chain mandates, and the indexer are the next milestones on this structure.

## Running the Project

### 1. Landing page (root)

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server → http://localhost:3000
```

Production build and preview:

```bash
pnpm build            # production build
pnpm start            # serve production build → http://localhost:3000
pnpm lint             # lint the workspace
```

### 2. The Butler (agent interface)

```bash
cd solmate-interface
npm install           # install dependencies (viem, wagmi, express, cors, tsx)
npm run build         # compile TypeScript → dist/ (tsc)
npm start             # start Express server → http://localhost:3001
```

Development with auto-compile-then-run:

```bash
npm run dev           # tsc && node server.js
```

Utility scripts:

```bash
npm run test-rates    # fetch live Aave/BENQI rates
npm run test-routing  # run rebalance routing decisions
npm run test-wallet   # wallet / viem smoke tests
```

> Ports: the landing page serves on **3000**, the Butler on **3001**. The nav's AGENT link targets `localhost:3001`. Add your Pretium API keys, Gemini API key, and signing material to environment variables before wiring live rails.

## License

MIT