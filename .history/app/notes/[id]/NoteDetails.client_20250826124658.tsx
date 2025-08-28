"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

/**
 * Client component responsible for displaying the details of a single note.
 * Retrieves the note ID from the route params, fetches the note via
 * React Query and renders loading, error or the actual data accordingly.
 */
export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const idParam = params?.id;
  const numericId = Number(idParam);
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', numericId],
    queryFn: () => fetchNoteById(numericId),
    enabled: !Number.isNaN(numericId),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}