/**
 * THE BUTLER - Backend Integration Layer
 *
 * AUTONOMOUS YIELD ROUTING FOR AVALANCHE LENDING MARKETS
 *
 * ✅ OFFICIAL API INTEGRATIONS (Phase 2: On-chain as primary)
 *
 * 1. Aave V3 Avalanche:
 *    - Pool Address: 0x794a61358D6845594F94dc1DB02A252b5b4814aD
 *    - Native USDC: 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
 *    - Status: ✅ VERIFIED - Official Aave infrastructure
 *    - Source: aave.com/docs + @bgd-labs/aave-address-book
 *    - ⚠️ IMPLEMENTATION: On-chain reserve data (Phase 2)
 *
 * 2. BENQI Core Markets:
 *    - qiUSDCn (Native): 0xB715808a78F6041E46d61Cb123C9B4A27056AE9C
 *    - Status: ✅ VERIFIED - Official BENQI docs
 *    - Source: docs.benqi.fi
 *    - ⚠️ IMPLEMENTATION: On-chain supplyRatePerTimestamp (Phase 2)
 *
 * 3. Data Fallback (Phase 2: Secondary UI-only):
 *    - DefiLlama API: https://yields.llama.fi/pools
 *    - Status: ✅ Reliable aggregator for UI display
 *    - ⚠️ USAGE: Secondary only - on-chain data is source of truth
 *
 * ⚠️ PHASE 2 EXECUTION SAFETY
 *
 * - Fuji testnet first (Aave V3 only)
 * - Session lock: one rebalance at a time
 * - Per-tx cap: 100 USDC
 * - Daily cap and router whitelist
 * - Simulate before execute
 * - No infinite approvals
 *
 * RPC ENDPOINTS:
 * - Mainnet: https://api.avax.network/ext/bc/C/rpc
 * - Fuji Testnet: https://api.avax-test.network/ext/bc/C/rpc
 */
export interface RateData {
    protocol: 'aave' | 'benqi' | 'traderjoe';
    market: string;
    apy: number;
    tvl: number;
    timestamp: number;
}
export interface RebalanceProposal {
    fromProtocol: string;
    toProtocol: string;
    apyDelta: number;
    estMonthlyGain: number;
    estGasCost: number;
    gasBufferUSD: number;
    wouldExecute: boolean;
    wouldBreakEven: boolean;
    breakEvenDays: number;
    periodGain: number;
}
export interface RebalanceReceipt {
    txHash: string;
    status: 'success' | 'failed';
    timestamp: number;
}
export interface WalletBalances {
    usdc: bigint;
    aUSDC: bigint;
    qiUSDC: bigint;
    currentVenue: 'aave' | 'benqi' | null;
}
export interface SimulationResult {
    canExecute: boolean;
    steps: SimulationStep[];
    estimatedGas: bigint;
    estimatedGasUSD: number;
    error?: string;
}
export interface SimulationStep {
    type: 'withdraw' | 'approve' | 'supply';
    protocol: string;
    calldata: string;
    estimatedGas: bigint;
}
/**
 * A previewed, ready-to-execute rebalance intent (Phase 2.2).
 * The chat shows this to the user ("Move X USDC, +Y% APY, ~$Z gas. Confirm?")
 * and only executes after explicit confirmation that this exact intent is
 * still valid (rates/gas re-checked at execution time).
 */
export interface RebalanceIntent {
    id: string;
    fromProtocol: string;
    toProtocol: string;
    amount: number;
    apyDelta: number;
    estMonthlyGain: number;
    estGasUSD: number;
    status: 'preview';
    createdAt: number;
    steps: SimulationStep[];
}
/**
 * Get wallet balances and current position
 * @param address - Wallet address
 * @param useTestnet - Whether to use testnet
 * @returns Wallet balances and current venue
 */
export declare function getWalletBalances(address: `0x${string}`, useTestnet?: boolean): Promise<WalletBalances>;
/**
 * Simulate a rebalance operation without executing it
 * @param proposal - Rebalance proposal from decideRebalance
 * @param amount - Amount to rebalance in USDC
 * @param userAddress - User's wallet address
 * @param useTestnet - Whether to use testnet
 * @returns Simulation result with steps and gas estimates
 */
export declare function simulateRebalance(proposal: RebalanceProposal, amount: number, userAddress: `0x${string}`, useTestnet?: boolean): Promise<SimulationResult>;
/**
 * Fetch current rates from all supported lending markets
 * @param useTestnet - Whether to use testnet (Fuji) or mainnet. Defaults to false (mainnet).
 *                    Note: BENQI is mainnet-only, and Aave Fuji testnet status is uncertain.
 *                    fetchRates() is read-only and safe to run on mainnet.
 * @returns Array of normalized rate data
 */
export declare function fetchRates(useTestnet?: boolean): Promise<RateData[]>;
/**
 * Decide whether to rebalance based on current position and available rates
 * @param currentPosition - Current protocol and amount
 * @param rates - Array of available rates
 * @param riskTier - User's risk tolerance (conservative, moderate, aggressive)
 * @param daysHeld - Number of days position will be held (default 30)
 * @param gasCostUSD - Estimated gas cost in USD (default 0.02)
 * @returns Rebalance proposal or null
 */
export declare function decideRebalance(currentPosition: {
    protocol: string;
    amount: number;
}, rates: RateData[], riskTier?: 'conservative' | 'moderate' | 'aggressive', daysHeld?: number, gasCostUSD?: number): RebalanceProposal | null;
/**
 * Build a previewable rebalance intent (Phase 2.2). Pure and read-only.
 *
 * Runs decideRebalance against live on-chain rates, then estimates gas for the
 * withdraw -> approve -> supply sequence so the chat can show a confirm prompt
 * ("Move 1,000 USDC BENQI → Aave, +3.1% APY, ~$0.04 gas. Confirm?") before any
 * write is issued.
 *
 * The returned intent carries a deterministic id; execution must be gated on
 * the user confirming this exact id AND a fresh rate/gas re-check.
 *
 * @param currentPosition - Current venue and idle USDC amount
 * @param useTestnet - Whether to use testnet
 * @param userAddress - Owner address (for gas estimation)
 * @param riskTier - Risk tier passed to decideRebalance
 * @returns Preview intent, or null if no profitable move
 */
export declare function previewRebalance(currentPosition: {
    protocol: string;
    amount: number;
}, useTestnet?: boolean, userAddress?: `0x${string}`, riskTier?: 'conservative' | 'moderate' | 'aggressive'): Promise<{
    proposal: RebalanceProposal | null;
    rates: RateData[];
    intent: RebalanceIntent | null;
}>;
/**
 * Execute a rebalance intent (write path - Phase 2.3).
 *
 * Safety rails before any write:
 * - Only a known venue/asset pair (no free-text third protocol).
 * - `intent.id` must match the preview the user confirmed.
 * - Per-tx cap and router whitelist enforced in simulateRebalance/supply.
 * - Approve(0) then exact amount - never an infinite approval.
 *
 * NOTE: The on-chain write sequence is implemented but UNTESTED on Fuji.
 * Phase 2.4 requires Fuji-first verification before use on mainnet.
 *
 * @param intent - Preview intent produced by previewRebalance
 * @param wallet - Viem wallet client (holds the signing key)
 * @returns Transaction receipt
 */
export declare function executeRebalance(intent: RebalanceIntent, wallet: any): Promise<RebalanceReceipt>;
//# sourceMappingURL=butlerBackend.d.ts.map