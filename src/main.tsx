import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { SessionsPage } from '@/pages/SessionsPage';
import { FamilyProfilesPage } from '@/pages/FamilyProfilesPage';
import { ApprovalsPage } from '@/pages/ApprovalsPage';
import { DemoPage } from '@/pages/DemoPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/sessions",
    element: <SessionsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/family",
    element: <FamilyProfilesPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/approvals",
    element: <ApprovalsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/demo",
    element: <DemoPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors closeButton />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)