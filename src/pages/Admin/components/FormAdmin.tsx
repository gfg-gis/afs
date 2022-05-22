import React from "react";
import { useTranslation } from "react-i18next";

import { ROLES } from "../../../constants";

import { useCreateUserMutation } from "api";

import { useAppSelector } from "store";

import { ButtonCustom } from "components";

import { Form, Input, Select, notification } from "antd";

const { Option } = Select;

export const FormAdmin = () => {
	const { t } = useTranslation();

	const userInfo = useAppSelector((state) => state.user.info);

	const [form] = Form.useForm();

	const [createUser, { isLoading }] = useCreateUserMutation();

	const handleOnFinish = async (values: { name: string; email: string; role: string }) => {
		const { name, email, role } = values;

		const post = {
			name,
			email,
			role,
			created_by: userInfo?.email as string,
		};

		const { status, msg } = await createUser(post).unwrap();
		notification[status]({
			message: status,
			description: msg,
		});

		form.resetFields();
	};

	return (
		<Form form={form} layout="vertical" onFinish={handleOnFinish}>
			<Form.Item
				label={t("Email")}
				name={"email"}
				rules={[
					{ required: true, message: t("Please enter email") },
					{ type: "email", message: t("Invalid email") },
				]}>
				<Input placeholder={t("Please enter email")} />
			</Form.Item>

			<Form.Item
				label={t("Name")}
				name={"name"}
				rules={[{ required: true, message: t("Please enter name") }]}>
				<Input placeholder={t("Please enter name")} />
			</Form.Item>

			<Form.Item
				label={t("Role")}
				name={"role"}
				rules={[{ required: true, message: t("Please select role") }]}>
				<Select placeholder={t("Please select role")}>
					{ROLES.map((value) => (
						<Option key={value} value={value}>
							{value}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item>
				<ButtonCustom shape="round" type="primary" htmlType="submit" loading={isLoading}>
					{t("Create User")}
				</ButtonCustom>
			</Form.Item>
		</Form>
	);
};
