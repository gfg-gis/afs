import React from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";

import { useAppSelector, useAppDispatch } from "store";
import { userLogout } from "slice";

import { Mode } from "models";

import { Menu, Dropdown, Avatar, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface LabelProps {
    direction?: Mode
    title: string;
    value: string | undefined | null;
}

const Label = ({ direction = "vertical", title, value }: LabelProps) => {
    const { t } = useTranslation();

    return (
        <Space direction={direction}>
            <Text type="secondary">{t(title)}</Text>
            <Text>{value}</Text>
        </Space>
    );
}

const Info = () => {

    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.user.info);

    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect().catch(e => {
            console.error(e);
        });

        dispatch(userLogout());
    }

    const menu = () => {
        return (
            <Menu
                items={[
                    {
                        label: <Label title={"FULL NAME"} value={userInfo?.fullName} />,
                        key: "0",
                    },
                    {
                        type: "divider",
                    },
                    {
                        label: <Label title={"EMAIL"} value={userInfo?.email} />,
                        key: "1",
                    },
                    {
                        type: "divider",
                    },
                    {
                        label: <Label title={"JOB TITLE"} value={userInfo?.jobTitle} />,
                        key: "2",
                    },
                    {
                        type: "divider",
                    },
                    {
                        label: (
                            <Space onClick={handleLogout} style={{ width: "100%" }}>
                                <LogoutOutlined />
                                <Text>{t("Logout")}</Text>
                            </Space>
                        ),
                        key: "3",
                    },
                ]}
            />
        );
    }

    return (
        <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar
                size={40}
                src={`https://avatars.dicebear.com/api/initials/${userInfo?.fullName}.svg`}>
            </Avatar>
        </Dropdown>
    );
};

export default Info;
