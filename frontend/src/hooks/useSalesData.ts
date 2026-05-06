import { useEffect, useState } from "react";
import { salesData as localSalesData, type Sale } from "../lib/sales-data";

const API_URL = import.meta.env.VITE_API_URL;

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        console.log("API_URL:", API_URL);

        if (!API_URL) {
          console.warn("Sem API_URL. Usando dados locais.");
          if (isMounted) setSalesData(localSalesData);
          return;
        }

        const res = await fetch(`${API_URL}/api/vendas/`);

        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }

        const data = await res.json();

        console.log("DADOS API:", data);

        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setSalesData(data);
          } else {
            setSalesData(localSalesData);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);

        if (isMounted) {
          setSalesData(localSalesData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { salesData, loading };
}