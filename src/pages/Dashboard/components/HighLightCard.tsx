import { Card, Col, Row, Typography } from "antd";
import { useGetTotalReportsQuery } from "api";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLOR_DANGER, COLOR_GREEN, COLOR_INFO } from "../../../constants";

const { Title, Text } = Typography;

interface CardCustomProps {
	color: string;
	title: string;
	value: number;
}

const CardCustom = ({ color, title, value }: CardCustomProps) => (
	<Card
		bordered={false}
		style={{
			borderTop: `1px solid ${color}`,
			borderRadius: 6,
			boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
			textAlign: "center",
		}}>
		<Title style={{ margin: 0, color: color }}>{value}</Title>
		<Text type="secondary">{title}</Text>
	</Card>
);

export const HighLightCard = () => {
	const { t } = useTranslation();

	const { data } = useGetTotalReportsQuery();

	return (
		<Row gutter={[30, 30]}>
			<Col xs={24} sm={8}>
				<CardCustom color={COLOR_INFO} title={t("Total")} value={data?.data.total || 0} />
			</Col>
			<Col xs={24} sm={8}>
				<CardCustom color={COLOR_DANGER} title={t("Infected")} value={data?.data.infected || 0} />
			</Col>
			<Col xs={24} sm={8}>
				<CardCustom color={COLOR_GREEN} title={t("Not Infected")} value={data?.data.not_infected || 0} />
			</Col>
		</Row>
	);
};
