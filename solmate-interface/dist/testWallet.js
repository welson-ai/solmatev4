"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const butlerBackend_1 = require("./butlerBackend");
async function testWalletBalances() {
    console.log('Testing getWalletBalances()...\n');
    try {
        // Test with a sample address (using a known address with balances)
        const testAddress = '0x0000000000000000000000000000000000000000';
        console.log('Fetching balances for address:', testAddress);
        // Test on mainnet
        const mainnetBalances = await (0, butlerBackend_1.getWalletBalances)(testAddress, false);
        console.log('Mainnet balances:', mainnetBalances);
        // Test on testnet
        const testnetBalances = await (0, butlerBackend_1.getWalletBalances)(testAddress, true);
        console.log('Testnet balances:', testnetBalances);
    }
    catch (error) {
        console.error('Error testing wallet balances:', error);
    }
}
testWalletBalances();
//# sourceMappingURL=testWallet.js.map