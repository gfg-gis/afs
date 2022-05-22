import React from "react";
import styled from "styled-components";

import { ButtonProps } from "antd/lib/button";

import { COLOR_GREEN } from "../constants";

import { Button } from "antd";

const NewButton = styled(Button)`
    background: ${COLOR_GREEN};
    border-color: ${COLOR_GREEN};
    font-weight: 500;
    padding: 0 20px;

    &:hover, &:focus {
        background: ${COLOR_GREEN};
        border-color: ${COLOR_GREEN}; 
    }
`;

interface ButtonCustomProps extends ButtonProps {
    onClick?: () => void
}

export const ButtonCustom = ({ children, onClick, ...rest }: ButtonCustomProps) => {
    return (
        <NewButton {...rest} onClick={onClick}>{children}</NewButton>
    );
}