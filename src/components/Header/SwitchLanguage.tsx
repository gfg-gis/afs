import React, { useState } from "react";
import { useLocalStorageState } from "ahooks";

import usFlag from "assets/images/us.png";
import vnFlag from "assets/images/vn.png";

import { useTranslation } from "react-i18next";

import { Image } from "antd";

const SwitchLanguage = () => {
  const { i18n } = useTranslation();
  const [i18nextLng] = useLocalStorageState("i18nextLng", {
    deserializer: (value: string) => value,
  });

  const [lang, setLang] = useState(i18nextLng);

  const handleClickChangeLanguage = () => {
    if (lang === "en") {
      i18n.changeLanguage("vi");
      setLang("vi");
    } else {
      i18n.changeLanguage("en");
      setLang("en");
    }
  };

  return (
    <Image
      preview={false}
      width={35}
      src={lang === "en" ? usFlag : vnFlag}
      onClick={handleClickChangeLanguage}
    />
  );
};

export default SwitchLanguage;
