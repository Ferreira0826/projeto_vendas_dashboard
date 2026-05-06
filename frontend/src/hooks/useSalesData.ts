import { useEffect, useState } from "react";
import { salesData as localSalesData, type Sale } from "../lib/sales-data";

const API_URL = import.meta.env.VITE_API_URL;

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setSalesData(localSalesData);
  setLoading(false);

  async function loadApi() {
    try {
      const res = await fetch(`${API_URL}/api/vendas/`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSalesData(data);
      }
    } catch (error) {
      console.error("Erro API:", error);
    }
  }

  loadApi();
}, []);

  return { salesData, loading };
}