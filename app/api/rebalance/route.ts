import { NextRequest, NextResponse } from 'next/server';
import { fetchRates, decideRebalance } from '@/solmate-interface/src/butlerBackend';

export async function POST(req: NextRequest) {
  try {
    const { currentPosition, riskTier } = await req.json();
    const rates = await fetchRates(false);
    const proposal = decideRebalance(currentPosition, rates, riskTier ?? 'moderate');
    return NextResponse.json({ rates, proposal });
  } catch (error) {
    console.error('Error getting rebalance proposal:', error);
    return NextResponse.json(
      { error: 'Failed to get rebalance proposal' },
      { status: 500 }
    );
  }
}