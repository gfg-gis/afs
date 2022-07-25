import { Typography, Space } from "antd";
import mapData from "config/vi-all.geo.json";
import Highchart from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import { groupBy } from "lodash";
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
	infected: number;
}

interface MapChartProps {
	dataReportChart: DataReportChart[];
	handleClickChart: (_this: any) => void;
}

const { Title, Text } = Typography;

const COLOR = {
	infected: "#EE1B25",
	surveillance: "#FBAC14", // "#FEC912",
	notInfected: "#06A552",
	// clean: "#CCCCCC",
};

export const MapChart = React.memo(({ dataReportChart, handleClickChart }: MapChartProps) => {
	const { t } = useTranslation();

	const [option, setOption] = useState({});

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const initOptions = useMemo(() => {
		return {
			tooltip: {
				headerFormat: '<span style="font-size:10px"></span><br/>',
				pointFormat: "{point.name}",
			},
			accessibility: {
				enabled: false,
			},
			chart: {
				height: 600,
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
					// [0.2, "#FFC4AA"],
					// [0.4, "#FF8A66"],
					// [0.6, "#FF392B"],
					// [0.8, "#B71525"],
					// [1, "#7A0826"],

					[0.2, COLOR.notInfected], //xanh
					// [0.4, "#F16B21"], //vang
					[0.6, COLOR.surveillance], //cam
					// [0.8, "#FEBEE7"], //hong
					[1, COLOR.infected], //do
				],
			},
			legend: {
				enabled: false,
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
			const newData = groupBy(dataReportChart, (item) => item.code);
			const data = Object.keys(newData).map((code) => {
				let green = 0;
				let red = 0;
				newData[code].forEach((item) => {
					if (item.infected) {
						red++;
					} else {
						green++;
					}
				});
				const value = green > 0 && red > 0 ? 2 : green > 0 ? 0 : 3;

				return [`vn-${code}`, value];
			});

			setOption({
				...initOptions,
				series: [
					{
						...initOptions.series[0],
						data: data.concat([
							["a", 0],
							["a", 2],
							["a", 3],
						]),
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
			<Title level={3}>{t("ASF Zoning Status")}</Title>
			<Space direction="vertical" style={{ position: "absolute", top: 250, zIndex: 999 }}>
				{Object.values(COLOR).map((color, index) => (
					<Space key={color}>
						<div style={{ width: 36, height: 18, borderRadius: 3, background: color }}></div>
						<Text>
							{Object.keys(COLOR)[index] === "infected"
								? t("Infected Zone")
								: Object.keys(COLOR)[index] === "notInfected"
								? t("Not Infected Zone")
								: Object.keys(COLOR)[index] === "surveillance"
								? t("Surveillance Zone")
								: t("Clean")}
						</Text>
					</Space>
				))}
			</Space>
			<HighchartsReact
				highcharts={Highchart}
				options={option}
				constructorType={"mapChart"}
				ref={chartRef}
			/>
		</div>
	);
});
