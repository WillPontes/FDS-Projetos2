import { ImpactPage }  from '@/features/impacts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
}); 
