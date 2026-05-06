import { useEffect, useState } from "react";
import { salesData as localSalesData, type Sale } from "../lib/sales-data";

const API_URL = import.meta.env.VITE_API_URL;

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function load() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(`${API_URL}/api/vendas/`, {
        signal: controller.signal,
      });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSalesData(data);
      } else {
        setSalesData(localSalesData);
      }
    } catch (error) {
      console.error("Erro ao carregar API. Usando dados locais:", error);
      setSalesData(localSalesData);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  load();
}, []);

  return { salesData, loading };
}