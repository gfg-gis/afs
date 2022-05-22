import { api } from ".";    
import { Response, Users } from "models";
import { updateUserInfo, updateUserRole } from "slice";

interface UserInfoByOutLook {
    "@odata.context": null | string;
    businessPhones: null | Array<string>;
    displayName: null | string;
    givenName: null | string;
    id: null | string;
    jobTitle: null | string;
    mail: null | string;
    mobilePhone: null | string;
    officeLocation: null | string;
    preferredLanguage: null | string;
    surname: null | string;
    userPrincipalName: null | string;
}

interface NewResponse extends Omit<Response<Users>, "data"> {
  data: Users
}

const users = api.injectEndpoints({
  endpoints: (build) => ({
    getUserInfoByOutLook: build.query<UserInfoByOutLook, string | null>({
        query: (accessToken) => {
          const headers = new Headers();
          const bearer = `Bearer ${accessToken}`;
  
          headers.append("Authorization", bearer);
  
          return {
            url: process.env.REACT_APP_GRAPH_ME_ENDPOINT || "",
            headers,
          };
        },
        async onQueryStarted(accessToken, { dispatch, queryFulfilled }) {
            try {
              const { data } = await queryFulfilled;
              const {
                  displayName: fullName,
                  jobTitle,
                  id,
                  mail: email,
                  officeLocation,
              } = data;

              const info = {
                  id,
                  email,
                  fullName,
                  jobTitle,
                  officeLocation,
              };  

              dispatch(updateUserInfo(info));
              
            } catch (err) {
            // console.log(err);
            }
        },
    }),

    getUserRoleByEmail: build.query<NewResponse, string>({
      query: (email) => {
        return {
          url: "/users",
          params: { email },
        };
      },
      async onQueryStarted(email, { dispatch, queryFulfilled }) {
        try {
          const { data: Data } = await queryFulfilled;
          const { status } = Data;
          if(Data.data && status === "success") {
            dispatch(updateUserRole(Data.data?.role));
          }
          
        } catch (err) {
          // console.log(err);
        }
      },
    }),

    createUser: build.mutation<Response<Users>, Partial<Users>>({
      query: (credentials) => ({
        url: `/users`,
        method: "POST",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ["User"],
    }),

    getUserByCreatedBy: build.query<Response<Users>, string>({
      query: (created_by) => {
        return {
          url: "/users",
          params: { created_by },
        };
      },
      providesTags: ["User"],
    }),

    deleteUser: build.mutation<Response<Users>, { id: number, created_by: string }>({
      query: (credentials) => ({
        url: `users/${credentials.id}`,
        method: "DELETE",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserInfoByOutLookQuery, useGetUserRoleByEmailQuery, useCreateUserMutation, useGetUserByCreatedByQuery, useDeleteUserMutation } = users;


 