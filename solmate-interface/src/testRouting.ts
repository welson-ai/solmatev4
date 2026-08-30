import { fetchRates, decideRebalance } from './butlerBackend';

async function testRouting() {
  console.log('Testing decideRebalance() with Phase 2 refined threshold logic...\n');
  
  try {
    // Fetch current rates
    const rates = await fetchRates(false);
    console.log('Current rates:', JSON.stringify(rates, null, 2));
    
    if (rates.length < 2) {
      console.log('Need at least 2 protocols to test routing');
      return;
    }
    
    // Test case 1: Small APY difference (should not trigger with new logic)
    console.log('\n--- Test Case 1: Small APY difference (should not trigger) ---');
    const currentPosition1 = {
      protocol: 'aave',
      amount: 1000 // 1000 USDC
    };
    
    const proposal1 = decideRebalance(currentPosition1, rates, 'moderate');
    console.log('Current position:', currentPosition1);
    console.log('Proposal:', proposal1);
    
    // Test case 2: Large position with meaningful gain over gas cost
    console.log('\n--- Test Case 2: Large position with meaningful gain ---');
    const currentPosition2 = {
      protocol: 'aave',
      amount: 10000 // 10,000 USDC
    };
    
    // Create rates with larger delta for testing
    const ratesWithLargeDelta = [
      { ...rates[0], apy: 2.0 }, // Lower Aave rate
      { ...rates[1], apy: 3.0 }  // Higher BENQI rate (1% delta, meaningful for large position)
    ];
    
    const proposal2 = decideRebalance(currentPosition2, ratesWithLargeDelta, 'moderate');
    console.log('Current position:', currentPosition2);
    console.log('Rates for test:', ratesWithLargeDelta.map(r => ({ protocol: r.protocol, apy: r.apy })));
    console.log('Proposal:', proposal2);
    
    // Test case 3: Small position, needs higher floor threshold
    console.log('\n--- Test Case 3: Small position needs higher threshold ---');
    const currentPosition3 = {
      protocol: 'aave',
      amount: 50 // 50 USDC (small position)
    };
    
    const proposal3 = decideRebalance(currentPosition3, ratesWithLargeDelta, 'moderate');
    console.log('Current position:', currentPosition3);
    console.log('Proposal:', proposal3);
    
  } catch (error) {
    console.error('Error testing routing:', error);
  }
}

testRouting();
