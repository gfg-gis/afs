import { DeleteTwoTone, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
	Col,
	DatePicker,
	Form,
	Input,
	notification,
	Popconfirm,
	Row,
	Table,
	Tag,
	Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useGetReportsQuery, useUpdateReportMutation } from "api";
import { ButtonCustom, TitleCustom } from "components";
import { removeAccents } from "helpers";
import { Reports } from "models";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "store";
import { COLOR_GREEN, FORMAT_DATE } from "../../constants";

const { Text } = Typography;

export const Report = () => {
	const { t } = useTranslation();

	const userInfo = useAppSelector((state) => state.user.info);

	const [fromDate, setFromDate] = useState(moment().subtract(1, "days").format(FORMAT_DATE));
	const [toDate, setToDate] = useState(moment().format(FORMAT_DATE));
	const [isFilter, setIsFilter] = useState(false);
	const [valueSearch, setValueSearch] = useState("");

	const [form] = Form.useForm();

	const params = {
		from_date: moment(fromDate, FORMAT_DATE).format("YYYY-MM-DD"),
		to_date: moment(toDate, FORMAT_DATE).format("YYYY-MM-DD"),
		infected: 1,
	};

	const { data, isLoading, isFetching } = useGetReportsQuery(params, {
		skip: isFilter,
		refetchOnMountOrArgChange: true,
	});
	const [updateReport] = useUpdateReportMutation();

	const [dataSource, setDataSource] = useState<Reports[]>(data?.data || []);

	useEffect(() => {
		if (!isFetching) {
			setIsFilter(true);
		}
	}, [isFetching]);

	useEffect(() => {
		if (!data) return;

		const newData = data?.data?.filter(
			(item) =>
				removeAccents(item.province).includes(removeAccents(valueSearch)) ||
				removeAccents(item.district).includes(removeAccents(valueSearch)) ||
				removeAccents(item.ward).includes(removeAccents(valueSearch)) ||
				removeAccents(item.farm_name).includes(removeAccents(valueSearch)) ||
				removeAccents(item.farm_type).includes(removeAccents(valueSearch))
		);

		setDataSource(newData as Reports[]);
	}, [valueSearch, data]);

	const columns: ColumnsType<Reports> = [
		{
			title: t("Report Date"),
			dataIndex: "report_date",
			key: "report_date",
			render: (report_date) => (
				<div style={{ whiteSpace: "nowrap" }}>{moment(report_date).format(FORMAT_DATE)}</div>
			),
		},
		{
			title: t("Created Time"),
			dataIndex: "created_time",
			key: "created_time",
			render: (created_time) => (
				<div style={{ whiteSpace: "nowrap" }}>{moment(created_time).format(`H:mm:ss ${FORMAT_DATE}`)}</div>
			),
		},
		{
			title: t("Province"),
			dataIndex: "province",
			key: "province",
			render: (province) => <div style={{ whiteSpace: "nowrap" }}>{province}</div>,
		},
		{
			title: t("District"),
			dataIndex: "district",
			key: "district",
			render: (district) => <div style={{ whiteSpace: "nowrap" }}>{district}</div>,
		},
		{
			title: t("Ward"),
			dataIndex: "ward",
			key: "ward",
			render: (ward) => <div style={{ whiteSpace: "nowrap" }}>{ward}</div>,
		},
		{
			title: t("Farm Type"),
			dataIndex: "farm_type",
			key: "farm_type",
			render: (tag) => {
				let color = "geekblue";

				if (tag === "Sow") {
					color = "volcano";
				} else if (tag === "Finishing") {
					color = "green";
				}

				return (
					<div style={{ whiteSpace: "nowrap" }}>
						<Tag color={color} key={tag}>
							{t(tag)}
						</Tag>
					</div>
				);
			},
		},
		{
			title: t("Total Pigs"),
			dataIndex: "total_pigs",
			key: "total_pigs",
		},
		{
			title: "",
			dataIndex: "remove",
			key: "remove",
			render: (id, record) => (
				<Popconfirm
					icon={<QuestionCircleOutlined style={{ color: "red" }} />}
					title={`${t("Are you sure delete")}?`}
					onConfirm={() => handleUpdateReport(record.key)}
					okText={t("Yes")}
					cancelText={t("No")}>
					<DeleteTwoTone style={{ fontSize: "16px" }} twoToneColor="#ff4d4f" />
				</Popconfirm>
			),
		},
	];

	const handleUpdateReport = async (id: number) => {
		const post = {
			updated_name: userInfo?.fullName,
			updated_email: userInfo?.email,
			id,
		};

		const { status, msg } = await updateReport(post).unwrap();
		notification[status]({
			message: t(status),
			description: t(msg),
		});
		setIsFilter(false);
	};

	const handleOnFinish = () => {
		setIsFilter(false);
	};

	const handleOnChangeFromDate = (value: null | Moment) => {
		if (!value) return null;

		setFromDate(moment(value).format(FORMAT_DATE));

		if (moment(value).unix() > moment(toDate, FORMAT_DATE).unix()) {
			const newDate = moment(value).add(1, "days").format(FORMAT_DATE);
			setToDate(newDate);
			form.setFieldsValue({ to_date: moment(value).add(1, "days") });
		}
	};

	const handleOnChangeToDate = (value: null | Moment) => {
		if (!value) return null;
		setToDate(moment(value).format(FORMAT_DATE));
	};

	return (
		<Row
			gutter={[0, 20]}
			justify="center"
			style={{
				padding: "40px 0px",
			}}>
			<Col>
				<Row
					gutter={[0, 30]}
					style={{
						padding: 20,
						borderTop: `1px solid ${COLOR_GREEN}`,
						borderRadius: 6,
						boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
					}}>
					<Col span={24}>
						<TitleCustom level={3}>{t("List Of Infected Farms")}</TitleCustom>
					</Col>
					<Col span={24}>
						<Form
							form={form}
							onFinish={handleOnFinish}
							fields={[
								{ name: ["from_date"], value: moment(fromDate, FORMAT_DATE) },
								{ name: ["to_date"], value: moment(toDate, FORMAT_DATE) },
							]}>
							<Row gutter={[20, 0]} align="bottom">
								<Col xs={9} sm={10} md={8} lg={6} xxl={6}>
									<Form.Item
										label={<Text strong={true}>{t("From Date")}</Text>}
										name={"from_date"}
										rules={[{ required: true, message: t("Please select from date") }]}>
										<DatePicker
											style={{ width: "100%" }}
											format={FORMAT_DATE}
											placeholder={t("Please select from date")}
											onChange={handleOnChangeFromDate}
										/>
									</Form.Item>
								</Col>
								<Col xs={9} sm={10} md={8} lg={6} xxl={6}>
									<Form.Item
										label={<Text strong={true}>{t("To Date")}</Text>}
										name={"to_date"}
										rules={[{ required: true, message: t("Please select to date") }]}>
										<DatePicker
											style={{ width: "100%" }}
											format={FORMAT_DATE}
											placeholder={t("Please select to date")}
											onChange={handleOnChangeToDate}
											disabledDate={(d) => !d || d.isSameOrBefore(moment(fromDate, FORMAT_DATE))}
										/>
									</Form.Item>
								</Col>
								<Col xs={6} sm={4} md={8} lg={6} xxl={6}>
									<Form.Item>
										<ButtonCustom
											shape="round"
											type="primary"
											htmlType="submit"
											loading={isLoading || isFetching}
											disabled={isFetching}>
											{t("Filter")}
										</ButtonCustom>
									</Form.Item>
								</Col>
								<Col xs={24} lg={6} xxl={6}>
									<Form.Item label={<Text strong={true}>{t("Search")}</Text>} name={"search"}>
										<Input
											value={valueSearch}
											onChange={(e) => setValueSearch(e.target.value)}
											type="text"
											placeholder={`${t("Search")}...`}
											prefix={<SearchOutlined style={{ color: "#CED4D8" }} />}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col span={24}>
						<Table
							loading={isLoading || isFetching}
							columns={columns}
							dataSource={dataSource}
							scroll={{ x: true }}
						/>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};
