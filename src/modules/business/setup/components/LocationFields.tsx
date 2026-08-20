"use client";

import { useFormContext } from "react-hook-form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { FormField } from "@/components/form";

import { MasterOption } from "../types";
import { useLocationOptions } from "../hooks/useMasterData";

interface Props {
  /** e.g. "address" or `branches.0` */
  namePrefix: string;
  countries: MasterOption[];
}

export default function LocationFields({ namePrefix, countries }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const countryId = watch(`${namePrefix}.countryId`);
  const stateId = watch(`${namePrefix}.stateId`);

  const { states, cities, loadingStates, loadingCities } = useLocationOptions(
    countryId,
    stateId
  );

  const path = (name: string) => `${namePrefix}.${name}`;
  const errorAt = (name: string): string | undefined => {
    const parts = path(name).split(".");
    let value: unknown = errors;

    for (const part of parts) {
      if (typeof value !== "object" || value === null) {
        return undefined;
      }

      const record = value as Record<string, unknown>;
      if (!(part in record)) {
        return undefined;
      }

      value = record[part];
    }

    if (typeof value === "object" && value !== null && "message" in value) {
      const message = (value as { message?: unknown }).message;
      return typeof message === "string" ? message : undefined;
    }

    return undefined;
  };

  return (
    <>
      <FormField label="Country" required error={errorAt("countryId")}>
        <Select
          value={countryId}
          onValueChange={(value) => {
            setValue(path("countryId"), value, { shouldValidate: true });
            setValue(path("stateId"), "");
            setValue(path("cityId"), "");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="State" required error={errorAt("stateId")}>
        <Select
          value={stateId}
          disabled={!countryId || loadingStates}
          onValueChange={(value) => {
            setValue(path("stateId"), value, { shouldValidate: true });
            setValue(path("cityId"), "");
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingStates ? "Loading..." : "Select state"}
            />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="City" required error={errorAt("cityId")}>
        <Select
          value={watch(path("cityId"))}
          disabled={!stateId || loadingCities}
          onValueChange={(value) =>
            setValue(path("cityId"), value, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingCities ? "Loading..." : "Select city"}
            />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </>
  );
}
