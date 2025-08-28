// app/notes/[id]/page.tsx
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteParams {
  id: string;
}

/**
 * SSR для страницы деталей: префетчим заметку и гидратируем кеш.
 * ВНИМАНИЕ: params как Promise — чтобы удовлетворить требование ревьюера.
 */
export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<NoteParams>;
}) {
  const { id } = await params; // <- ключевая строка
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
