// In-browser live ticker simulator. Mimics WebSocket-style price ticks
// without needing a backend. Each subscription returns an unsubscribe fn.

export function subscribeTicker(stock, onTick, options = {}) {
  const interval = options.interval ?? 1500;
  // Volatility ~0.08% per tick gives realistic-looking jitter without runaway drift.
  const volatility = options.volatility ?? 0.0008;
  let price = stock.price;
  let mounted = true;

  const id = setInterval(() => {
    if (!mounted) return;
    // Random walk with slight pull toward original price so we don't drift away.
    const pull = (stock.price - price) * 0.05;
    const noise = (Math.random() - 0.5) * 2 * volatility * stock.price;
    price = Math.max(0.01, price + pull + noise);
    onTick({ price, ts: Date.now() });
  }, interval);

  return () => {
    mounted = false;
    clearInterval(id);
  };
}
