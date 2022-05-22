import { api } from ".";  
import { Response, Provinces } from "models"; 

const provinces = api.injectEndpoints({
  endpoints: (build) => ({
    getProvinces: build.query<Response<Provinces>, void>({
      query: () => "/provinces"
    }),
  }),
});

export const { useGetProvincesQuery } = provinces;
