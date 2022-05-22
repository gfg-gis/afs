import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { AuthenticationResult } from "@azure/msal-browser";

import { loginRequest } from "../config/authConfig";

import Header from "components/Header";
import { PageLoading } from "components";

import { useGetUserInfoByOutLookQuery, useGetUserRoleByEmailQuery } from "api";
import { useAppDispatch, useAppSelector } from "store";
import { updateAccessToken } from "slice";

export const AdminLayout = () => {
   const dispatch = useAppDispatch();
   const accessToken = useAppSelector(state => state.user.accessToken);
   const userInfo = useAppSelector(state => state.user.info);

   const isAuthenticated = useIsAuthenticated();
   const { instance, accounts } = useMsal();

   const { isLoading: isLoadingGetUserInfoByOutLook, isError } = useGetUserInfoByOutLookQuery(accessToken);
   const { isLoading: isLoadingGetUserRoleByEmail } = useGetUserRoleByEmailQuery(userInfo?.email ?? skipToken);


   useEffect(() => {
      if (!isError) return;

      const requestAccessToken = async () => {
         if (!isAuthenticated || !accounts || !accounts.length) return;

         const request = {
            ...loginRequest,
            account: accounts[0],
         };

         instance
            .acquireTokenSilent(request)
            .then((response: AuthenticationResult) => {
               dispatch(updateAccessToken(response.accessToken));
            })
            .catch((e) => {
               console.log(e);
            });
      };

      requestAccessToken();
   }, [isError, dispatch, instance, isAuthenticated, accounts]);

   if (isLoadingGetUserInfoByOutLook || isLoadingGetUserRoleByEmail) return <PageLoading />;

   return (
      <>
         <Header />
         <Outlet />
      </>
   );
};
