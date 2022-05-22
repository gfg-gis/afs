import React, { useState } from "react";
import styled from "styled-components";

import NavLink from "./NavLink";
import Logo from "./Logo";
import Info from "./Info";
import SwitchLanguage from "./SwitchLanguage";
import NavLinkMobile from "./NavLinkMobile";



const Wrapper = styled.div` 
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center; 
  border-bottom: solid 1px #e8e8e8;
  overflow: auto;
  box-shadow: 0 0 30px #f3f1f1;

  .nav-link {
    width: 100%;
    display: block;
  }

  .nav-link-mobile {
    display: none;
  } 

  .logo {
    display: block;
  }

  .nav-left {
    display: flex;
    align-items: center;

    .switch-language {
      display: block;
      margin-right: 20px;
    }
  
    .switch-language, .info {
      cursor: pointer;
    }
  }
  
  
  @media (max-width: 750px) { 
    .nav-left {
      .switch-language {
        display: none;
      }
    }

    .nav-link {
      display: none;
    }

    .nav-link-mobile {
      display: block;
    } 
  }
`;


const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Wrapper>
      <div className="nav-link-mobile">
        <NavLinkMobile isVisible={isVisible} setIsVisible={setIsVisible}>
          <NavLink mode="vertical" setIsVisible={setIsVisible} />
        </NavLinkMobile>
      </div>
      <div className="logo">
        <Logo />
      </div>
      <div className="nav-link">
        <NavLink setIsVisible={setIsVisible} />
      </div>
      <div className="nav-left">
        <div className="switch-language">
          <SwitchLanguage />
        </div>
        <div className="info">
          <Info />
        </div>
      </div>
    </Wrapper>
  );
};

export default Header;
