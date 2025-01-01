// components/nav/types.ts
import { ReactNode } from "react";

export interface NavOption {
  label: string | ReactNode;
  onClick: () => void;
  style?: string;
}

export interface RoleOptions {
  [key: string]: NavOption[];
}