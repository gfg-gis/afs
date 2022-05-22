import { api, providesList } from ".";  
import { Response, Reports } from "models";

interface ReportChart {
  infected: 0 | 1;
  isChart: true | false;
}

interface ReportChartHistory {
  province_id: string;
  infected: number
}

interface ResponseReportChart {
  id: number;
  key: number;
  value: number;
  code: string; 
}

const reports = api.injectEndpoints({
  endpoints: (build) => ({
    createReport: build.mutation<Response<Reports>, Partial<Reports>>({
        query: (credentials) => ({
          url: `/reports`,
          method: "POST",
          body: JSON.stringify(credentials),
        }), 
        invalidatesTags: ["Report"],
    }),

    updateReport: build.mutation<Response<{ id: number, infected: number, updated_email: string, updated_name: string, updated_time: string }>, { id: number, updated_name: string | null | undefined, updated_email: string | null | undefined }>({
      query: (credentials) => ({
        url: `/reports/${credentials.id}`,
        method: "PATCH",
        body: JSON.stringify(credentials),
      }),  
      invalidatesTags: ["Report"], 
    }),

    getReports: build.query<Response<Reports>, { from_date: string, to_date: string, infected?: number }>({
      query: (query) => { 
        return {
          url: "/reports",
          params: query,
        };
      },
      providesTags: (result) => providesList(result?.data && result?.data?.length ? result.data : [], "Report"),
    }),

    getReportChart: build.query<Response<ResponseReportChart>, ReportChart>({
      query: (query) => { 
        return {
          url: "/reports",
          params: query,
        };
      },
    }),

    getReportChartHistory: build.query<Response<Reports>, ReportChartHistory>({
      query: (query) => { 
        return {
          url: "/reports",
          params: query,
        };
      }
    }),
  }),
});

export const { useCreateReportMutation, useUpdateReportMutation, useGetReportsQuery, useGetReportChartQuery, useGetReportChartHistoryQuery } = reports;
