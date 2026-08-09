import { configureStore } from "@reduxjs/toolkit";
import { bookSlice, userSlice } from "./slice";


export const store = configureStore({
    reducer: {
        Books : bookSlice.reducer,
        User : userSlice.reducer
    }
})
