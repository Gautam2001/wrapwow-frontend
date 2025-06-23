import React, { createContext, useState, useContext, useCallback } from "react";

const GlobalPopupContext = createContext();

export const usePopup = () => useContext(GlobalPopupContext);

export const GlobalPopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showPopup = useCallback(
    (message, type = "success", duration = 4000) => {
      setPopup({ show: true, message, type });

      setTimeout(() => {
        setPopup({ show: false, message: "", type: "success" });
      }, duration);
    },
    []
  );

  const closePopup = () => {
    setPopup({ show: false, message: "", type: "success" });
  };

  return (
    <GlobalPopupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      {popup.show && <GlobalPopup message={popup.message} type={popup.type} />}
    </GlobalPopupContext.Provider>
  );
};

const GlobalPopup = ({ message, type }) => {
  return <div className={`global-popup ${type}`}>{message}</div>;
};
