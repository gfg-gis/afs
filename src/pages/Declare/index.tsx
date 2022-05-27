import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	notification,
	Row,
	Select,
	Space,
	Typography,
} from "antd";
import {
	useCreateReportMutation,
	useGetDiseasesQuery,
	useGetDistrictsQuery,
	useGetProvincesQuery,
	useGetWardsQuery,
} from "api";
import { ButtonCustom, TitleCustom } from "components";
import { removeAccents } from "helpers";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "store";
import { COLOR_GREEN, FARM_TYPE, FORMAT_DATE } from "../../constants";

const { Text } = Typography;
const { TextArea } = Input;

export const Declare = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	const userInfo = useAppSelector((state) => state.user.info);

	const [valueProvince, setValueProvince] = useState<null | string>(null);
	const [valueDistrict, setValueDistrict] = useState<null | string>(null);

	const { data: dataDiseases } = useGetDiseasesQuery();
	const { data: dataProvinces } = useGetProvincesQuery();
	const { data: dataDistricts } = useGetDistrictsQuery(
		valueProvince ? { matp: valueProvince } : skipToken
	);
	const { data: dataWards } = useGetWardsQuery(valueDistrict ? { maqh: valueDistrict } : skipToken);

	const [createReport, { isLoading }] = useCreateReportMutation();

	const handleSelectProvince = (value: string) => {
		setValueProvince(value);
		form.setFieldsValue({ district: null, ward: null });
	};

	const handleSelectDistrict = (value: string) => {
		setValueDistrict(value);
		form.setFieldsValue({ ward: null });
	};

	const handleOnFinish = async (values: any) => {
		const {
			date: created_date,
			// disease: disease_id,
			province: province_id,
			district: district_id,
			ward: ward_id,
			street_name,
			farm_type,
			farm_name,
			total_pigs,
			note: noted,
		} = values;

		const post = {
			report_date: moment(created_date).format("YYYY-MM-DD"),
			created_name: userInfo?.fullName as string,
			created_email: userInfo?.email as string,
			// disease_id,
			disease_id: 1,
			province_id,
			district_id,
			ward_id,
			street_name,
			farm_type,
			farm_name,
			total_pigs,
			noted,
		};

		const { status, msg } = await createReport(post).unwrap();
		notification[status]({
			message: t(status),
			description: t(msg),
		});
		form.resetFields();
	};

	const handleSelectFilter = (input: string, { label }: any) =>
		removeAccents(label).indexOf(removeAccents(input)) >= 0;

	return (
		<Row justify="center" style={{ padding: "40px 0px" }}>
			<Col xs={24} sm={24} md={20} lg={16} xl={14}>
				<Row
					style={{
						padding: "20px 20px 0px 20px",
						borderTop: `1px solid ${COLOR_GREEN}`,
						borderRadius: 6,
						boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
					}}>
					<Col>
						<Space direction="vertical" style={{ paddingLeft: 24 }}>
							<TitleCustom level={3} style={{ margin: 0 }}>
								{t("Declaration Form")}
							</TitleCustom>
							<Text type="secondary">*{t("Please check the information before submitting the report")}.</Text>
						</Space>
						<Card bordered={false}>
							<Form form={form} layout="vertical" onFinish={handleOnFinish}>
								<Row gutter={[30, 0]}>
									<Col xs={24} sm={12}>
										<Form.Item
											label={t("Date")}
											name={"date"}
											initialValue={moment()}
											rules={[{ required: true, message: t("Please select date") }]}>
											<DatePicker
												format={FORMAT_DATE}
												placeholder={t("Please select date")}
												style={{ width: "100%" }}
												disabledDate={(d) => !d || d.isAfter(moment())}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											label={t("Disease Type")}
											name={"disease"}
											initialValue={"AFS"}
											rules={[{ required: true, message: t("Please select disease type") }]}>
											<Select
												showSearch
												placeholder={t("Please select disease type")}
												options={dataDiseases?.data?.map((item) => ({ label: item.name, value: item.id })) ?? []}
												optionFilterProp="label"></Select>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											label={t("Province")}
											name={"province"}
											rules={[{ required: true, message: t("Please select province") }]}>
											<Select
												showSearch
												onChange={handleSelectProvince}
												placeholder={t("Please select province")}
												options={dataProvinces?.data?.map((item) => ({ label: item.name, value: item.matp })) ?? []}
												optionFilterProp="label"
												filterOption={handleSelectFilter}></Select>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12}>
										<Form.Item
											label={t("District")}
											name={"district"}
											rules={[{ required: true, message: t("Please select district") }]}>
											<Select
												showSearch
												onChange={handleSelectDistrict}
												placeholder={t("Please select district")}
												options={dataDistricts?.data?.map((item) => ({ label: item.name, value: item.maqh })) ?? []}
												optionFilterProp="label"
												filterOption={handleSelectFilter}></Select>
										</Form.Item>
									</Col>

									<Col xs={24} sm={12}>
										<Form.Item
											label={t("Ward")}
											name={"ward"}
											rules={[{ required: true, message: t("Please select ward") }]}>
											<Select
												showSearch
												placeholder={t("Please select ward")}
												options={dataWards?.data?.map((item) => ({ label: item.name, value: item.xaid })) ?? []}
												optionFilterProp="label"
												filterOption={handleSelectFilter}></Select>
										</Form.Item>
									</Col>

									<Col xs={24} sm={12}>
										<Form.Item label={t("Street Name")} name={"street_name"}>
											{/* rules={[{ required: true, message: t("Please enter street name") }]}> */}
											<Input placeholder={t("Please enter street name")} />
										</Form.Item>
									</Col>

									<Col xs={24} sm={12}>
										<Form.Item
											label={t("Farm Type")}
											name={"farm_type"}
											rules={[{ required: true, message: t("Please select farm type") }]}>
											<Select
												showSearch
												placeholder={t("Please select farm type")}
												options={FARM_TYPE.map((value) => ({ label: value, value: value })) ?? []}
												optionFilterProp="label"></Select>
										</Form.Item>
									</Col>

									<Col xs={24} sm={12}>
										<Form.Item label={t("Farm Name")} name={"farm_name"}>
											{/* rules={[{ required: true, message: t("Please enter farm name") }]}> */}
											<Input placeholder={t("Please enter farm name")} />
										</Form.Item>
									</Col>

									<Col xs={24}>
										<Form.Item
											label={t("Total Pigs")}
											name={"total_pigs"}
											rules={[{ required: true, message: t("Please enter total pigs") }]}>
											<InputNumber placeholder={t("Please enter total pigs")} min={1} style={{ width: "100%" }} />
										</Form.Item>
									</Col>
									<Col xs={24}>
										<Form.Item label={t("Note")} name={"note"}>
											<TextArea rows={4} placeholder={t("Please enter note")} />
										</Form.Item>
									</Col>
									<Col xs={24}>
										<Form.Item>
											<ButtonCustom loading={isLoading} htmlType="submit" type="primary" shape="round">
												{t("Save Report")}
											</ButtonCustom>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Card>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};
