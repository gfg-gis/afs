import React from 'react';
import styled from 'styled-components';

import { COLOR_DARK_LIGHT } from "../constants";

import { Spin } from 'antd';


const Wrapper = styled.div` 
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px; 
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  background-color: ${COLOR_DARK_LIGHT};
`;

export const PageLoading = () => {
  return (
    <Wrapper>
      <Spin size="large" />
    </Wrapper>
  )
}