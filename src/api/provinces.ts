import { Provinces, Response } from "models";
import { api } from ".";

const provinces = api.injectEndpoints({
	endpoints: (build) => ({
		getProvinces: build.query<Response<Provinces>, void>({
			query: () => "/provinces",
			providesTags: ["Province"],
		}),
	}),
});

export const { useGetProvincesQuery } = provinces;
