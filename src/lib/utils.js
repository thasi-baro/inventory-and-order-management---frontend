import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

//Gộp các class CSS có điều kiện và tự xử lý xung đột của Tailwind CSS.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}