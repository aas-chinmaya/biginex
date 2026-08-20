"use client";

import { useEffect, useState } from "react";
import { ProductRow } from "../types";
import { productservice } from "../services/product.service";

export function useProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchProducts(nextPage = 1) {
    try {
      setLoading(true);
      const response = await productservice.getProducts(nextPage, 10);
      const payload = response?.data?.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      const normalizedList = list.map((product: any) => ({
        ...product,
        id: String(product?.id ?? product?._id ?? product?.productId ?? product?.itemId ?? ""),
      }));

      setProducts(normalizedList);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || normalizedList.length));
    } finally {
      setLoading(false);
    }
  }

  async function changeProductStatus(id: string, status: boolean) {
    try {
      await productservice.updateProductStatus(id, status);
      await fetchProducts(page);
    } catch (error: any) {
      throw error;
    }
  }

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return {
    products,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchProducts,
    setPage,
    changeProductStatus,
  };
}
