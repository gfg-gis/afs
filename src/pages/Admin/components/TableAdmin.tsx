import { DeleteTwoTone, QuestionCircleOutlined } from "@ant-design/icons";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { notification, Table, Tag, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import { useDeleteUserMutation, useGetUserByCreatedByQuery } from "api";
import { Users } from "models";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "store";

export const TableAdmin = () => {
	const { t } = useTranslation();

	const userInfo = useAppSelector((state) => state.user.info);

	const { data, isLoading } = useGetUserByCreatedByQuery(userInfo?.email ?? skipToken);

	const [deleteUser] = useDeleteUserMutation();

	const handleDeleteUser = async (id: number, created_by: string) => {
		const { status, msg } = await deleteUser({
			id,
			created_by,
		}).unwrap();

		notification[status]({
			message: status,
			description: msg,
		});
	};

	const columns: ColumnsType<Users> = [
		{
			title: t("Created Time"),
			dataIndex: "created_time",
			key: "created_time",
			render: (created_time) => moment(created_time).format("H:mm:ss DD-MM-YYYY "),
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("Email"),
			dataIndex: "email",
			key: "email",
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("Name"),
			dataIndex: "name",
			key: "name",
			onCell: () => {
				return {
					style: {
						whiteSpace: "nowrap",
					},
				};
			},
		},
		{
			title: t("Role"),
			dataIndex: "role",
			key: "role",
			render: (role) => {
				let color = "geekblue";
				return (
					<Tag color={color} key={role}>
						{role}
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
			title: "",
			dataIndex: "remove",
			key: "remove",
			render: (id, record) => (
				<Popconfirm
					icon={<QuestionCircleOutlined style={{ color: "red" }} />}
					title={`${t("Are you sure delete")}?`}
					onConfirm={() => handleDeleteUser(record.id, record.created_by)}
					okText={t("Yes")}
					cancelText={t("No")}>
					<DeleteTwoTone style={{ fontSize: "16px" }} twoToneColor="#ff4d4f" />
				</Popconfirm>
			),
		},
	];

	return (
		<Table
			loading={isLoading}
			columns={columns}
			dataSource={data?.data || []}
			scroll={{ x: true }}
		/>
	);
};
