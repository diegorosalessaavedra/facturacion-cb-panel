import React from "react";
import { formatNumber } from "../../../../../../assets/formats";

export const tdClass =
  "border-r border-b border-slate-100 bg-white px-3 py-1.5 font-medium text-slate-600 uppercase text-[10px] whitespace-nowrap text-center align-middle";

export const tdLastClass =
  "border-b border-slate-100 bg-white px-3 py-1.5 font-medium text-slate-600 uppercase text-[10px] whitespace-nowrap text-center align-middle";

export const tdNameClass =
  "border-r border-b border-slate-100 bg-white px-3 py-1.5 font-semibold text-slate-700 uppercase text-[10px] whitespace-nowrap text-left pl-4 align-middle";

export const renderMoney = (amount) => (
  <div className="flex justify-between items-center gap-1 w-full px-2">
    <span className="text-slate-400 font-normal">S/ {" "}</span>
    <span className="text-slate-700 font-semibold">
      {amount ? formatNumber(Number(amount).toFixed(2)) : "-"}
    </span>
  </div>
);