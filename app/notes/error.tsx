"use client";

interface NotesErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

/**
 * Error boundary for the `/notes` route.  Displays a human friendly
 * message when the list of notes cannot be retrieved.
 */
export default function NotesError({ error }: NotesErrorProps) {
  return <p>Could not fetch the list of notes. {error.message}</p>;
}