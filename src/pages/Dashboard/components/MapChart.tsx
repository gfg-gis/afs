import { Typography } from "antd";
import mapData from "config/vi-all.geo.json";
import Highchart from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { COLOR_DANGER } from "../../../constants";

highchartsMap(Highchart);

interface DataReportChart {
	code: string;
	id: number;
	key: number;
	matp: string;
	province: string;
	value: number;
}

interface MapChartProps {
	dataReportChart: DataReportChart[];
	handleClickChart: (_this: any) => void;
}

const { Title } = Typography;

export const MapChart = React.memo(({ dataReportChart, handleClickChart }: MapChartProps) => {
	const { t } = useTranslation();

	const [option, setOption] = useState({});

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const initOptions = useMemo(() => {
		return {
			accessibility: {
				enabled: false,
			},
			chart: {
				// animation: false,
				height: 500,
			},
			title: {
				text: null,
			},
			credits: {
				enabled: false,
			},
			mapNavigation: {
				enabled: true,
				enableButtons: true,
				buttonOptions: {
					align: "right",
				},
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
				layout: "vertical", //"vertical",
				align: "left",
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
			setOption({
				...initOptions,
				series: [
					{
						...initOptions.series[0],
						data: dataReportChart.map((item) => {
							return [`vn-${item.code}`, item.value];
						}),
						mapData,
					},
				],
			});
		}
	}, [dataReportChart, initOptions]);

	return (
		<div
			style={{
				borderRadius: 6,
				borderTop: `1px solid ${COLOR_DANGER}`,
				boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
				height: "100%",
				padding: 20,
			}}>
			<Title level={3}>{t("Diagram Of Infected Area")}</Title>
			<HighchartsReact
				highcharts={Highchart}
				options={option}
				constructorType={"mapChart"}
				ref={chartRef}
				// callback={(ref: HighchartsReact.RefObject) => {
				// 	const selector = document.querySelector(".highcharts-credits");
				// 	if (selector) selector.remove();
				// }}
			/>
		</div>
	);
});
