// Server API routes require expo-router v3+ (Expo SDK 50+); this project is on
// expo-router 2.0.15 / SDK 49, so this file is not yet wired up or reachable.
export async function GET(request: Request) {
  return Response.json({ id: 1, name: 'Placeholder User' });
}
