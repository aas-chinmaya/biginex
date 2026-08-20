"use client";


import {
    useEffect,
    useState
} from "react";


import {
    itemservice
} from "../services/item.service";


import {
    item
} from "../types";


export function useitems() {

    const [items, setitems]
        =
        useState<item[]>([]);


    const [loading, setLoading]
        =
        useState(false);



    async function fetchitems() {

        try {

            setLoading(true);

            const res =
                await itemservice.getitems();

            setitems(
                res.data
            );


        }
        finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchitems();

    }, []);



    return {

        items,

        loading,

        refetch: fetchitems

    };


}