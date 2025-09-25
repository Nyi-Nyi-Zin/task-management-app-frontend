// components/Title.tsx
import React, { ReactNode } from "react";

type TitleProps = {
  children: ReactNode; // Content inside the title
  size?: "sm" | "md" | "lg" | "xl"; // Optional size
  color?: string; // Tailwind text color class
  align?: "left" | "center" | "right"; // Optional alignment
  className?: string; // Additional custom classes
};

const sizeClasses: Record<NonNullable<TitleProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
};

const Title: React.FC<TitleProps> = ({
  children,
  size = "md",
  color = "text-zinc-700",
  align = "left",
  className = "",
}) => {
  return (
    <h1
      className={`${sizeClasses[size]} ${color} text-${align} font-bold m-4  ${className}`}
    >
      {children}
    </h1>
  );
};

export default Title;
