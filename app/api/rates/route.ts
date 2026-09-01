import { NextRequest, NextResponse } from 'next/server';
import { fetchRates } from '@/solmate-interface/src/butlerBackend';

export async function GET(_req: NextRequest) {
  try {
    const rates = await fetchRates(false);
    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}