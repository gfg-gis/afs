import { Col, Row, Tabs } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { COLOR_GREEN } from "../../constants";
import { FormAdmin, TableAdmin } from "./components";

const { TabPane } = Tabs;

const TabsCustom = styled(Tabs)`
	.ant-tabs-tab-active .ant-tabs-tab-btn,
	.ant-tabs-tab:hover {
		color: ${COLOR_GREEN};
	}
`;

export const Admin = () => {
	const { t } = useTranslation();

	return (
		<Row style={{ padding: 20 }}>
			<Col span={24}>
				<TabsCustom defaultActiveKey="2" type="card" onChange={() => {}}>
					<TabPane tab={t("Create User")} key="1">
						<Row gutter={[0, 20]} justify="center">
							<Col xs={{ span: 20 }} md={{ span: 18 }} lg={{ span: 8 }}>
								<FormAdmin />
							</Col>
						</Row>
					</TabPane>
					<TabPane tab={t("User List")} key="2">
						<Row gutter={[0, 20]} justify="center">
							<Col span={24}>
								<TableAdmin />
							</Col>
						</Row>
					</TabPane>
				</TabsCustom>
			</Col>
		</Row>
	);
};
