import OrderDetail from "./OrderDetail";
interface OrderDetailsProps {
  searchParams: { id?: string };
}

export default async function OrderDetails({
  searchParams,
}: OrderDetailsProps) {
  const { id = "" } = await Promise.resolve(searchParams);

  return <OrderDetail id={id} />;
}
