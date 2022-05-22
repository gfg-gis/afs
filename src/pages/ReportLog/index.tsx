import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useGetReportsQuery } from "api";
import { ButtonCustom, TitleCustom } from "components";
import { removeAccents } from "helpers";
import { Reports } from "models";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMAT_DATE } from "../../constants";
import ModalHistory from "./components/ModalHistory";

const { Text } = Typography;

export const ReportLog = () => {
  const { t } = useTranslation();

  const [fromDate, setFromDate] = useState(moment().subtract(1, "days").format(FORMAT_DATE));
  const [toDate, setToDate] = useState(moment().format(FORMAT_DATE));
  const [isFilter, setIsFilter] = useState(false);
  const [valueSearch, setValueSearch] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataHistory, setDataHistory] = useState<Reports | null>(null);

  const [form] = Form.useForm();

  const params = {
    from_date: moment(fromDate, FORMAT_DATE).format("YYYY-MM-DD"),
    to_date: moment(toDate, FORMAT_DATE).format("YYYY-MM-DD"),
  };

  const { data, isLoading, isFetching } = useGetReportsQuery(params, {
    skip: isFilter,
    refetchOnMountOrArgChange: true,
  });

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
      render: (report_date) => moment(report_date).format(FORMAT_DATE),
      onCell: () => {
        return {
          style: {
            whiteSpace: "nowrap",
          },
        };
      },
    },
    {
      title: t("Created Time"),
      dataIndex: "created_time",
      key: "created_time",
      render: (created_time) => moment(created_time).format(`H:mm:ss ${FORMAT_DATE}`),
      onCell: () => {
        return {
          style: {
            whiteSpace: "nowrap",
          },
        };
      },
    },
    {
      title: t("Province"),
      dataIndex: "province",
      key: "province",
      onCell: () => {
        return {
          style: {
            whiteSpace: "nowrap",
          },
        };
      },
    },
    {
      title: t("District"),
      dataIndex: "district",
      key: "district",
      onCell: () => {
        return {
          style: {
            whiteSpace: "nowrap",
          },
        };
      },
    },
    {
      title: t("Ward"),
      dataIndex: "ward",
      key: "ward",
      onCell: () => {
        return {
          style: {
            whiteSpace: "nowrap",
          },
        };
      },
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
          <Tag color={color} key={tag}>
            {t(tag)}
          </Tag>
        );
      },
    },
    {
      title: t("Farm Name"),
      dataIndex: "farm_name",
      key: "farm_name",
      render: (farm_name, record) => {
        return (
          <Button onClick={() => handleShowModal(record)} type="link">
            {farm_name}
          </Button>
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
      title: t("Status"),
      dataIndex: "infected",
      key: "infected",
      render: (infected) => {
        // let color = "#f50";
        let color = "#ff4d4f";

        if (infected === 0) {
          // color = "#87d068";
          color = "#4BB543";
          // color = "#389e0d";
        }

        return (
          <Tag color={color} key={infected}>
            {infected === 1 ? t("Infected") : t("Not Infected")}
          </Tag>
        );
      },
    },
  ];

  const handleShowModal = (data: Reports) => {
    setDataHistory(data);
    setIsModalVisible(true);
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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Row gutter={[0, 20]} justify="center" style={{ padding: 20 }}>
      <Col span={24}>
        <TitleCustom level={3}>{t("Log Report List")}</TitleCustom>
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
            <Col xs={9} sm={10} md={8} lg={6} xxl={4}>
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
            <Col xs={9} sm={10} md={8} lg={6} xxl={4}>
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
            <Col xs={6} sm={4} md={8} lg={6} xxl={4}>
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
            <Col xs={24} lg={6} xxl={{ span: 4, offset: 8 }}>
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
      <Col span={24}>
        <ModalHistory
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          data={dataHistory}
        />
      </Col>
    </Row>
  );
};
