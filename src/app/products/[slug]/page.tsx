import SingleProduct from "../singleProduct";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <SingleProduct slug={slug} />;
}
