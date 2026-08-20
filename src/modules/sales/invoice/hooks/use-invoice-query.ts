"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "@/store/store";

import {
  fetchInvoices,
  fetchDrafts,
  fetchInvoiceById,
  fetchDraftById,
} from "../slice/invoice.slice";

export function useInvoiceQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    invoices,
    drafts,
    selectedInvoice,
    selectedDraft,
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.invoice,
  );

  const getInvoices = () => {
    return dispatch(fetchInvoices());
  };

  const getDrafts = () => {
    return dispatch(fetchDrafts());
  };

  const getInvoiceById = (id: string) => {
    return dispatch(fetchInvoiceById(id));
  };

  const getDraftById = (id: string) => {
    return dispatch(fetchDraftById(id));
  };

  return {
    // Data
    invoices,
    drafts,
    selectedInvoice,
    selectedDraft,

    // State
    loading,
    error,

    // Queries
    getInvoices,
    getDrafts,
    getInvoiceById,
    getDraftById,
  };
}