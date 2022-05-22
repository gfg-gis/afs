import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    email: null | string;
    fullName: null | string;
    id: null | string;
    jobTitle: null | string;
    officeLocation: null | string;
}

interface User {
    accessToken: null | string;
    info: null | UserInfo;
    role: null | string;
}

const initialState: User = {
    accessToken: null,
    info: null,
    role: null,
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateAccessToken: (state, action: PayloadAction<string>) => { 
            state.accessToken = action.payload; 
        },
        updateUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.info = action.payload;
        },
        updateUserRole: (state, action: PayloadAction<string>) => { 
            state.role = action.payload;
        },
        userLogout: (state) => {
            state.accessToken = null;
            state.info = null;
            state.role = null;
        }, 
      },
})

export const { updateAccessToken, updateUserInfo, updateUserRole, userLogout } = user.actions;

export const userReducer =  user.reducer;