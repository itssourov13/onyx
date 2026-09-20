import { getEntries } from '@/lib/content';
import { networkEdges, networkNodes } from '@/lib/data';

export function getDemoMetrics() {
  return {
    simulatedNodes: networkNodes.length,
    archivedItems: getEntries('documents').length,
    networkEdges: networkEdges.length,
    uptime: '99.982%',
  } as const;
}
