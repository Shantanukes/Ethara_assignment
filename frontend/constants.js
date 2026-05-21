export const AVATAR_COLORS = {
  blue:   { bg: "#E6F1FB", fg: "#185FA5" },
  coral:  { bg: "#FAECE7", fg: "#993C1D" },
  teal:   { bg: "#E1F5EE", fg: "#0F6E56" },
  purple: { bg: "#EEEDFE", fg: "#534AB7" },
  amber:  { bg: "#FAEEDA", fg: "#854F0B" },
};
export const AKEYS = Object.keys(AVATAR_COLORS);

export const STATUS_MAP = {
  todo:        { label: "To Do",       bg: "#F1EFE8", fg: "#444441" },
  "in-progress":{ label: "In Progress", bg: "#FAEEDA", fg: "#854F0B" },
  done:        { label: "Done",        bg: "#EAF3DE", fg: "#3B6D11" },
};
export const PRIORITY_MAP = {
  low:    { fg: "#3B6D11" },
  medium: { fg: "#854F0B" },
  high:   { fg: "#A32D2D" },
};

export const TODAY = new Date().toISOString().split("T")[0];
export const pd = (d) => new Date(Date.now() - d * 86400000).toISOString().split("T")[0];
export const fd = (d) => new Date(Date.now() + d * 86400000).toISOString().split("T")[0];
export const isOverdue = (t) => t.status !== "done" && t.dueDate < TODAY;
export const genId = () => Math.random().toString(36).slice(2, 9);
