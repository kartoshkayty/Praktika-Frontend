import { concat } from "@/helpers/concat";
import "./styles.css";
import { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";

export interface LoadingProps {
  className?: string;
  color?: CSSProperties["backgroundColor"];
}

export default function Loading({ className, color }: LoadingProps) {
  return (
    <div
      className={concat(className, "animated-scale rounded-full w-5 h-5")}
      style={{
        backgroundColor: color ?? "#8AA382",
      }}
    ></div>
  );
}
