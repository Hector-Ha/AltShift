import React from "react";
import LogoImage from "../assets/logos/logo.svg";
import LogoWhiteImage from "../assets/logos/logo-white.svg";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  width?: string | number;
  height?: string | number;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = "default",
  width = 32,
  height = 32,
}) => {
  const src = variant === "white" ? LogoWhiteImage : LogoImage;

  return (
    <img
      src={src}
      alt="AltShift Logo"
      className={className}
      width={width}
      height={height}
      style={{ objectFit: "contain" }}
    />
  );
};

export default Logo;
