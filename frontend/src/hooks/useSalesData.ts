import { useEffect, useState } from "react";
import type { Sale } from "@/lib/sales-data";

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vendas/")
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