"use client";

import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store/store";

import {
  createDraft,
  updateDraft,
  deleteDraft,
  finalizeDraft,
  createInvoice,
  cancelInvoice,
  deleteInvoice,
} from "../slice/invoice.slice";

import type {
  CreateDraftPayload,
  UpdateDraftPayload,
  FinalizeDraftPayload,
  CreateInvoicePayload,
} from "../types/invoice-api.types";

export function useInvoiceActions() {
  const dispatch = useDispatch<AppDispatch>();

  // ---------------------------------------------------------
  // Draft Actions
  // ---------------------------------------------------------

  const handleCreateDraft = (
    data: CreateDraftPayload,
  ) => {
    return dispatch(createDraft(data));
  };

  const handleUpdateDraft = (
    id: string,
    data: UpdateDraftPayload,
  ) => {
    return dispatch(
      updateDraft({
        id,
        data,
      }),
    );
  };

  const handleDeleteDraft = (
    id: string,
  ) => {
    return dispatch(deleteDraft(id));
  };

  const handleFinalizeDraft = (
    id: string,
    data?: FinalizeDraftPayload,
  ) => {
    return dispatch(
      finalizeDraft({
        id,
        data,
      }),
    );
  };

  // ---------------------------------------------------------
  // Invoice Actions
  // ---------------------------------------------------------

  const handleCreateInvoice = (
    data: CreateInvoicePayload,
  ) => {
    return dispatch(createInvoice(data));
  };

  const handleCancelInvoice = (
    id: string,
  ) => {
    return dispatch(cancelInvoice(id));
  };

  const handleDeleteInvoice = (
    id: string,
  ) => {
    return dispatch(deleteInvoice(id));
  };

  return {
    // Draft
    createDraft: handleCreateDraft,
    updateDraft: handleUpdateDraft,
    deleteDraft: handleDeleteDraft,
    finalizeDraft: handleFinalizeDraft,

    // Invoice
    createInvoice: handleCreateInvoice,
    cancelInvoice: handleCancelInvoice,
    deleteInvoice: handleDeleteInvoice,
  };
}