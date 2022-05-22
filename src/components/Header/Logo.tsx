import React from "react";
import logo from "assets/images/logo.jpeg";

import { Image } from "antd";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" style={{ padding: 0 }}>
      <Image src={logo} alt="logo" width={80} preview={false} />
    </Link>
  );
};

export default Logo;
