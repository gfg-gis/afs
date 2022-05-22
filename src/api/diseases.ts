import { api } from ".";   
import { Response, Diseases } from "models";

const diseases = api.injectEndpoints({
  endpoints: (build) => ({
    getDiseases: build.query<Response<Diseases>, void>({
      query: () => "/diseases"
    }),
  }),
});

export const { useGetDiseasesQuery } = diseases;
