import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: { id: string };
}

/**
 * SSR для страницы деталей заметки.
 * На сервере префетчим заметку и гидратируем кеш для клиента.
 */
export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const queryClient = getQueryClient();
  const numericId = Number(params.id);

  if (!Number.isNaN(numericId)) {
    await queryClient.prefetchQuery({
      queryKey: ["note", numericId],
      queryFn: () => fetchNoteById(numericId),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
