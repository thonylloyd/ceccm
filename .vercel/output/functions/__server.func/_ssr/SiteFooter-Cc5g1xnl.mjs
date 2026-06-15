import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as logo } from "./logo-ccm.png.asset-CPcQKdrq.mjs";
import { X, k as Menu, l as Phone, i as Globe, m as Mail } from "../_libs/lucide-react.mjs";
function SiteHeader({
  nav,
  brandName,
  livestream,
  logoUrl
}) {
  const [open, setOpen] = reactExports.useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-light/95 backdrop-blur-md border-b border-black/5 sticky top-0 z-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between h-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl || logo.url, alt: brandName, className: "h-12 w-12 object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2", children: nav.map((item) => {
        const active = item.url === path || item.url !== "/" && path.startsWith(item.url);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: item.url,
            className: `relative text-[13px] uppercase tracking-[0.18em] font-semibold transition-colors ${active ? "text-navy-deep" : "text-charcoal/70 hover:text-navy-deep"}`,
            children: [
              item.label,
              active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gold" })
            ]
          },
          item.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex items-center gap-3", children: livestream?.url && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: livestream.url,
          className: "inline-flex items-center rounded-md bg-navy-deep px-7 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-navy transition-colors",
          children: livestream.label || "Livestream"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen((v) => !v), className: "lg:hidden text-navy-deep p-2", "aria-label": "Menu", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6" }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden bg-light border-t border-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col px-6 py-6 gap-4", children: [
      nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.url, className: "text-sm uppercase tracking-[0.18em] text-navy-deep font-semibold", onClick: () => setOpen(false), children: item.label }, item.id)),
      livestream?.url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: livestream.url, className: "mt-2 inline-flex justify-center rounded-md bg-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white", children: livestream.label || "Livestream" })
    ] }) })
  ] });
}
function SiteFooter({
  brand,
  contact,
  footer,
  social,
  logoUrl
}) {
  const supportLinks = footer.support_links && footer.support_links.length ? footer.support_links : [
    { label: "Contact Us", url: "/contact" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Terms of Service", url: "/terms" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-navy-deep text-white/80 pt-16 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-gold text-xs uppercase tracking-[0.24em] font-bold mb-5", children: "Support" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: supportLinks.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.url, className: "text-white/65 hover:text-gold transition-colors", children: l.label }) }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl || logo.url, alt: brand.name, className: "h-20 w-20 mx-auto object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm font-display text-white/90", children: brand.name ?? "Church Consolidation Mission" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-gold text-xs uppercase tracking-[0.24em] font-bold mb-5", children: "Connect With Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:justify-end gap-3", children: [
          social.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: social.phone, "aria-label": "Phone", className: "h-9 w-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
          social.website && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: social.website, "aria-label": "Website", className: "h-9 w-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }) }),
          (social.email || contact.email) && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: social.email || `mailto:${contact.email}`, "aria-label": "Email", className: "h-9 w-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 mt-12 pt-6 border-t border-white/10 text-center text-[11px] text-white/50", children: footer.copyright ?? `© ${(/* @__PURE__ */ new Date()).getFullYear()} Church Consolidation Mission. All rights reserved.` })
  ] });
}
export {
  SiteHeader as S,
  SiteFooter as a
};
