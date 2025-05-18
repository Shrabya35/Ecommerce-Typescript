export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
  category: string;
  quantity: number;
  image?: {
    data: string;
    contentType: string;
  };
}
