import { Col, Grid, Row } from "antd";
import { useGetReportChartQuery } from "api";
import { PageLoading } from "components";
import React from "react";
import { BarChart, Chart, HighLightCard, Infomation } from "./components";

const { useBreakpoint } = Grid;

export const Dashboard = () => {
	const { md } = useBreakpoint();

	const { data: dataReportChart, isFetching } = useGetReportChartQuery(
		{
			infected: 1,
			isChart: true,
		},
		{ refetchOnMountOrArgChange: true }
	);

	if (isFetching) return <PageLoading />;

	return (
		<Row style={{ padding: "40px 0px" }}>
			<Col span={24}>
				<Row gutter={[30, 30]}>
					{md && (
						<Col span={24}>
							<HighLightCard />
						</Col>
					)}

					{md && (
						<Col span={12}>
							<Infomation dataReportChart={dataReportChart?.data || []} />
						</Col>
					)}

					<Col xs={24} md={12}>
						<Chart dataReportChart={dataReportChart?.data || []} />
					</Col>

					{md && (
						<Col span={24}>
							<BarChart />
						</Col>
					)}
				</Row>
			</Col>
		</Row>
	);
};
