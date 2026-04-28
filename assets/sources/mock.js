// Mock source: wraps existing buildSeries for the abstract interface.
import { buildSeries } from '../data.js';

export async function getQuote(stock) {
  return {
    open: stock.open,
    high: stock.high,
    low: stock.low,
    price: stock.price,
    volume: 0,
    date: '',
    time: '',
  };
}

export async function getSeries(stock, range) {
  return buildSeries(stock, range);
}

export const label = 'Mock';
