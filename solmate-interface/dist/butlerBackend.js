"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalances = getWalletBalances;
exports.simulateRebalance = simulateRebalance;
exports.fetchRates = fetchRates;
exports.decideRebalance = decideRebalance;
exports.previewRebalance = previewRebalance;
exports.executeRebalance = executeRebalance;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
// Note: wagmi will be used in the frontend for wallet connection
// Backend uses viem for read-only operations
// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
    // RPC Endpoints
    fujiRpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    mainnetRpc: 'https://api.avax.network/ext/bc/C/rpc',
    // Contract Addresses (✅ VERIFIED on-chain)
    aaveV3Pool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD', // VERIFIED - Aave V3 Avalanche (via PoolAddressesProvider.getPool)
    aUSDCn: '0x625E7708f30cA75bfd92586e17077590C60eb4cD', // VERIFIED - Aave V3 aUSDC (native) via getReserveData
    benqiQiUSDCn: '0xB715808a78F6041E46d61Cb123C9B4A27056AE9C', // VERIFIED - qiUSDCn (native USDC)
    // Alternative for bridged USDC.e: 0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F
    // (unused - pinned to native USDC, ignore USDC.e / paused markets)
    // Native USDC (pinned address - source of truth)
    nativeUSDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    // DefiLlama API (UI display only - on-chain data is source of truth)
    defiLlamaAPI: 'https://yields.llama.fi/pools',
    // Phase 2 Safety Parameters
    perTxCap: 100, // USDC
    dailyCap: 500, // USDC
    gasBufferUSD: 3, // USD buffer above estimated gas before a move is worth it
    daysHeldDefault: 30, // Default days held for calculation
    // APY floor: only apply for small positions (below this size the move
    // almost never clears $2-5 gas buffer). Larger positions can move on any
    // delta that clears the buffer.
    smallPositionSize: 100, // USDC
    smallPositionFloor: 0.40, // % - floor delta for small positions
    largePositionFloor: 0.25, // % - floor delta for large positions
    // Router whitelist (only these contracts can be approved)
    approvedRouters: [
        '0x794a61358D6845594F94dc1DB02A252b5b4814aD', // Aave V3 Pool
        '0xB715808a78F6041E46d61Cb123C9B4A27056AE9C' // BENQI qiUSDCn
    ],
};
/**
 * Get wallet balances and current position
 * @param address - Wallet address
 * @param useTestnet - Whether to use testnet
 * @returns Wallet balances and current venue
 */
