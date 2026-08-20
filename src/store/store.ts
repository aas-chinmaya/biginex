import { configureStore } from "@reduxjs/toolkit";
import mastersReducer from "@/modules/masters/store/masterSlice";
import roleAccessReducer from "@/modules/roleAccess/store/roleAccessSlice";
import userReducer from "@/modules/users/store/userSlice";
import authReducer from "@/modules/auth/store/authSlice";
import vendorReducer from "@/modules/vendor/store/vendorSlice";
import businessReducer from "@/modules/business/store/businessSlice";

//sales modules
import invoiceReducer from "@/modules/sales/invoice/slice/invoice.slice";
import invoiceItemReducer from "@/modules/sales/invoice/slice/invoiceItem-slice";
import customersReducer from "@/modules/customers/store/customers.slice";

const store = configureStore({
  reducer: {
    masters: mastersReducer,
    roleAccess: roleAccessReducer,
    users: userReducer,
    auth: authReducer,
    vendors: vendorReducer,
    invoice: invoiceReducer,
    invoiceItem: invoiceItemReducer,
        customers: customersReducer,

    business: businessReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
