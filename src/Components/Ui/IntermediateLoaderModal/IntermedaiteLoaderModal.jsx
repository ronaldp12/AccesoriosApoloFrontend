import React, { useContext } from "react";
import "./IntermediateLoaderModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context.jsx";

export const IntermediateLoaderModal = () => {
  const { isIntermediateLoading } = useContext(context);

  return (
    isIntermediateLoading && (
      <div className="intermediate-loader-overlay">
        <img src={wheelIcon} alt="Cargando..." className="spinning-wheel" />
      </div>
    )
  );
};
