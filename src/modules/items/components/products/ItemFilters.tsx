"use client";


import Filters from "@/components/data-table/Filters";


interface Props {

    onChange: (value: any) => void;

}


export default function itemFilters({
    onChange
}: Props) {


    return (

        <Filters

            filters={[

                {
                    label: "Category",

                    key: "category",

                    options: [

                        {
                            label: "Electronics",
                            value: "electronics"
                        },

                        {
                            label: "Grocery",
                            value: "grocery"
                        },

                        {
                            label: "Pharmacy",
                            value: "pharmacy"
                        }

                    ]

                },


                {
                    label: "Stock",

                    key: "stock",

                    options: [

                        {
                            label: "Available",
                            value: "available"
                        },

                        {
                            label: "Low Stock",
                            value: "low"
                        }

                    ]

                }

            ]}


            onChange={onChange}

        />

    )

}