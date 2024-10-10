import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (e.g., sign-in, sign-up)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// Clerk middleware to protect routes
export default clerkMiddleware((auth, request) => {
  // If the route is not public, ensure the user is authenticated
  if (!isPublicRoute(request)) {
    // Protect the route, allowing only authenticated users
    auth().protect();
  }
});

// Configuration for the middleware to skip certain Next.js internals and static files
export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
