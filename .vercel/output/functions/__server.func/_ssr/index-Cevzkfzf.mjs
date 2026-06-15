import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-light p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-navy-deep mb-2", children: "Something went wrong" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-charcoal/70 text-sm", children: error.message })
] }) });
export {
  SplitErrorComponent as errorComponent
};
