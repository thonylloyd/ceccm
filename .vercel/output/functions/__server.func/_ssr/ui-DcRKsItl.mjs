import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function PageHeader({ title, description, actions }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3 mb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-navy-deep", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-charcoal/60 mt-1", children: description })
    ] }),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: actions })
  ] });
}
function Field({ label, children, hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60 mb-1.5", children: label }),
    children,
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-charcoal/50 mt-1", children: hint })
  ] });
}
function Input(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      ...props,
      className: `w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white focus:outline-none focus:border-gold ${props.className ?? ""}`
    }
  );
}
function Textarea(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      ...props,
      className: `w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white focus:outline-none focus:border-gold ${props.className ?? ""}`
    }
  );
}
function Button({
  variant = "primary",
  className = "",
  ...rest
}) {
  const styles = {
    primary: "bg-navy-deep text-white hover:bg-navy",
    ghost: "text-charcoal/70 hover:text-navy-deep",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-black/15 text-navy-deep hover:bg-light"
  }[variant];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      ...rest,
      className: `inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.14em] transition-colors disabled:opacity-50 ${styles} ${className}`
    }
  );
}
function Card({ children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-white border border-black/5 rounded-lg p-5 ${className}`, children });
}
export {
  Button as B,
  Card as C,
  Field as F,
  Input as I,
  PageHeader as P,
  Textarea as T
};
