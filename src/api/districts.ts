import { api } from ".";  
import { Response, Districts } from "models";  

const districts = api.injectEndpoints({
  endpoints: (build) => ({
    getDistricts: build.query<Response<Districts>, { matp: string }>({
      query: (params) => {
        return {
          url: "/districts",
          params 
        }
      }
    }),
  }),
});

export const { useGetDistrictsQuery } = districts;