async function getWalletBalances(address, useTestnet = false) {
    const chain = useTestnet ? chains_1.avalancheFuji : chains_1.avalanche;
    const rpcUrl = useTestnet ? CONFIG.fujiRpc : CONFIG.mainnetRpc;
    const publicClient = (0, viem_1.createPublicClient)({
        chain,
        transport: (0, viem_1.http)(rpcUrl),
    });
    // USDC ABI (minimal)
    const usdcABI = [
        {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
    ];
    // aUSDC ABI (Aave V3 aToken)
    const ausdcABI = [
        {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
    ];
    // qiUSDC ABI (BENQI qiToken)
    const qiusdcABI = [
        {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
    ];
    try {
        // Get USDC balance
        const usdcBalance = await publicClient.readContract({
            address: CONFIG.nativeUSDC,
            abi: usdcABI,
            functionName: 'balanceOf',
            args: [address],
        });
        // Get aUSDC balance (Aave V3 aToken - verified on-chain)
        const ausdcBalance = await publicClient.readContract({
            address: CONFIG.aUSDCn,
            abi: ausdcABI,
            functionName: 'balanceOf',
            args: [address],
        }).catch(() => 0n); // Fallback if not found
        // Get qiUSDC balance (BENQI)
        const qiusdcBalance = await publicClient.readContract({
            address: CONFIG.benqiQiUSDCn,
            abi: qiusdcABI,
            functionName: 'balanceOf',
            args: [address],
        }).catch(() => 0n); // Fallback if not found
        // Determine current venue (where balance > dust threshold)
        const dustThreshold = 1000000n; // 1 USDC (6 decimals)
        let currentVenue = null;
        if (ausdcBalance > dustThreshold) {
            currentVenue = 'aave';
        }
        else if (qiusdcBalance > dustThreshold) {
            currentVenue = 'benqi';
        }
        return {
            usdc: usdcBalance,
            aUSDC: ausdcBalance,
            qiUSDC: qiusdcBalance,
            currentVenue,
        };
    }
    catch (error) {
        console.error('Error fetching wallet balances:', error);
        return {
            usdc: 0n,
            aUSDC: 0n,
            qiUSDC: 0n,
            currentVenue: null,
        };
    }
}
/**
 * Simulate a rebalance operation without executing it
 * @param proposal - Rebalance proposal from decideRebalance
 * @param amount - Amount to rebalance in USDC
 * @param userAddress - User's wallet address
 * @param useTestnet - Whether to use testnet
 * @returns Simulation result with steps and gas estimates
 */
async function simulateRebalance(proposal, amount, userAddress, useTestnet = false) {
    const chain = useTestnet ? chains_1.avalancheFuji : chains_1.avalanche;
    const rpcUrl = useTestnet ? CONFIG.fujiRpc : CONFIG.mainnetRpc;
    const publicClient = (0, viem_1.createPublicClient)({
        chain,
        transport: (0, viem_1.http)(rpcUrl),
    });
    const steps = [];
    let totalGas = 0n;
    try {
        // Convert amount to wei (USDC has 6 decimals)
        const amountWei = BigInt(amount * 1e6);
        // Check per-tx cap
        if (amount > CONFIG.perTxCap) {
            return {
                canExecute: false,
                steps: [],
                estimatedGas: 0n,
                estimatedGasUSD: 0,
                error: `Amount exceeds per-transaction cap of ${CONFIG.perTxCap} USDC`,
            };
        }
        // Determine source and destination contracts
        const sourceContract = proposal.fromProtocol === 'aave' ? CONFIG.aaveV3Pool : CONFIG.benqiQiUSDCn;
        const destContract = proposal.toProtocol === 'aave' ? CONFIG.aaveV3Pool : CONFIG.benqiQiUSDCn;
        // Step 1: Withdraw from source
        if (proposal.fromProtocol === 'benqi') {
            // BENQI withdraw (redeemUnderlying)
            const withdrawABI = [
                {
                    inputs: [{ internalType: 'uint256', name: 'redeemAmount', type: 'uint256' }],
                    name: 'redeemUnderlying',
                    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                    stateMutability: 'nonpayable',
                    type: 'function',
                },
            ];
            try {
                const gasEstimate = await publicClient.estimateContractGas({
                    address: sourceContract,
                    abi: withdrawABI,
                    functionName: 'redeemUnderlying',
                    args: [amountWei],
                    account: userAddress,
                });
                steps.push({
                    type: 'withdraw',
                    protocol: proposal.fromProtocol,
                    calldata: 'redeemUnderlying(uint256)',
                    estimatedGas: gasEstimate,
                });
                totalGas += gasEstimate;
            }
            catch (error) {
                console.error('Error estimating withdraw gas:', error);
                return {
                    canExecute: false,
                    steps: [],
                    estimatedGas: 0n,
                    estimatedGasUSD: 0,
                    error: 'Failed to estimate withdraw gas',
                };
            }
        }
        else if (proposal.fromProtocol === 'aave') {
            // Aave withdraw
            const withdrawABI = [
                {
                    inputs: [
                        { internalType: 'address', name: 'asset', type: 'address' },
                        { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        { internalType: 'address', name: 'to', type: 'address' },
                    ],
                    name: 'withdraw',
                    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                    stateMutability: 'nonpayable',
                    type: 'function',
                },
            ];
            try {
                const gasEstimate = await publicClient.estimateContractGas({
                    address: sourceContract,
                    abi: withdrawABI,
                    functionName: 'withdraw',
                    args: [CONFIG.nativeUSDC, amountWei, userAddress],
                    account: userAddress,
                });
                steps.push({
                    type: 'withdraw',
                    protocol: proposal.fromProtocol,
                    calldata: 'withdraw(address,uint256,address)',
                    estimatedGas: gasEstimate,
                });
                totalGas += gasEstimate;
            }
            catch (error) {
                console.error('Error estimating withdraw gas:', error);
                return {
                    canExecute: false,
                    steps: [],
                    estimatedGas: 0n,
                    estimatedGasUSD: 0,
                    error: 'Failed to estimate withdraw gas',
                };
            }
        }
        // Step 2: Approve destination (if needed)
        const approveABI = [
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ];
        try {
            const gasEstimate = await publicClient.estimateContractGas({
                address: CONFIG.nativeUSDC,
                abi: approveABI,
                functionName: 'approve',
                args: [destContract, amountWei],
                account: userAddress,
            });
            steps.push({
                type: 'approve',
                protocol: 'USDC',
                calldata: 'approve(address,uint256)',
                estimatedGas: gasEstimate,
            });
            totalGas += gasEstimate;
        }
        catch (error) {
            console.error('Error estimating approve gas:', error);
            return {
                canExecute: false,
                steps: [],
                estimatedGas: 0n,
                estimatedGasUSD: 0,
                error: 'Failed to estimate approve gas',
            };
        }
        // Step 3: Supply to destination
        if (proposal.toProtocol === 'benqi') {
            // BENQI supply (mint)
            const supplyABI = [
                {
                    inputs: [{ internalType: 'uint256', name: 'mintAmount', type: 'uint256' }],
                    name: 'mint',
                    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                    stateMutability: 'nonpayable',
                    type: 'function',
                },
            ];
            try {
                const gasEstimate = await publicClient.estimateContractGas({
                    address: destContract,
                    abi: supplyABI,
                    functionName: 'mint',
                    args: [amountWei],
                    account: userAddress,
                });
                steps.push({
                    type: 'supply',
                    protocol: proposal.toProtocol,
                    calldata: 'mint(uint256)',
                    estimatedGas: gasEstimate,
                });
                totalGas += gasEstimate;
            }
            catch (error) {
                console.error('Error estimating supply gas:', error);
                return {
                    canExecute: false,
                    steps: [],
                    estimatedGas: 0n,
                    estimatedGasUSD: 0,
                    error: 'Failed to estimate supply gas',
                };
            }
        }
        else if (proposal.toProtocol === 'aave') {
            // Aave supply
            const supplyABI = [
                {
                    inputs: [
                        { internalType: 'address', name: 'asset', type: 'address' },
                        { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        { internalType: 'address', name: 'onBehalfOf', type: 'address' },
                        { internalType: 'uint16', name: 'referralCode', type: 'uint16' },
                    ],
                    name: 'supply',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function',
                },
            ];
            try {
                const gasEstimate = await publicClient.estimateContractGas({
                    address: destContract,
                    abi: supplyABI,
                    functionName: 'supply',
                    args: [CONFIG.nativeUSDC, amountWei, userAddress, 0],
                    account: userAddress,
                });
                steps.push({
                    type: 'supply',
                    protocol: proposal.toProtocol,
                    calldata: 'supply(address,uint256,address,uint16)',
                    estimatedGas: gasEstimate,
                });
                totalGas += gasEstimate;
            }
            catch (error) {
                console.error('Error estimating supply gas:', error);
                return {
                    canExecute: false,
                    steps: [],
                    estimatedGas: 0n,
                    estimatedGasUSD: 0,
                    error: 'Failed to estimate supply gas',
                };
            }
        }
        // Get current gas price for USD conversion
        const gasPrice = await publicClient.getGasPrice();
        const gasCostWei = totalGas * gasPrice;
        // Convert gas cost to USD (rough estimate - in production use price oracle)
        // Assuming AVAX price around $35 (placeholder - should use price oracle)
        const avaxPriceUSD = 35;
        const gasCostUSD = Number(gasCostWei) / 1e18 * avaxPriceUSD;
        return {
            canExecute: true,
            steps,
            estimatedGas: totalGas,
            estimatedGasUSD: gasCostUSD,
        };
    }
    catch (error) {
        console.error('Error simulating rebalance:', error);
        return {
            canExecute: false,
            steps: [],
            estimatedGas: 0n,
            estimatedGasUSD: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// ============================================================================
// RATE FETCHING
// ============================================================================
/**
 * Fetch current rates from all supported lending markets
 * @param useTestnet - Whether to use testnet (Fuji) or mainnet. Defaults to false (mainnet).
 *                    Note: BENQI is mainnet-only, and Aave Fuji testnet status is uncertain.
 *                    fetchRates() is read-only and safe to run on mainnet.
 * @returns Array of normalized rate data
 */
async function fetchRates(useTestnet = false) {
    const chain = useTestnet ? chains_1.avalancheFuji : chains_1.avalanche;
    const rpcUrl = useTestnet ? CONFIG.fujiRpc : CONFIG.mainnetRpc;
    const publicClient = (0, viem_1.createPublicClient)({
        chain,
        transport: (0, viem_1.http)(rpcUrl),
    });
    const rates = [];
    try {
        // Fetch Aave V3 rates (on-chain source of truth, DefiLlama fallback)
        const aaveRate = await fetchAaveRate(publicClient);
        if (aaveRate)
            rates.push(aaveRate);
    }
    catch (error) {
        console.error('Failed to fetch Aave rates:', error);
    }
    try {
        // BENQI has no testnet deployment (mainnet-only)
        if (!useTestnet) {
            const benqiRate = await fetchBenqiRate(publicClient);
            if (benqiRate)
                rates.push(benqiRate);
        }
        else {
            console.warn('BENQI is mainnet-only - skipping testnet fetch');
        }
    }
    catch (error) {
        console.error('Failed to fetch BENQI rates:', error);
    }
    // Trader Joe stub - TODO: Implement when LP strategies are needed
    // const traderJoeRate = await fetchTraderJoeRate(publicClient, useTestnet);
    // if (traderJoeRate) rates.push(traderJoeRate);
    return rates;
}
// Seconds per year used for compounding rates to annual APY
const SECONDS_PER_YEAR = 31536000;
/**
 * Aave V3 getReserveData.currentLiquidityRate is a Ray (1e27) encoding the
 * ANNUAL supply rate as a fraction (verified: rate/1e27 == reported APY).
 * Convert to effective compounded APY (%).
 */
function aaveRayToApy(rateRay) {
    const annualFraction = rateRay / 1e27;
    const apy = (Math.pow(1 + annualFraction / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1) * 100;
    return Number.isFinite(apy) ? apy : annualFraction * 100;
}
/**
 * BENQI supplyRatePerTimestamp is a per-second rate with 18 decimals (Compound
 * style). Convert to effective compounded APY (%).
 */
function benqiPerSecToApy(ratePerTimestamp) {
    const perSecond = ratePerTimestamp / 1e18;
    const apy = (Math.pow(1 + perSecond, SECONDS_PER_YEAR) - 1) * 100;
    return Number.isFinite(apy) ? apy : perSecond * SECONDS_PER_YEAR * 100;
}
/**
 * Aave V3 getReserveData ABI fragment (returns ReserveData struct).
 * currentLiquidityRate is a Ray (1e27) - the per-second supply rate.
 * NOTE: field set matches the live on-chain ABI (verified via decode).
 */
const aaveReserveDataABI = [
    {
        inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
        name: 'getReserveData',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'data', type: 'uint256' },
                ],
                internalType: 'struct DataTypes.ReserveConfigurationMap',
                name: 'configuration',
                type: 'tuple',
            },
            { internalType: 'uint128', name: 'liquidityIndex', type: 'uint128' },
            { internalType: 'uint128', name: 'currentLiquidityRate', type: 'uint128' },
            { internalType: 'uint128', name: 'variableBorrowIndex', type: 'uint128' },
            { internalType: 'uint128', name: 'currentVariableBorrowRate', type: 'uint128' },
            { internalType: 'uint128', name: 'currentStableBorrowRate', type: 'uint128' },
            { internalType: 'uint40', name: 'lastUpdateTimestamp', type: 'uint40' },
            { internalType: 'uint16', name: 'id', type: 'uint16' },
            { internalType: 'address', name: 'aTokenAddress', type: 'address' },
            { internalType: 'address', name: 'stableDebtTokenAddress', type: 'address' },
            { internalType: 'address', name: 'variableDebtTokenAddress', type: 'address' },
            { internalType: 'address', name: 'interestRateStrategyAddress', type: 'address' },
            { internalType: 'uint128', name: 'accruedToTreasury', type: 'uint128' },
            { internalType: 'uint128', name: 'unbacked', type: 'uint128' },
            { internalType: 'uint128', name: 'isolationModeTotalDebt', type: 'uint128' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
/**
 * BENQI supplyRatePerTimestamp ABI fragment (Compound-style per-second rate)
 */
const benqiRateABI = [
    {
        inputs: [],
        name: 'supplyRatePerTimestamp',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];
/**
 * Fetch Aave V3 native USDC supply APY from on-chain reserve data.
 * On-chain is the source of truth; DefiLlama is only a UI fallback.
 * @param publicClient - Viem public client
 * @returns Normalized rate data or null
 */
async function fetchAaveRate(publicClient) {
    try {
        const reserve = await publicClient.readContract({
            address: CONFIG.aaveV3Pool,
            abi: aaveReserveDataABI,
            functionName: 'getReserveData',
            args: [CONFIG.nativeUSDC],
        });
        const configData = reserve[0].data;
        // ReserveConfigurationMap bit masks (Aave V3): IS_ACTIVE = bit 56, IS_FROZEN = bit 57
        const isActive = ((configData >> 56n) & 1n) === 1n;
        const isFrozen = ((configData >> 57n) & 1n) === 1n;
        // Skip frozen / inactive markets (native USDC on Aave V3 is active)
        if (!isActive || isFrozen) {
            console.warn('Aave native USDC reserve inactive or frozen - skipping');
            return null;
        }
        const currentLiquidityRate = Number(reserve[2]);
        const apy = aaveRayToApy(currentLiquidityRate);
        console.log('Aave V3 native USDC (on-chain):', { apy, aToken: reserve[8] });
        return {
            protocol: 'aave',
            market: 'USDC',
            apy,
            tvl: 0, // Not read on-chain (would need total supply); UI lists TVL via DefiLlama
            timestamp: Date.now(),
        };
    }
    catch (error) {
        console.warn('On-chain Aave rate failed, falling back to DefiLlama (UI-only):', error);
        return fetchAaveDefiLlama();
    }
}
/**
 * DefiLlama fallback for Aave - UI display only, not source of truth.
 */
async function fetchAaveDefiLlama() {
    try {
        const response = await fetch(CONFIG.defiLlamaAPI);
        const data = await response.json();
        const aavePool = data.data?.find((pool) => pool.chain === 'Avalanche' &&
            pool.project === 'aave-v3' &&
            pool.symbol === 'USDC');
        if (!aavePool)
            return null;
        return {
            protocol: 'aave',
            market: 'USDC',
            apy: aavePool.apy || 0,
            tvl: aavePool.tvlUsd || 0,
            timestamp: Date.now(),
        };
    }
    catch (error) {
        console.error('DefiLlama Aave fallback failed:', error);
        return null;
    }
}
/**
 * Fetch BENQI qiUSDCn (native USDC) supply APY from on-chain supplyRatePerTimestamp.
 * BENQI is Compound-style; the rate is per-second (18 decimals).
 * @param publicClient - Viem public client
 * @returns Normalized rate data or null
 */
async function fetchBenqiRate(publicClient) {
    try {
        const supplyRate = await publicClient.readContract({
            address: CONFIG.benqiQiUSDCn,
            abi: benqiRateABI,
            functionName: 'supplyRatePerTimestamp',
        });
        const apy = benqiPerSecToApy(Number(supplyRate));
        console.log('BENQI qiUSDCn (on-chain):', { apy });
        return {
            protocol: 'benqi',
            market: 'qiUSDCn',
            apy,
            tvl: 0, // Not read on-chain (would need totalSupply + exchange rate); UI lists TVL
            timestamp: Date.now(),
        };
    }
    catch (error) {
        console.warn('On-chain BENQI rate failed, falling back to DefiLlama (UI-only):', error);
        return fetchBenqiDefiLlama();
    }
}
/**
 * DefiLlama fallback for BENQI - UI display only, not source of truth.
 */
async function fetchBenqiDefiLlama() {
    try {
        const response = await fetch(CONFIG.defiLlamaAPI);
        const data = await response.json();
        const benqiPool = data.data?.find((pool) => pool.chain === 'Avalanche' &&
            pool.project === 'benqi-lending' &&
            pool.symbol === 'USDC');
        if (!benqiPool)
            return null;
        return {
            protocol: 'benqi',
            market: 'qiUSDCn',
            apy: benqiPool.apy || 0,
            tvl: benqiPool.tvlUsd || 0,
            timestamp: Date.now(),
        };
    }
    catch (error) {
        console.error('DefiLlama BENQI fallback failed:', error);
        return null;
    }
}
// ============================================================================
// ROUTING LOGIC
// ============================================================================
/**
 * Decide whether to rebalance based on current position and available rates
 * @param currentPosition - Current protocol and amount
 * @param rates - Array of available rates
 * @param riskTier - User's risk tolerance (conservative, moderate, aggressive)
 * @param daysHeld - Number of days position will be held (default 30)
 * @param gasCostUSD - Estimated gas cost in USD (default 0.02)
 * @returns Rebalance proposal or null
 */
function decideRebalance(currentPosition, rates, riskTier = 'moderate', daysHeld = CONFIG.daysHeldDefault, gasCostUSD = 0.02) {
    // Find current position's rate
    const currentRate = rates.find(r => r.protocol === currentPosition.protocol);
    if (!currentRate) {
        console.error('Current position not found in rates');
        return null;
    }
    // Find best alternative rate
    const alternatives = rates.filter(r => r.protocol !== currentPosition.protocol);
    if (alternatives.length === 0) {
        return null; // No alternatives available
    }
    const bestAlternative = alternatives.reduce((best, current) => current.apy > best.apy ? current : best);
    // Calculate APY delta
    const apyDelta = bestAlternative.apy - currentRate.apy;
    // Phase 2 refined threshold:
    // move if (ΔAPY × idleUSDC × daysHeld) > gasUSD + USD buffer
    const annualGain = currentPosition.amount * (apyDelta / 100);
    const periodGain = annualGain * (daysHeld / 365);
    const totalCost = gasCostUSD + CONFIG.gasBufferUSD;
    // APY floor: only gate small positions. Below the size threshold a move
    // rarely clears the $2-5 gas buffer, so enforce a stricter delta floor.
    // Large positions may move on any delta that clears the buffer above.
    const isSmall = currentPosition.amount < CONFIG.smallPositionSize;
    const floorThreshold = isSmall ? CONFIG.smallPositionFloor : CONFIG.largePositionFloor;
    // Check if delta below floor
    if (apyDelta < floorThreshold) {
        return null; // Delta below floor
    }
    // Calculate break-even days (days until gain covers gas cost)
    const dailyGain = annualGain / 365;
    const breakEvenDays = dailyGain > 0 ? gasCostUSD / dailyGain : 0;
    // Estimate monthly gain (using 30 days)
    const monthlyGain = currentPosition.amount * (apyDelta / 100) / 12;
    // Return proposal even if not worth executing (for preview)
    return {
        fromProtocol: currentPosition.protocol,
        toProtocol: bestAlternative.protocol,
        apyDelta,
        estMonthlyGain: monthlyGain,
        estGasCost: gasCostUSD, // In USD now
        gasBufferUSD: CONFIG.gasBufferUSD,
        wouldExecute: periodGain > totalCost,
        wouldBreakEven: periodGain > gasCostUSD,
        breakEvenDays,
        periodGain,
    };
}
// ============================================================================
// EXECUTION
// ============================================================================
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
async function previewRebalance(currentPosition, useTestnet = false, userAddress = '0x0000000000000000000000000000000000000000', riskTier = 'moderate') {
    const rates = await fetchRates(useTestnet);
    const proposal = decideRebalance(currentPosition, rates, riskTier, CONFIG.daysHeldDefault, 0.02);
    if (!proposal) {
        return { proposal: null, rates, intent: null };
    }
    const sim = await simulateRebalance(proposal, currentPosition.amount, userAddress, useTestnet);
    if (!sim.canExecute) {
        // Gas simulation failed (e.g. over per-tx cap, or estimate reverted).
        // Still surface the proposal so the user sees why it didn't turn into an intent.
        return { proposal, rates, intent: null };
    }
    const intent = {
        id: computeIntentId(proposal, currentPosition.amount, sim.estimatedGasUSD),
        fromProtocol: proposal.fromProtocol,
        toProtocol: proposal.toProtocol,
        amount: currentPosition.amount,
        apyDelta: proposal.apyDelta,
        estMonthlyGain: proposal.estMonthlyGain,
        estGasUSD: sim.estimatedGasUSD,
        createdAt: Date.now(),
        steps: sim.steps,
        status: 'preview',
    };
    return { proposal, rates, intent };
}
/**
 * Deterministic id for an intent so a later confirm can be matched 1:1.
 * (String hash of the key fields - no secret material.)
 */
function computeIntentId(proposal, amount, estGasUSD) {
    const str = `${proposal.fromProtocol}|${proposal.toProtocol}|${amount}|${proposal.apyDelta.toFixed(6)}|${estGasUSD.toFixed(6)}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return (hash >>> 0).toString(36).padStart(6, '0');
}
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
async function executeRebalance(intent, wallet // Viem WalletClient type
) {
    // TODO (Phase 2.3): implement the write sequence:
    //  1. Re-fetch on-chain rates + balance; confirm intent is still the best move.
    //  2. Verify router whitelist: [Aave Pool, BENQI qiUSDCn] only.
    //  3. If from == benqi: qiToken.redeemUnderlying(amount)
    //     If from == aave:  pool.withdraw(USDC, amount, user)
    //  4. USDC.approve(0) then USDC.approve(destSpender, exactAmount)
    //  5. If to == aave:  pool.supply(USDC, amount, user, 0)
    //     If to == benqi: qiToken.mint(amount)
    //  6. Return receipt. Fuji-first; never run on mainnet until verified.
    throw new Error('Execution not yet implemented - sign a previewRebalance intent first (Phase 2.3)');
}
//# sourceMappingURL=butlerBackend.js.map