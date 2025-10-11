import { createElement, ComponentType, SVGProps } from "react";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

interface IconComponentProps extends IconProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Reusable Icon component that handles the createElement and type casting
 * Usage: <Icon icon={Home} width={20} height={20} />
 */
export const Icon = ({ icon, ...props }: IconComponentProps) => {
  return createElement(icon, props);
};

export default Icon;
