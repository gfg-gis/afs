import { Radio, Space, Typography, Empty } from "antd";
import { useGetReportChartQuery } from "api";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { COLOR_INFO } from "../../../constants";

const { Title, Text } = Typography;

const initOptions = {
	accessibility: {
		enabled: false,
	},
	title: {
		text: null,
	},
	chart: {
		type: "column",
	},
	credits: {
		enabled: false,
	},
	xAxis: {
		type: "category",
		crosshair: true,
	},
	yAxis: {
		min: 0,
		title: {
			text: null,
		},
	},
	tooltip: {
		headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		pointFormat:
			'<tr><td style="padding:0">{series.name}: </td>' +
			'<td style="padding:0"><b>{point.y}</b></td></tr>',
		footerFormat: "</table>",
		shared: true,
		useHTML: true,
	},
	legend: {
		enabled: false,
	},
	plotOptions: {
		series: {
			pointWidth: 40,
		},
	},
	series: [
		{
			name: "Số lượng",
		},
	],
};

export const BarChart = () => {
	const { t } = useTranslation();

	const [size, setSize] = useState("day");
	const [fromDate, setFromDate] = useState(moment().subtract(1, "days").format("YYYY-MM-DD"));
	const [options, setOptions] = useState({});

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const { data: dataReportChart } = useGetReportChartQuery(
		{
			infected: 1,
			isChart: true,
			from_date: fromDate,
			to_date: moment().format("YYYY-MM-DD"),
		},
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (!dataReportChart?.data?.length) return;

		const newData = dataReportChart.data.map((item) => {
			return {
				name: item.province,
				y: item.value,
			};
		});

		setOptions({
			...initOptions,
			series: [
				{
					...initOptions.series[0],
					data: newData,
				},
			],
		});
	}, [dataReportChart]);

	return (
		<Space
			direction="vertical"
			style={{
				borderRadius: 6,
				borderTop: `1px solid ${COLOR_INFO}`,
				boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
				width: "100%",
			}}>
			<div
				style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Space direction="vertical">
					<Title level={3} style={{ marginBottom: 0 }}>
						{t("Infected Area By Day")}
					</Title>
					<Text type="secondary">
						{moment(fromDate).format("DD/MM/YYYY")} - {moment().format("DD/MM/YYYY")}
					</Text>
				</Space>
				<Radio.Group
					value={size}
					onChange={(e) => {
						const value = e.target.value;
						setSize(value);
						if (value === "day") {
							setFromDate(moment().subtract(1, "days").format("YYYY-MM-DD"));
						} else if (value === "week") {
							setFromDate(moment().subtract(7, "days").format("YYYY-MM-DD"));
						} else {
							setFromDate(moment().subtract(30, "days").format("YYYY-MM-DD"));
						}
					}}>
					<Radio.Button value="day">{t("Day")}</Radio.Button>
					<Radio.Button value="week">{t("Week")}</Radio.Button>
					<Radio.Button value="month">{t("Month")}</Radio.Button>
				</Radio.Group>
			</div>
			{dataReportChart?.data?.length ? (
				<HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
			)}
		</Space>
	);
};
