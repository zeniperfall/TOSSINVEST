// Simple buy-and-hold backtest over the price series. Returns return %, max
// drawdown, volatility (stdev of daily returns × √252 × 100).

export function backtest(series) {
  if (!series || series.length < 2) return null;
  const start = series[0].price;
  const end = series[series.length - 1].price;
  const totalReturn = ((end - start) / start) * 100;

  let peak = start;
  let maxDrawdown = 0;
  for (const p of series) {
    if (p.price > peak) peak = p.price;
    const dd = ((p.price - peak) / peak) * 100;
    if (dd < maxDrawdown) maxDrawdown = dd;
  }

  const returns = [];
  for (let i = 1; i < series.length; i++) {
    returns.push((series[i].price - series[i - 1].price) / series[i - 1].price);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const dailyStdev = Math.sqrt(variance);
  const annualizedVol = dailyStdev * Math.sqrt(252) * 100;

  // Sharpe-ish (mean / stdev * √N). No risk-free rate; informational only.
  const sharpe = dailyStdev === 0 ? 0 : (mean / dailyStdev) * Math.sqrt(252);

  return {
    start,
    end,
    totalReturn,
    maxDrawdown,
    volatility: annualizedVol,
    sharpe,
    points: series.length,
  };
}
