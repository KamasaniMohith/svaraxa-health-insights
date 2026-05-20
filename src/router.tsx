import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/tanstack-start";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,

  head: () => ({
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/svaraxa-logo.png",
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