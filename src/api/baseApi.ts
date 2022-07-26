import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function providesList<R extends { id: string | number }[], T extends string>(
	resultsWithIds: R | undefined,
	tagType: T
) {
	return resultsWithIds
		? [{ type: tagType, id: "LIST" }, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
		: [{ type: tagType, id: "LIST" }];
}

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_BASE_URL,
	}),

	tagTypes: ["Report", "User", "Province"],

	endpoints: () => ({}),
});
