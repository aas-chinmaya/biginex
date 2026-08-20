import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";


import { item } from "../types";


interface State {

    items: item[];

    loading: boolean;

}


const initialState: State = {

    items: [],

    loading: false,

};


const itemslice = createSlice({

    name: "items",

    initialState,


    reducers: {


        setitems(
            state,
            action: PayloadAction<item[]>
        ) {

            state.items =
                action.payload;

        },


        additem(
            state,
            action: PayloadAction<item>
        ) {

            state.items.push(
                action.payload
            );

        },


        removeitem(
            state,
            action: PayloadAction<string>
        ) {

            state.items =
                state.items.filter(
                    p => p.id !== action.payload
                );

        }


    }


});


export const {
    setitems,
    additem,
    removeitem

} = itemslice.actions;


export default itemslice.reducer;