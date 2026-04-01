import { useEffect } from "react";
import { useRouter } from "next/router";

const ShopGrid = () => {
  const router = useRouter();
  useEffect(() => { router.replace("/product-details"); }, []);
  return null;
};

export default ShopGrid;
