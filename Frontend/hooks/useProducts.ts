import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import useAxiosConfig from "./useAxiosConfig";

export type Product = {
  id: string;
  productNumber: number;
  hasBeenSent: boolean;
};

const useProducts = (queryParams?: Object) => {
  const sharedAxiosConfig = useAxiosConfig();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(() => {
    axios
      .get("/GetProducts", {
        params: queryParams,
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setProducts(data);
      });
  }, [sharedAxiosConfig]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, refetchProducts: fetchProducts };
};

export default useProducts;
