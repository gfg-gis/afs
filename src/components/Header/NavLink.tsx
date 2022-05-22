import React, { useMemo } from "react"
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useAppSelector } from "store";

import { Mode } from "models";

import { ROLES, PATHS, COLOR_GREEN, COLOR_GREEN_LIGHT } from "../../constants";

import { Menu } from 'antd';

const MenuCustom = styled(Menu)`  
    & > .ant-menu-item-selected a, & > .ant-menu-item a:hover {
        color: ${COLOR_GREEN}; 
    } 

    &:not(.ant-menu-dark) > .ant-menu-item-selected:after, &:not(.ant-menu-dark) > .ant-menu-item:hover::after{
        border-bottom: 2px solid ${COLOR_GREEN};
    }

    &:not(.ant-menu-horizontal) .ant-menu-item-selected  {
        background-color: ${COLOR_GREEN_LIGHT};
    }
`;

interface NavLinkProps {
    mode?: Mode;
    setIsVisible: (boolean: boolean) => void;
}

const NavLink = ({ mode = "horizontal", setIsVisible }: NavLinkProps) => {
    const { t } = useTranslation();

    const userRole = useAppSelector(state => state.user.role);
    const location = useLocation();
    const { pathname } = location;

    const newPath = useMemo(() => {
        const arr = [...PATHS];

        if (userRole === ROLES[0]) {
            return arr.splice(0, 4);
        } else if (userRole === ROLES[1]) {
            return arr.splice(0, 5);
        } else {
            return arr.splice(0, 2);
        }

    }, [userRole]);

    const items = useMemo(() => newPath.map((item, key) => ({
        key,
        label: <Link onClick={() => setIsVisible(false)} to={item.path}>{t(item.name)}</Link>
    })), [newPath, t, setIsVisible]);

    const defaultSelectedKeys = useMemo(() => PATHS.findIndex((item) => item.path === pathname).toString(), [pathname]);

    return (
        <MenuCustom
            style={{ border: 0 }}
            theme="light"
            mode={mode}
            defaultSelectedKeys={[defaultSelectedKeys]}
            selectedKeys={[defaultSelectedKeys]}
            items={items}
        />
    );
}

export default NavLink;