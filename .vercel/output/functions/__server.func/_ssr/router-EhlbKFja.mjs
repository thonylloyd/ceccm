import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as notFound, T as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "./server-Cl-mkr1Z.mjs";
import { s as supabase } from "./client-CW46O5zz.mjs";
import { s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-Bk1rRZSP.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Church Consolidation Mission" },
      { name: "description", content: "Consolidating the Body of Christ" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Church Consolidation Mission" },
      { property: "og:description", content: "Consolidating the Body of Christ" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Church Consolidation Mission" },
      { name: "twitter:description", content: "Consolidating the Body of Christ" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2b8f0584-1f56-4b62-8484-db0e69a2e591" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2b8f0584-1f56-4b62-8484-db0e69a2e591" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", richColors: true })
  ] });
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getVideoLibrary = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ba0b7809e1b77e99fe78512cb006981a257429e742391e135feb6c7d488997a7"));
const videoLibraryQuery = () => queryOptions({
  queryKey: ["videos", "library"],
  queryFn: () => getVideoLibrary(),
  staleTime: 3e4
});
const getVideoBySlug = createServerFn({
  method: "POST"
}).inputValidator((d) => ({
  slug: stringType().min(1).parse(d.slug)
})).handler(createSsrRpc("426e7bfd8bf7784d80defbf7974ae221080d29ae53810d34e72cb03c0cd7fce0"));
const getHomepageContent = createServerFn({
  method: "GET"
}).handler(createSsrRpc("94c086f20075eea7704418952632703660682c76b793182a33273a52dc27f498"));
const homepageQuery = () => queryOptions({
  queryKey: ["homepage"],
  queryFn: () => getHomepageContent(),
  staleTime: 3e4
});
const getSiteChrome = createServerFn({
  method: "GET"
}).handler(createSsrRpc("4ed7a4ded3c2e46db9c8a58b82cb4efcc161e0adfae83f7fec0b2ce245431f71"));
const siteChromeQuery = () => queryOptions({
  queryKey: ["site-chrome"],
  queryFn: () => getSiteChrome(),
  staleTime: 6e4
});
const $$splitComponentImporter$f = () => import("./videos-CHYfX0nY.mjs");
const $$splitNotFoundComponentImporter$2 = () => import("./videos-KOBac05s.mjs");
const $$splitErrorComponentImporter$2 = () => import("./videos-koVrkzgd.mjs");
const Route$f = createFileRoute("/videos")({
  loader: async ({
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(videoLibraryQuery()), context.queryClient.ensureQueryData(siteChromeQuery())]);
  },
  head: () => ({
    meta: [{
      title: "Video Library — Church Consolidation Mission"
    }, {
      name: "description",
      content: "Watch transformational teachings, leadership training, ministry broadcasts and faith-building content from CCM."
    }, {
      property: "og:title",
      content: "Video Library — CCM"
    }, {
      property: "og:description",
      content: "Stream ministry videos, sermons, training and broadcasts."
    }, {
      property: "og:type",
      content: "website"
    }],
    links: [{
      rel: "canonical",
      href: "https://ceccm.lovable.app/videos"
    }]
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./auth-DyHJlLQ_.mjs");
const Route$e = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Sign In — Church Consolidation Mission"
    }, {
      name: "description",
      content: "Sign in or create your CCM member account to access programs, resources and the global ministry community."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./route-BFsOu0JM.mjs");
const Route$d = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./index-C4vPceBf.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./index-KOBac05s.mjs");
const $$splitErrorComponentImporter$1 = () => import("./index-Cevzkfzf.mjs");
const Route$c = createFileRoute("/")({
  loader: async ({
    context
  }) => {
    await context.queryClient.ensureQueryData(homepageQuery());
  },
  head: () => ({
    meta: [{
      title: "Church Consolidation Mission — Consolidating the Body of Christ"
    }, {
      name: "description",
      content: "CCM is a global Christian ministry strengthening churches, raising leaders, and impacting communities through the gospel of Jesus Christ."
    }, {
      property: "og:title",
      content: "Church Consolidation Mission"
    }, {
      property: "og:description",
      content: "Consolidating the Body of Christ — a global ministry strengthening churches, developing leaders, and impacting communities."
    }, {
      property: "og:type",
      content: "website"
    }]
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const videoQuery = (slug) => queryOptions({
  queryKey: ["video", slug],
  queryFn: () => getVideoBySlug({
    data: {
      slug
    }
  })
});
const $$splitComponentImporter$b = () => import("./videos._slug-DRBZu37N.mjs");
const $$splitNotFoundComponentImporter = () => import("./videos._slug-CYtiuojQ.mjs");
const $$splitErrorComponentImporter = () => import("./videos._slug-koVrkzgd.mjs");
const Route$b = createFileRoute("/videos/$slug")({
  loader: async ({
    context,
    params
  }) => {
    const r = await context.queryClient.ensureQueryData(videoQuery(params.slug));
    if (!r.video) throw notFound();
    await context.queryClient.ensureQueryData(siteChromeQuery());
  },
  head: ({
    params,
    loaderData
  }) => {
    const v = loaderData?.video;
    return {
      meta: [{
        title: v?.seo_title || `${v?.title ?? "Video"} — CCM`
      }, {
        name: "description",
        content: v?.seo_description || v?.description || "Watch CCM ministry videos."
      }, {
        property: "og:title",
        content: v?.title ?? "Video"
      }, {
        property: "og:description",
        content: v?.description ?? ""
      }, {
        property: "og:type",
        content: "video.other"
      }, ...v?.thumbnail_url ? [{
        property: "og:image",
        content: v.thumbnail_url
      }] : []],
      links: [{
        rel: "canonical",
        href: `https://ceccm.lovable.app/videos/${params.slug}`
      }],
      scripts: v ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail_url,
          uploadDate: v.publish_date,
          contentUrl: v.video_url || v.youtube_url || v.vimeo_url
        })
      }] : []
    };
  },
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./route-DNFjhO6E.mjs");
const Route$a = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-CI0yy3BY.mjs");
const Route$9 = createFileRoute("/_authenticated/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./videos-BbqK2Er_.mjs");
const Route$8 = createFileRoute("/_authenticated/admin/videos")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./users-Bj_BTytC.mjs");
const Route$7 = createFileRoute("/_authenticated/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./settings-BO1nU2U7.mjs");
const Route$6 = createFileRoute("/_authenticated/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./programs-BkVY93_a.mjs");
const Route$5 = createFileRoute("/_authenticated/admin/programs")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./navigation-DObUTBoU.mjs");
const Route$4 = createFileRoute("/_authenticated/admin/navigation")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./media-uycXDBne.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/media")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./homepage-3qsVYQwh.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/homepage")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./contact-CrKKKVmS.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/contact")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./about-CkTVYzhJ.mjs");
const Route = createFileRoute("/_authenticated/admin/about")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VideosRoute = Route$f.update({
  id: "/videos",
  path: "/videos",
  getParentRoute: () => Route$g
});
const AuthRoute = Route$e.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$g
});
const AuthenticatedRouteRoute = Route$d.update({
  id: "/_authenticated",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const VideosSlugRoute = Route$b.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => VideosRoute
});
const AuthenticatedAdminRouteRoute = Route$a.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminIndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminVideosRoute = Route$8.update({
  id: "/videos",
  path: "/videos",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminUsersRoute = Route$7.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminSettingsRoute = Route$6.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminProgramsRoute = Route$5.update({
  id: "/programs",
  path: "/programs",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminNavigationRoute = Route$4.update({
  id: "/navigation",
  path: "/navigation",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminMediaRoute = Route$3.update({
  id: "/media",
  path: "/media",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminHomepageRoute = Route$2.update({
  id: "/homepage",
  path: "/homepage",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminContactRoute = Route$1.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminAboutRoute = Route.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminRouteRouteChildren = {
  AuthenticatedAdminAboutRoute,
  AuthenticatedAdminContactRoute,
  AuthenticatedAdminHomepageRoute,
  AuthenticatedAdminMediaRoute,
  AuthenticatedAdminNavigationRoute,
  AuthenticatedAdminProgramsRoute,
  AuthenticatedAdminSettingsRoute,
  AuthenticatedAdminUsersRoute,
  AuthenticatedAdminVideosRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteRouteWithChildren = AuthenticatedAdminRouteRoute._addFileChildren(
  AuthenticatedAdminRouteRouteChildren
);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRouteRoute: AuthenticatedAdminRouteRouteWithChildren
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const VideosRouteChildren = {
  VideosSlugRoute
};
const VideosRouteWithChildren = VideosRoute._addFileChildren(VideosRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute,
  VideosRoute: VideosRouteWithChildren
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$b as R,
  videoQuery as a,
  createSsrRpc as c,
  homepageQuery as h,
  router as r,
  siteChromeQuery as s,
  videoLibraryQuery as v
};
