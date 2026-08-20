"use client";

import { SearchIcon } from "lucide-react";


interface Props {

    placeholder?: string;

    value: string;

    onChange: (value: string) => void;

}



export default function Search({

    placeholder = "Search",

    value,

    onChange

}: Props) {


    return (

        <div className="relative">


            <SearchIcon
                className="
absolute
left-3
top-1/2
h-4
w-4
-translate-y-1/2
text-gray-400
"
            />


            <input

                value={value}

                onChange={(e) =>
                    onChange(e.target.value)
                }

                placeholder={placeholder}

                className="
h-10
rounded-lg
border
pl-10
pr-3
outline-none
focus:ring-2
focus:ring-primary
"

            />


        </div>

    )

}