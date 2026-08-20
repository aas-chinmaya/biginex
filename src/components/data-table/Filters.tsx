"use client";

import { useState } from "react";


interface FilterOption {
    label: string;
    value: string;
}


export interface FilterItem {

    label: string;

    key: string;

    options: FilterOption[];

}


interface FiltersProps {

    filters: FilterItem[];

    onChange: (value: Record<string, string>) => void;

}



export default function Filters({
    filters,
    onChange,
}: FiltersProps) {


    const [selected, setSelected] =
        useState<Record<string, string>>({});



    function handleChange(
        key: string,
        value: string
    ) {

        const updated = {
            ...selected,
            [key]: value
        };


        setSelected(updated);

        onChange(updated);

    }



    return (

        <div className="flex flex-wrap gap-3">


            {
                filters.map((filter) => (

                    <select

                        key={filter.key}

                        value={
                            selected[filter.key] || ""
                        }

                        onChange={(e) =>
                            handleChange(
                                filter.key,
                                e.target.value
                            )
                        }

                        className="
              h-10
              rounded-lg
              border
              px-3
              text-sm
              bg-white
            "

                    >

                        <option value="">
                            {filter.label}
                        </option>


                        {
                            filter.options.map(option => (

                                <option

                                    key={option.value}

                                    value={option.value}

                                >

                                    {option.label}

                                </option>

                            ))
                        }


                    </select>

                ))
            }


        </div>

    );
}