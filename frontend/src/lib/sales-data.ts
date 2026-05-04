export type Sale = {
  sku: string;
  produto: string;
  categoria: string;
  preco: number;
  estoque: number;
  vendas: number;
  receita: number;
  vendedor: string;
  canal: "Online" | "Fisico";
  data: string;
};

export const salesData: Sale[] = [
  { sku: "SKU001", produto: "Smartphone Galaxy S23", categoria: "Smartphone", preco: 4500, estoque: 120, vendas: 35, receita: 157500, vendedor: "Carlos", canal: "Online", data: "2026-01-10" },
  { sku: "SKU002", produto: "iPhone 14", categoria: "Smartphone", preco: 6000, estoque: 90, vendas: 40, receita: 240000, vendedor: "Ana", canal: "Fisico", data: "2026-01-12" },
  { sku: "SKU003", produto: "Notebook Dell Inspiron", categoria: "Notebook", preco: 5200, estoque: 60, vendas: 20, receita: 104000, vendedor: "Bruno", canal: "Online", data: "2026-01-15" },
  { sku: "SKU004", produto: "MacBook Air M2", categoria: "Notebook", preco: 9500, estoque: 30, vendas: 15, receita: 142500, vendedor: "Ana", canal: "Online", data: "2026-01-18" },
  { sku: "SKU005", produto: "Tablet Samsung S8", categoria: "Tablet", preco: 3200, estoque: 70, vendas: 22, receita: 70400, vendedor: "Carlos", canal: "Fisico", data: "2026-01-20" },
  { sku: "SKU006", produto: "iPad 10ª Geração", categoria: "Tablet", preco: 4000, estoque: 65, vendas: 18, receita: 72000, vendedor: "Bruno", canal: "Online", data: "2026-01-22" },
  { sku: "SKU007", produto: "Fone Bluetooth JBL", categoria: "Acessorios", preco: 500, estoque: 200, vendas: 80, receita: 40000, vendedor: "Ana", canal: "Fisico", data: "2026-01-25" },
  { sku: "SKU008", produto: "Mouse Logitech MX", categoria: "Acessorios", preco: 350, estoque: 150, vendas: 60, receita: 21000, vendedor: "Carlos", canal: "Online", data: "2026-01-28" },
  { sku: "SKU009", produto: "Teclado Mecânico Redragon", categoria: "Acessorios", preco: 450, estoque: 140, vendas: 55, receita: 24750, vendedor: "Bruno", canal: "Online", data: "2026-02-01" },
  { sku: "SKU010", produto: 'Monitor LG 27"', categoria: "Monitor", preco: 1800, estoque: 80, vendas: 25, receita: 45000, vendedor: "Ana", canal: "Fisico", data: "2026-02-03" },
  { sku: "SKU011", produto: 'Monitor Samsung 24"', categoria: "Monitor", preco: 1200, estoque: 95, vendas: 30, receita: 36000, vendedor: "Carlos", canal: "Online", data: "2026-02-05" },
  { sku: "SKU012", produto: "Smartwatch Apple Watch", categoria: "Smartwatch", preco: 3500, estoque: 50, vendas: 20, receita: 70000, vendedor: "Bruno", canal: "Fisico", data: "2026-02-07" },
  { sku: "SKU013", produto: "Smartwatch Samsung", categoria: "Smartwatch", preco: 2200, estoque: 60, vendas: 25, receita: 55000, vendedor: "Ana", canal: "Online", data: "2026-02-10" },
  { sku: "SKU014", produto: "SSD 1TB Kingston", categoria: "Componentes", preco: 600, estoque: 180, vendas: 70, receita: 42000, vendedor: "Carlos", canal: "Online", data: "2026-02-12" },
  { sku: "SKU015", produto: "Memória RAM 16GB", categoria: "Componentes", preco: 400, estoque: 170, vendas: 65, receita: 26000, vendedor: "Bruno", canal: "Fisico", data: "2026-02-15" },
  { sku: "SKU016", produto: "Placa de Vídeo RTX 4060", categoria: "Componentes", preco: 3200, estoque: 40, vendas: 12, receita: 38400, vendedor: "Ana", canal: "Online", data: "2026-02-18" },
  { sku: "SKU017", produto: "Placa de Vídeo RTX 4070", categoria: "Componentes", preco: 4500, estoque: 35, vendas: 10, receita: 45000, vendedor: "Carlos", canal: "Fisico", data: "2026-02-20" },
  { sku: "SKU018", produto: "Notebook Acer Aspire", categoria: "Notebook", preco: 3800, estoque: 75, vendas: 28, receita: 106400, vendedor: "Bruno", canal: "Online", data: "2026-02-22" },
  { sku: "SKU019", produto: "Notebook Lenovo IdeaPad", categoria: "Notebook", preco: 4200, estoque: 68, vendas: 26, receita: 109200, vendedor: "Ana", canal: "Fisico", data: "2026-02-25" },
  { sku: "SKU020", produto: "Smartphone Xiaomi 13", categoria: "Smartphone", preco: 3500, estoque: 110, vendas: 33, receita: 115500, vendedor: "Carlos", canal: "Online", data: "2026-02-28" },
  { sku: "SKU021", produto: "Carregador Turbo", categoria: "Acessorios", preco: 120, estoque: 300, vendas: 120, receita: 14400, vendedor: "Ana", canal: "Fisico", data: "2026-03-01" },
  { sku: "SKU022", produto: "Cabo USB-C", categoria: "Acessorios", preco: 80, estoque: 400, vendas: 150, receita: 12000, vendedor: "Bruno", canal: "Online", data: "2026-03-03" },
  { sku: "SKU023", produto: "Headset Gamer HyperX", categoria: "Acessorios", preco: 600, estoque: 130, vendas: 45, receita: 27000, vendedor: "Carlos", canal: "Online", data: "2026-03-05" },
  { sku: "SKU024", produto: 'Monitor Gamer 32"', categoria: "Monitor", preco: 2500, estoque: 55, vendas: 18, receita: 45000, vendedor: "Ana", canal: "Fisico", data: "2026-03-07" },
  { sku: "SKU025", produto: "Smartphone Motorola Edge", categoria: "Smartphone", preco: 2800, estoque: 95, vendas: 30, receita: 84000, vendedor: "Bruno", canal: "Online", data: "2026-03-10" },
  { sku: "SKU026", produto: "Tablet Lenovo M10", categoria: "Tablet", preco: 1500, estoque: 120, vendas: 40, receita: 60000, vendedor: "Carlos", canal: "Fisico", data: "2026-03-12" },
  { sku: "SKU027", produto: "Notebook Gamer ASUS", categoria: "Notebook", preco: 8500, estoque: 25, vendas: 12, receita: 102000, vendedor: "Ana", canal: "Online", data: "2026-03-15" },
  { sku: "SKU028", produto: "SSD 512GB Kingston", categoria: "Componentes", preco: 350, estoque: 210, vendas: 90, receita: 31500, vendedor: "Bruno", canal: "Online", data: "2026-03-18" },
  { sku: "SKU029", produto: "Memória RAM 8GB", categoria: "Componentes", preco: 200, estoque: 250, vendas: 100, receita: 20000, vendedor: "Carlos", canal: "Fisico", data: "2026-03-20" },
  { sku: "SKU030", produto: "Smartwatch Xiaomi", categoria: "Smartwatch", preco: 900, estoque: 140, vendas: 50, receita: 45000, vendedor: "Ana", canal: "Online", data: "2026-03-22" },
];

export const META_MENSAL = 800000; // R$ por mês

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const import { formatNumber, formatBRL } from "../lib/utils"; = (n: number) => n.toLocaleString("pt-BR");
