import SingleProduct from "../singleProduct";
import { Metadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  return {
    title: `${params.slug} | LynxLine`,
    description: `View details about the product "${params.slug}". Find the best deals on LynxLine.`,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <SingleProduct slug={params.slug} />;
}
