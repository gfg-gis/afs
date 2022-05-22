import { api } from ".";  

import { Response, Wards } from "models";  


const wards = api.injectEndpoints({
  endpoints: (build) => ({
    getWards: build.query<Response<Wards>, { maqh: string }>({
      query: (params) => {
        return {
          url: "/wards",
          params 
        }
      }
    }),
  }),
});

export const { useGetWardsQuery } = wards;
