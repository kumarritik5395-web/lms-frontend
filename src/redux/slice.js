import { createSlice } from "@reduxjs/toolkit";

export const bookSlice = createSlice({
    name: "Books",
    initialState: [],
    reducers: {
        setBooks: (state, action) => action.payload,
        updateBook: (state, action) => {
            const updated = action.payload;
            return state.map(b=>b._id===updated._id ? updated:b)
        }
    }
})

export const userSlice = createSlice({
    name: "User",
    initialState: JSON.parse(localStorage.getItem("user")) || null,
    reducers: {
        setUser: (state, action) => action.payload,
        clearUser: () => null
    }
})

export const {setBooks, updateBook} = bookSlice.actions;
export const {setUser, clearUser} = userSlice.actions;