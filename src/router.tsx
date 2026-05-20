import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/tanstack-start";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,

    head: () => ({
      meta: [
        {
          title: "Svaraxa Health Insights",
        },
      ],
      links: [
        {
          rel: "icon",
          type: "image/png",
          href: "\public\svaraxa-logo.png.",
        },
      ],
    }),
  });

  return router;
};

export const ClerkProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const publishableKey =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing VITE_CLERK_PUBLISHABLE_KEY environment variable"
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
};