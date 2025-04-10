// pages/api/funding.js
import axios from "axios";
import { symbols } from "@/utils/symbols";

export default async function handler(req, res) {
  try {
    const data = await Promise.all(
      symbols.map(async (symbol) => {
        const binanceUrl = `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&limit=1`;
        const bitgetSymbol = symbol.replace("USDT", "USDT_UMCBL");
        const bitgetUrl = `https://api.bitget.com/api/mix/v1/market/current-fundRate?symbol=${bitgetSymbol}`;

        const [binanceRes, bitgetRes] = await Promise.all([
          axios.get(binanceUrl),
          axios.get(bitgetUrl)
        ]);

        const binanceFunding = binanceRes.data[0];
        const bitgetFunding = bitgetRes.data.data;

        return {
          symbol,
          binance: {
            rate: parseFloat(binanceFunding.fundingRate),
            time: new Date(binanceFunding.fundingTime).toISOString()
          },
          bitget: {
            rate: parseFloat(bitgetFunding.fundRate),
            time: new Date(parseInt(bitgetFunding.fundingTime)).toISOString()
          },
          difference: parseFloat(bitgetFunding.fundRate) - parseFloat(binanceFunding.fundingRate)
        };
      })
    );

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

