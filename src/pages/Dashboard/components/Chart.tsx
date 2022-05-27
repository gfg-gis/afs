import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Modal, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useGetReportChartHistoryQuery } from "api";
import { Reports } from "models";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMAT_DATE } from "../../../constants";
import { MapChart } from "./MapChart";

interface DataReportChart {
	code: string;
	id: number;
	key: number;
	matp: string;
	province: string;
	value: number;
}

interface ChartProps {
	dataReportChart: DataReportChart[];
}

export const Chart = ({ dataReportChart }: ChartProps) => {
	const { t } = useTranslation();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const [province, setProvince] = useState<string | null>(null);
	const [provinceId, setProvinceId] = useState<string | null>(null);

	const { data, isLoading } = useGetReportChartHistoryQuery(
		provinceId
			? {
					province_id: provinceId,
					infected: 1,
			  }
			: skipToken
	);

	const columns: ColumnsType<Reports> = [
		{
			title: t("Report Date"),
			dataIndex: "report_date",
			key: "report_date",
			render: (report_date) => moment(report_date).format(FORMAT_DATE),
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("Province"),
			dataIndex: "province",
			key: "province",
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("District"),
			dataIndex: "district",
			key: "district",
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("Ward"),
			dataIndex: "ward",
			key: "ward",
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		// {
		// 	title: t("Farm Name"),
		// 	dataIndex: "farm_name",
		// 	key: "farm_name",
		// 	render: (farm_name, record) => (
		// 		<Tooltip
		// 			title={`${record.street_name} - ${record.ward} - ${record.district} - ${record.province}`}>
		// 			<a
		// 				target={"_blank"}
		// 				rel="noreferrer"
		// 				href={formatUrlGoogleMap(record.street_name, record.ward, record.district, record.province)}>
		// 				{farm_name}
		// 			</a>
		// 		</Tooltip>
		// 	),
		// 	onCell: () => {
		// 		return {
		// 			style: {
		// 				whiteSpace: "nowrap",
		// 			},
		// 		};
		// 	},
		// },
		{
			title: t("Farm Type"),
			dataIndex: "farm_type",
			key: "farm_type",
			render: (farm_type) => {
				let color = "geekblue";

				if (farm_type === "Sow") {
					color = "volcano";
				} else if (farm_type === "Finishing") {
					color = "green";
				}

				return (
					<Tag color={color} key={farm_type}>
						{t(farm_type)}
					</Tag>
				);
			},
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("Total Pigs"),
			dataIndex: "total_pigs",
			key: "total_pigs",
		},
	];

	const handleClickChart = useCallback((this_: any) => {
		setProvince(this_.name);
		setProvinceId(this_.options["hc-key"].replace("vn-", ""));
		setIsModalVisible(true);
	}, []);

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Modal
				width={1000}
				title={province}
				footer={null}
				onCancel={handleCancel}
				visible={isModalVisible}>
				<Table columns={columns} dataSource={data?.data || []} loading={isLoading} scroll={{ x: 400 }} />
			</Modal>
			<MapChart handleClickChart={handleClickChart} dataReportChart={dataReportChart} />
		</>
	);
};
