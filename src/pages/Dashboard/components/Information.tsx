import { Col, Row, Space, Table, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLOR_DANGER } from "../../../constants";

const { Title } = Typography;

interface DataReportChart {
	code: string;
	id: number;
	key: number;
	matp: string;
	province: string;
	value: number;
	dataArea?: {
		district: Array<string>;
		value: Array<number>;
	};
}

interface InfomationProps {
	dataReportChart: DataReportChart[];
}

export const Infomation = ({ dataReportChart }: InfomationProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			title: t("Province"),
			dataIndex: "province",
			key: "province",
		},
		{
			title: t("Quantity"),
			dataIndex: "value",
			key: "value",
			render: (value: string) => <Title level={5}>{value}</Title>,
		},
	];

	return (
		<Row style={{ height: "100%" }}>
			<Col span={24}>
				<Space
					direction="vertical"
					style={{
						borderRadius: 6,
						borderTop: `1px solid ${COLOR_DANGER}`,
						boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
						width: "100%",
						height: "100%",
					}}>
					<Space style={{ padding: 20 }} direction="vertical">
						<Title level={3} style={{ marginBottom: 0 }}>
							{t("Infected Area")}
						</Title>
					</Space>
					<Table
						dataSource={dataReportChart}
						columns={columns}
						pagination={false}
						scroll={{ x: true, y: 500 }}
					/>
				</Space>
			</Col>
		</Row>
	);
};
