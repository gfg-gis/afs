import React from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";

import { formatUrlGoogleMap, calDuration } from "helpers";

import { Modal, Row, Col, Typography, Space, Tag, Divider } from "antd";
import { Reports } from "models";

const { Text } = Typography;

interface SpaceAddressProps {
	street_name: string;
	ward: string;
	district: string;
	province: string;
}

const SpaceAddress = ({ street_name, ward, district, province }: SpaceAddressProps) => {
	const { t } = useTranslation();

	return (
		<Space>
			<Text type="secondary" style={{ fontSize: 12 }}>
				{t("Address")}:
			</Text>
			<Text>
				<a
					target={"_blank"}
					rel="noreferrer"
					href={formatUrlGoogleMap(street_name, ward, district, province)}>
					{/* {street_name} - {ward} - {district} - {province} */}
					{ward} - {district} - {province}
				</a>
			</Text>
		</Space>
	);
};

interface ContentColProps {
	label: string;
	value: string;
	isTagStatus?: boolean;
	isTagFarmType?: boolean;
}

const ContentCol = ({
	label,
	value,
	isTagStatus = false,
	isTagFarmType = false,
}: ContentColProps) => {
	const { t } = useTranslation();

	return (
		<Space>
			<Text type="secondary" style={{ fontSize: 12 }}>
				{t(label)}:
			</Text>
			{isTagStatus ? (
				<Tag color={value === "Infected" ? "#ff4d4f" : "#4BB543"} key={value}>
					{" "}
					{t(value)}{" "}
				</Tag>
			) : isTagFarmType ? (
				<Tag
					color={value === "Sow" ? "volcano" : value === "Finishing" ? "green" : "geekblue"}
					key={value}>
					{" "}
					{t(value)}{" "}
				</Tag>
			) : (
				<Text strong={true}>{t(value)}</Text>
			)}
		</Space>
	);
};

interface ContentRowCreatedTimeProps {
	data: Reports | null;
}

const ContentRowCreatedTime = ({ data }: ContentRowCreatedTimeProps) => (
	<Row gutter={[0, 10]}>
		<Col xs={24} md={12}>
			<ContentCol label="Report Date" value={moment(data?.report_date).format("DD-MM-YYYY") as string} />
		</Col>
		<Col xs={24} md={12}>
			<ContentCol label="Status" value={"Infected"} isTagStatus={true} />
		</Col>
		<Col xs={24} md={12}>
			<ContentCol label="Name" value={data?.created_name as string} />
		</Col>
		<Col xs={24} md={12}>
			<ContentCol label="Email" value={data?.created_email as string} />
		</Col>
		<Col xs={24} md={12}>
			<ContentCol label="Farm Name" value={(data?.farm_name as string) || "-"} />
		</Col>
		<Col xs={24} md={12}>
			<ContentCol label="Farm Type" value={data?.farm_type as string} isTagFarmType={true} />
		</Col>
		{data?.infected === 1 && data?.noted && (
			<Col span={24}>
				<ContentCol label="Note" value={data?.noted as string} />
			</Col>
		)}

		{data?.infected === 1 && (
			<Col span={24}>
				<SpaceAddress
					street_name={data?.street_name}
					ward={data?.ward}
					district={data?.district}
					province={data?.province}
				/>
			</Col>
		)}
	</Row>
);

const ContentRowUpdatedTime = ({ data }: ContentRowCreatedTimeProps) => (
	<Row gutter={[0, 10]}>
		<Col span={24}>
			<Divider />
		</Col>

		<Col xs={24} md={12}>
			<ContentCol
				label="Updated Date"
				value={moment(data?.updated_time).format("DD-MM-YYYY") as string}
			/>
		</Col>

		<Col xs={24} md={12}>
			<ContentCol label="Status" value={"Not Infected"} isTagStatus={true} />
		</Col>

		<Col xs={24} md={12}>
			<ContentCol label="Name" value={data?.updated_name as string} />
		</Col>

		<Col xs={24} md={12}>
			<ContentCol label="Email" value={data?.updated_email as string} />
		</Col>

		<Col xs={24} md={12}>
			<ContentCol label="Farm Name" value={(data?.farm_name as string) || "-"} />
		</Col>

		<Col xs={24} md={12}>
			<ContentCol label="Farm Type" value={data?.farm_type as string} isTagFarmType={true} />
		</Col>

		<Col span={24}>
			<Divider />
		</Col>

		<Col span={24}>
			<ContentCol
				label="Duration"
				value={calDuration(moment(data?.updated_time).unix() - moment(data?.report_date).unix()) as string}
			/>
		</Col>

		{data?.infected === 0 && data?.noted && (
			<Col span={24}>
				<ContentCol label="Note" value={data?.noted as string} />
			</Col>
		)}

		{data?.infected === 0 && (
			<Col span={24}>
				<SpaceAddress
					street_name={data?.street_name}
					ward={data?.ward}
					district={data?.district}
					province={data?.province}
				/>
			</Col>
		)}
	</Row>
);

interface ModalHistoryProps extends ContentRowCreatedTimeProps {
	isModalVisible: boolean;
	handleCancel: () => void;
}

const ModalHistory = ({ isModalVisible, handleCancel, data }: ModalHistoryProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			width={700}
			title={t("History")}
			footer={null}
			visible={isModalVisible}
			onCancel={handleCancel}>
			<Row gutter={[0, 0]}>
				<ContentRowCreatedTime data={data} />
				{data?.updated_email && <ContentRowUpdatedTime data={data} />}
			</Row>
		</Modal>
	);
};

export default ModalHistory;
