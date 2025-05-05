import type { Metadata } from "next";
import SearchPage from "./SearchPage";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;

  return {
    title: q ? `Results for "${q}" | LynxLine` : "Search | LynxLine",
    description: q
      ? `Explore results for "${q}" on LynxLine — your accessories store.`
      : "Search products on LynxLine — your accessories store.",
  };
}

export default function Search() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SearchPage />
    </div>
  );
}
