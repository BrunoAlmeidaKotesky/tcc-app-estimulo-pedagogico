"use client";
import { Select, MenuItem, FormLabel } from "@mui/material";
import { useDashboardStore } from "@/store/index";

const ALL_CHILDREN = "Todos os filhos";
export function DashboardDropdown(props: { children: string[] }) {
  const store = useDashboardStore();
  return (
    <div>
      <Select
        value={store.selectedChild}
        onChange={(ev) => {
          ev.preventDefault();
          const value = ev.target.value as string;
          store.setIsEveryChild(value === ALL_CHILDREN);
          store.setSelectedChild(value);
        }}
      >
        {[ALL_CHILDREN, ...props.children].map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
