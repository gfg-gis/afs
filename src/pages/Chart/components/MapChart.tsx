import { Col, Row } from "antd";
import { useGetReportChartQuery } from "api";
import { PageLoading, TitleCustom } from "components";
import Highchart from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import mapData from "config/vi-all.geo.json";

highchartsMap(Highchart);

interface MapChartProps {
	handleClickChart: (_this: any) => void;
}

const MapChart = ({ handleClickChart }: MapChartProps) => {
	const { t } = useTranslation();

	const [option, setOption] = useState({});

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const { data: dataReportChart, isFetching } = useGetReportChartQuery(
		{
			infected: 1,
			isChart: true,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const initOptions = useMemo(() => {
		return {
			accessibility: {
				enabled: false,
			},
			chart: {
				animation: false,
				height: 600,
			},
			title: {
				text: null,
			},
			mapNavigation: {
				enabled: true,
				enableButtons: false,
			},
			colorAxis: {
				min: 0,
				stops: [
					[0.2, "#FFC4AA"],
					[0.4, "#FF8A66"],
					[0.6, "#FF392B"],
					[0.8, "#B71525"],
					[1, "#7A0826"],
				],
			},
			legend: {
				layout: "vertical",
				align: "right",
				verticalAlign: "bottom",
			},
			plotOptions: {
				series: {
					cursor: "pointer",
					point: {
						events: {
							click: function () {
								handleClickChart(this as any);
							},
						},
					},
				},
			},
			series: [
				{
					name: "Số lượng",
					states: {
						hover: {
							color: "#BADA55",
						},
					},
				},
			],
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 600,
						},
						chartOptions: {
							chart: {
								height: "auto",
							},
							legend: {
								align: "center",
								verticalAlign: "bottom",
								layout: "horizontal",
							},
						},
					},
				],
			},
		};
	}, [handleClickChart]);

	useEffect(() => {
		if (mapData && Object.keys(mapData).length && dataReportChart) {
			const data = dataReportChart?.data || [];
			setOption({
				...initOptions,
				series: [
					{
						...initOptions.series[0],
						data: data.map((item) => {
							return [`vn-${item.code}`, item.value];
						}),
						mapData,
					},
				],
			});
		}
	}, [dataReportChart, initOptions]);

	if (isFetching) return <PageLoading />;

	return (
		<Row justify="center" gutter={[0, 20]} style={{ padding: 20 }}>
			<Col span={24}>
				<TitleCustom level={3}>{t("Infected Farm Chart")}</TitleCustom>
			</Col>
			<Col span={24}>
				<HighchartsReact
					highcharts={Highchart}
					options={option}
					constructorType={"mapChart"}
					ref={chartRef}
					callback={(ref: HighchartsReact.RefObject) => {
						const selector = document.querySelector(".highcharts-credits");
						if (selector) selector.remove();
					}}
				/>
			</Col>
		</Row>
	);
};

export default React.memo(MapChart);
