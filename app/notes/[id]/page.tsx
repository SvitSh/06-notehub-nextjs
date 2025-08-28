import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/lib/getQueryClient';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: { id: string };
}

/**
 * Server component for the dynamic note details route.  Prefetches the
 * requested note on the server and hydrates the cache on the client so
 * that the NoteDetailsClient component can render immediately without a
 * network request.
 */
export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const queryClient = getQueryClient();
  const numericId = Number(params.id);
  // Only prefetch if a valid numeric ID is provided
  if (!Number.isNaN(numericId)) {
    await queryClient.prefetchQuery(['note', numericId], () => fetchNoteById(numericId));
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}