import { IPublicClientApplication } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Col, Image, Row, Space, Typography } from "antd";
import logo from "assets/images/download.png";
import { ButtonCustom } from "components";
import { loginRequest } from "config/authConfig";
import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const handleLogin = async (instance: IPublicClientApplication) => {
	instance.loginRedirect(loginRequest).catch((e: Error) => {
		console.error(e);
	});
};

export const Login = () => {
	const { t } = useTranslation();

	const { instance } = useMsal();
	const isAuthenticated = useIsAuthenticated();
	const location = useLocation();

	if (isAuthenticated) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return (
		<Row justify="center" align="middle" style={{ minHeight: "60vh" }}>
			<Col>
				<Space direction="vertical" size="large" align="center">
					<Image preview={false} src={logo} width={200} alt="logo" />
					<Title level={3} style={{ margin: 0 }}>
						{t("Disease Declaration")}
					</Title>
					<Text>{t("Please enter your email and email password")}</Text>
					<ButtonCustom
						onClick={() => handleLogin(instance)}
						size="large"
						type="primary"
						shape="round">
						{t("Login")}
					</ButtonCustom>
				</Space>
			</Col>
		</Row>
	);
};
