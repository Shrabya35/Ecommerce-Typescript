import ViewAllPage from "./ViewAll";
import { Metadata } from "next";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

async function getTitle(searchParams: Props["searchParams"]): Promise<string> {
  const resolvedParams = await searchParams;

  const category = resolvedParams?.category;
  const type = resolvedParams?.type;
  const onSale = resolvedParams?.onSale;
  const sort = resolvedParams?.sort;
  const price = resolvedParams?.price;

  if (onSale === "true") {
    return "On Sale Items | LynxLine";
  } else if (category) {
    return `${category} Products | LynxLine`;
  } else if (type) {
    return `All ${type} Products | LynxLine`;
  } else if (sort) {
    const sortMap: Record<string, string> = {
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
      newest: "Newest Arrivals",
      popular: "Most Popular",
    };
    return `Products - ${sortMap[sort] || `Sorted by ${sort}`} | LynxLine`;
  } else if (price) {
    return `Price Range: ${price} | LynxLine`;
  }

  return "View All Products | LynxLine";
}
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const title = await getTitle(searchParams);

  return {
    title,
    description:
      "Review your selected items and proceed to checkout. LynxLine.",
  };
}

export default function ProductPage({ searchParams }: Props) {
  return <ViewAllPage />;
}
