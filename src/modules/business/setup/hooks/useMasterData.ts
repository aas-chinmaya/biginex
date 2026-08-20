"use client";

import { useEffect, useState } from "react";

import { masterService } from "../services/master.service";
import { MasterOption } from "../types";

/**
 * Loads all the "static" master lists once (business type, category,
 * industry, registration type, currency, timezone, financial year,
 * document type, country) needed across the wizard.
 */
export function useMasterData() {
  const [businessTypes, setBusinessTypes] = useState<MasterOption[]>([]);
  const [businessCategories, setBusinessCategories] = useState<
    MasterOption[]
  >([]);
  const [industries, setIndustries] = useState<MasterOption[]>([]);
  const [registrationTypes, setRegistrationTypes] = useState<
    MasterOption[]
  >([]);
   const [otherRegistrationTypes, setOtherRegistrationTypes] = useState<
    MasterOption[]
  >([]);
  const [currencies, setCurrencies] = useState<MasterOption[]>([]);
  const [timezones, setTimezones] = useState<MasterOption[]>([]);
  const [financialYears, setFinancialYears] = useState<MasterOption[]>([]);
  const [documentTypes, setDocumentTypes] = useState<MasterOption[]>([]);
  const [countries, setCountries] = useState<MasterOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const [
          typesRes,
          categoriesRes,
          industriesRes,
          registrationRes,
          currenciesRes,
          timezonesRes,
          financialYearsRes,
          documentTypesRes,
          countriesRes,
        ] = await Promise.all([
          masterService.getBusinessTypes(),
          masterService.getBusinessCategories(),
          masterService.getIndustries(),
          masterService.getRegistrationTypes(),
          masterService.getCurrencies(),
          masterService.getTimezones(),
          masterService.getFinancialYears(),
          masterService.getDocumentTypes(),
          masterService.getCountries(),
        ]);

        if (!mounted) return;

        setBusinessTypes(typesRes.data);
        setBusinessCategories(categoriesRes.data);
        setIndustries(industriesRes.data);
        setRegistrationTypes(registrationRes.data);
        setCurrencies(currenciesRes.data);
        setTimezones(timezonesRes.data);
        setFinancialYears(financialYearsRes.data);
        setDocumentTypes(documentTypesRes.data);
        setCountries(countriesRes.data);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    businessTypes,
    businessCategories,
    industries,
    registrationTypes,
    otherRegistrationTypes,
    currencies,
    timezones,
    financialYears,
    documentTypes,
    countries,
    loading,
  };
}

/**
 * Cascading country -> state -> city selects. Give it the current
 * countryId / stateId (from the form) and it fetches the right
 * child list whenever the parent changes.
 */
export function useLocationOptions(countryId?: string, stateId?: string) {
  const [statesList, setStatesList] = useState<MasterOption[]>([]);
  const [citiesList, setCitiesList] = useState<MasterOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setStatesList([]);
      return;
    }

    let mounted = true;
    setLoadingStates(true);

    masterService
      .getStates(countryId)
      .then((res) => mounted && setStatesList(res.data))
      .finally(() => mounted && setLoadingStates(false));

    return () => {
      mounted = false;
    };
  }, [countryId]);

  useEffect(() => {
    if (!stateId) {
      setCitiesList([]);
      return;
    }

    let mounted = true;
    setLoadingCities(true);

    masterService
      .getCities(stateId)
      .then((res) => mounted && setCitiesList(res.data))
      .finally(() => mounted && setLoadingCities(false));

    return () => {
      mounted = false;
    };
  }, [stateId]);

  return {
    states: statesList,
    cities: citiesList,
    loadingStates,
    loadingCities,
  };
}
