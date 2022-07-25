import { Col, Row, Space, Table, Typography } from "antd";
import { useGetReportChartQuery } from "api";
import { useTranslation } from "react-i18next";
import { COLOR_DANGER } from "../../../constants";

const { Title } = Typography;

export const Infomation = () => {
	const { t } = useTranslation();

	const { data: dataReportChart } = useGetReportChartQuery(
		{
			infected: 1,
			isChartBar: true,
			// from_date: fromDate,
			// to_date: moment().format("YYYY-MM-DD"),
		},
		{ refetchOnMountOrArgChange: true }
	);

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
						dataSource={dataReportChart?.data || []}
						columns={columns}
						pagination={false}
						scroll={{ x: true, y: 500 }}
					/>
				</Space>
			</Col>
		</Row>
	);
};
