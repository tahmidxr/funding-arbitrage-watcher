import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch("/api/funding");
    const json = await res.json();
    setData(json.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 minute auto-refresh
    return () => clearInterval(interval);
  }, []);

  const best = [...data].sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))[0];

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">💹 Funding Arbitrage Watcher</h1>
      <p className="mb-4">Live Funding Rate Comparison (Binance vs Bitget)</p>

      {best && (
        <div className="mb-6 p-4 bg-gray-900 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold text-pink-400">🔥 Best Opportunity: {best.symbol}</h2>
          <p>Binance: {best.binance.rate}, Bitget: {best.bitget.rate}, Diff: {best.difference.toFixed(6)}</p>
        </div>
      )}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2">Binance</th>
            <th className="px-4 py-2">Bitget</th>
            <th className="px-4 py-2">Difference</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.symbol} className="border-b border-gray-700">
              <td className="px-4 py-2">{item.symbol}</td>
              <td className="px-4 py-2">{item.binance.rate}</td>
              <td className="px-4 py-2">{item.bitget.rate}</td>
              <td className="px-4 py-2 text-pink-400">{item.difference.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
