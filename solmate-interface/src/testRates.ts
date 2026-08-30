import { fetchRates } from './butlerBackend';

async function testFetchRates() {
  console.log('Testing fetchRates() on Avalanche mainnet...\n');
  console.log('Note: BENQI is mainnet-only, Aave V3 Fuji testnet status uncertain\n');
  console.log('Attempting live data fetching from official APIs...\n');
  
  try {
    const rates = await fetchRates(false); // Mainnet (read-only, safe)
    
    console.log('Fetched rates:');
    console.log(JSON.stringify(rates, null, 2));
    
    if (rates.length === 0) {
      console.log('\n⚠️ No rates fetched - official API integration failed');
      console.log('This may be due to:');
      console.log('- API schema changes (Aave GraphQL, DefiLlama)');
      console.log('- Protocol naming differences in data sources');
      console.log('- Network connectivity issues');
      console.log('\nCheck the debug output above for available pools on DefiLlama');
    } else {
      console.log('\n✅ Successfully fetched live rates from official APIs');
    }
  } catch (error) {
    console.error('Error testing fetchRates:', error);
  }
}

testFetchRates();
