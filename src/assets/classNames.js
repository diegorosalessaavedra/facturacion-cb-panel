export const inputClassNames = {
  inputWrapper: "min-h-10 border-1.5 border-neutral-400",
  label: "pb-[3px] text-[0.8rem] text-neutral-800 font-semibold",
};

export const inputNoLabelClassNames = {
  inputWrapper: "min-h-9 border-1.5 border-neutral-400",
  label: "hidden",
};

export const selectClassNames = {
  trigger: "relative min-h-10 border-1.5 border-neutral-400",
  label: "pb-[3px] text-[0.8rem] text-neutral-800 font-semibold ",
  value: "text-[11px]",
};
export const selectNoLabelClassNames = {
  trigger: "h-9 border-1.5 border-neutral-400",
  label: "hidden",
};

export const preventNonNumericInput = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
