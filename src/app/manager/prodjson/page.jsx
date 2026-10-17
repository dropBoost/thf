import { getProducts } from "@/lib/shopify/shopify";

export default async function ProdJSON() {
  const { nodes: products } = await getProducts({ first: 5 });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">JSON prodotti Shopify</h1>

      <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm text-green-300">
        {JSON.stringify(products, null, 2)}
      </pre>
    </main>
  );
}