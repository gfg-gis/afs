import React from "react";

import SwitchLanguage from "./SwitchLanguage";

import { MenuOutlined } from "@ant-design/icons";

import { Drawer, Button, Typography } from "antd";

const { Text } = Typography;

const Title = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text>AFS Map</Text>
        <SwitchLanguage />
    </div>
)

interface NavLinkMobileProps {
    children: JSX.Element;
    isVisible: boolean;
    setIsVisible: (boolean: boolean) => void;
}

const NavLinkMobile = ({ children, isVisible, setIsVisible }: NavLinkMobileProps) => {
    return (
        <>
            <Button
                icon={<MenuOutlined />}
                onClick={() => setIsVisible(true)}
            />
            <Drawer
                title={<Title />}
                placement="left"
                onClose={() => setIsVisible(false)}
                visible={isVisible}
                width={280}>
                {children}
            </Drawer>
        </>
    );
};

export default NavLinkMobile;
