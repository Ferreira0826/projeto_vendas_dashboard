import { useEffect, useState } from "react";
import type { Sale } from "../lib/sales-data";

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    console.log("API_URL:", API_URL);

    if (!API_URL) {
      console.error("VITE_API_URL não definida");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/vendas/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        console.log("DADOS DA API:", json);

        const data = Array.isArray(json) ? json : json.results;
        setSalesData(data ?? []);
      })
      .catch((error) => {
        console.error("ERRO AO BUSCAR API:", error);
        setSalesData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { salesData, loading };
}