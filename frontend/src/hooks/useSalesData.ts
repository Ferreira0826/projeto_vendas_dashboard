import { useEffect, useState } from "react";
import { salesData as localSalesData, type Sale } from "../lib/sales-data";

const API_URL = import.meta.env.VITE_API_URL;

export function useSalesData() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  // Avisa o usuário que a API pode estar "acordando" (cold start do Render free)
  const [acordandoApi, setAcordandoApi] = useState(false);

  useEffect(() => {
    // Sem API configurada: usa dados locais imediatamente
    if (!API_URL) {
      setSalesData(localSalesData);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    // Após 4s sem resposta, avisa que a API está acordando
    const avisoTimer = setTimeout(() => {
      if (isMounted) setAcordandoApi(true);
    }, 4000);

    // Timeout máximo de 60s (cold start do Render pode levar ~50s)
    const timeout = setTimeout(() => controller.abort(), 60000);

    async function fetchApi() {
      try {
        const res = await fetch(`${API_URL}/api/vendas/`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSalesData(data);
        } else if (isMounted) {
          // API respondeu vazio: cai para dados locais
          setSalesData(localSalesData);
        }
      } catch (err) {
        console.warn("API indisponível, usando dados locais.", err);
        if (isMounted) setSalesData(localSalesData);
      } finally {
        clearTimeout(timeout);
        clearTimeout(avisoTimer);
        if (isMounted) {
          setLoading(false);
          setAcordandoApi(false);
        }
      }
    }

    fetchApi();
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeout);
      clearTimeout(avisoTimer);
    };
  }, []);

  return { salesData, loading, acordandoApi };
}