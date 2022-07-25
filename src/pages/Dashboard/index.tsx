import { Col, DatePicker, Grid, Row, Typography, Space } from "antd";
import { useGetReportChartQuery } from "api";
import { PageLoading } from "components";
import moment, { Moment } from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Chart, HighLightCard } from "./components";

const { useBreakpoint } = Grid;

const { Title } = Typography;

const { RangePicker } = DatePicker;

export const Dashboard = () => {
	const { md } = useBreakpoint();

	const { t } = useTranslation();

	const [fromDate, setFromDate] = useState<Moment>(moment().subtract(7, "days"));
	const [toDate, setToDate] = useState<Moment>(moment());

	const { data: dataReportChart, isFetching } = useGetReportChartQuery(
		{
			infected: 1,
			isChart: true,
			from_date: fromDate.format("YYYY-MM-DD"),
			to_date: toDate.format("YYYY-MM-DD"),
		},
		{ refetchOnMountOrArgChange: true }
	);

	if (isFetching) return <PageLoading />;

	return (
		<Row gutter={[40, 40]} justify="center" style={{ padding: "40px 0px" }}>
			<Col span={24}>
				<Space direction="vertical" size={0}>
					<Title level={5}>{t("Report Date")}</Title>
					<RangePicker
						onChange={(e) => {
							if (!e) return;
							setFromDate(e[0] as Moment);
							setToDate(e[1] as Moment);
						}}
						defaultValue={[fromDate, toDate]}
						format={"DD-MM-YYYY"}
					/>
				</Space>
			</Col>

			{md && (
				<Col span={24}>
					<HighLightCard fromDate={fromDate.format("YYYY-MM-DD")} toDate={toDate.format("YYYY-MM-DD")} />
				</Col>
			)}

			{/* {md && (
				<Col span={12}>
					<Infomation />
				</Col>
			)} */}

			<Col span={24}>
				<Chart dataReportChart={dataReportChart?.data || []} />
			</Col>

			{md && (
				<Col span={24}>
					<BarChart fromDate={fromDate.format("YYYY-MM-DD")} toDate={toDate.format("YYYY-MM-DD")} />
				</Col>
			)}
		</Row>
	);
};
