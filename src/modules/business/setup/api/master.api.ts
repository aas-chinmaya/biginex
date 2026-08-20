import api from "@/services/api";

import { MasterOption } from "../types";
import {
  businessTypes,
  businessCategories,
  industries,
  registrationTypes,
  currencies,
  timezones,
  financialYears,
  documentTypes,
  countries,
  states,
  cities,
} from "../data/masterData";

// ============================================================
// Master data API.
//
// The setup wizard uses the backend master tables for fields such as
// business categories, industries, registration types and currencies.
// If the API request fails, it falls back to the local mock data so the
// form still works in development.
// ============================================================

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MASTER_MOCK === "true";

type MasterApiEnvelope = {
  status?: number;
  message?: string;
  data?: unknown;
};

function mock<T>(data: T, delay = 250): Promise<{ data: T }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data }), delay)
  );
}

function toMasterOption(item: unknown): MasterOption {
  if (typeof item === "string" || typeof item === "number") {
    return { id: String(item), name: String(item) };
  }

  if (!item || typeof item !== "object") {
    return { id: "", name: "" };
  }

  const record = item as Record<string, unknown>;

  const id =
    record.id ??
    record.categoryId ??
    record.currencyId ??
    record.industryId ??
    record.registrationTypeId ??
    record.value ??
    "";

  const name =
    record.name ??
    record.categoryName ??
    record.currencyName ??
    record.industryName ??
    record.registrationName ??
    record.label ??
    "";

  const meta =
    record.meta ??
    record.currencySymbol ??
    record.symbol ??
    record.code ??
    record.icon ??
    undefined;

  const parentId = record.parentId ?? record.countryId ?? record.stateId ?? undefined;

  return {
    id: String(id),
    name: String(name),
    meta: meta ? String(meta) : undefined,
    parentId: parentId ? String(parentId) : undefined,
  };
}

function normalizeOptions(payload: unknown, fallback: MasterOption[]) {
  if (Array.isArray(payload)) {
    return payload.map(toMasterOption);
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const nested =
      Array.isArray(record.data) ? record.data :
      Array.isArray(record.items) ? record.items :
      Array.isArray(record.result) ? record.result : undefined;

    if (nested) {
      return nested.map(toMasterOption);
    }
  }

  return fallback;
}

async function requestOptions(endpoint: string, fallback: MasterOption[]) {
  if (USE_MOCK) {
    return mock(fallback);
  }

  try {
    const { data } = await api.get<MasterApiEnvelope>(endpoint);
    return { data: normalizeOptions(data, fallback) };
  } catch {
    return mock(fallback);
  }
}

export const masterApi = {
  getBusinessTypes() {
    return USE_MOCK ? mock(businessTypes) : mock(businessTypes);
  },

  getBusinessCategories() {
    return requestOptions("/categories/getAllCategories", businessCategories);
  },

  getIndustries() {
    return requestOptions("/industries/getAllIndustries", industries);
  },

  getRegistrationTypes() {
    return requestOptions(
      "/registration-types/getAllRegistrationTypes",
      registrationTypes
    );
  },

  getCurrencies() {
    return requestOptions("/currencies/getAllCurrencies", currencies);
  },

  getTimezones() {
    return USE_MOCK ? mock(timezones) : mock(timezones);
  },

  getFinancialYears() {
    return USE_MOCK ? mock(financialYears) : mock(financialYears);
  },

  getDocumentTypes() {
    return USE_MOCK ? mock(documentTypes) : mock(documentTypes);
  },

  getCountries() {
    return USE_MOCK ? mock(countries) : mock(countries);
  },

  getStates(countryId: string) {
    return USE_MOCK
      ? mock(states.filter((s) => s.parentId === countryId))
      : mock(states.filter((s) => s.parentId === countryId));
  },

  getCities(stateId: string) {
    return USE_MOCK
      ? mock(cities.filter((c) => c.parentId === stateId))
      : mock(cities.filter((c) => c.parentId === stateId));
  },
};
