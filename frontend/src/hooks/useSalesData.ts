import { useEffect, useState } from "react";
import type { Sale } from "@/lib/sales-data";

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/api/vendas/`)
      .then((res) => res.json())
      .then((json) => {
        console.log("DADOS DA API:", json);

        const data = Array.isArray(json) ? json : json.results;
        setSalesData(data ?? []);
      })
      .catch((error) => {
        console.error("ERRO AO BUSCAR API:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { salesData, loading };
}