import { siteBuild } from '@/lib/data';

export async function GET() {
  return Response.json(
    {
      service: 'onyx-archive-demo-api',
      status: 'operational',
      demo: true,
      version: siteBuild.version,
      build: siteBuild.build,
      timestamp: new Date().toISOString(),
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
