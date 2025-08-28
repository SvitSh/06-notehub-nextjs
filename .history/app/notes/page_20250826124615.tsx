import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/lib/getQueryClient';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

/**
 * Server component for the `/notes` route.  Prefetches the first page of
 * notes on the server and hydrates the query cache on the client.  All
 * interactive behaviour and state management is delegated to the
 * NotesClient component.
 */
export default async function NotesPage() {
  const queryClient = getQueryClient();
  // Prefetch the first page so that the client starts with data
  await queryClient.prefetchQuery([
    'notes',
    1,
    PER_PAGE,
    '',
  ], () => fetchNotes({ page: 1, perPage: PER_PAGE }));
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient />
    </HydrationBoundary>
  );
}