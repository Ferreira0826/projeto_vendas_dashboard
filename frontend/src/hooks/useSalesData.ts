import { useEffect, useState } from "react";
import { salesData as localSalesData, type Sale } from "../lib/sales-data";

const API_URL = import.meta.env.VITE_API_URL;

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>(localSalesData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!API_URL) return;

    let isMounted = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    async function fetchApi() {
      try {
        const res = await fetch(`${API_URL}/api/vendas/`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSalesData(data);
        }
      } catch (err) {
        console.warn("API indisponível, usando dados locais.", err);
      } finally {
        clearTimeout(timeout);
      }
    }

    fetchApi();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { salesData, loading };
}