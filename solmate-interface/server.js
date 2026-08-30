const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Dynamic import of compiled TypeScript module
async function getBackend() {
  const backend = require('./dist/butlerBackend');
  return backend;
}

// API endpoint to fetch rates
app.get('/api/rates', async (req, res) => {
  try {
    const { fetchRates } = await getBackend();
    const rates = await fetchRates(false);
    res.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
});

// API endpoint to get rebalance proposal
app.post('/api/rebalance', async (req, res) => {
  try {
    const { currentPosition, riskTier } = req.body;
    const { fetchRates, decideRebalance } = await getBackend();
    
    const rates = await fetchRates(false);
    const proposal = decideRebalance(currentPosition, rates, riskTier);
    
    res.json({ rates, proposal });
  } catch (error) {
    console.error('Error getting rebalance proposal:', error);
    res.status(500).json({ error: 'Failed to get rebalance proposal' });
  }
});

app.listen(PORT, () => {
  console.log(`The Butler server running at http://localhost:${PORT}`);
});
