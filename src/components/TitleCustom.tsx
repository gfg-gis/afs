import React from "react";
import styled from "styled-components";

import { TitleProps } from "antd/lib/typography/Title";

import { COLOR_GREEN } from "../constants";

import { Typography } from "antd";

const { Title } = Typography;

const NewTitle = styled(Title)`
    color: ${COLOR_GREEN}!important;
    margin: 0;
`;

export const TitleCustom = ({ children, ...rest }: TitleProps) => {
    return (
        <NewTitle {...rest}>{children}</NewTitle >
    )
}