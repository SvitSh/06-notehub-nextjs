// Shared type definitions for notes used throughout the application

/**
 * Allowed tag values for a note.  These values map to distinct categories
 * supported by the backend API.  If you add new tags on the server you
 * should update this union accordingly.
 */
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

/**
 * Core Note interface.  Represents a single note as returned from the
 * backend API.  All fields are required for proper rendering.
 */
export interface Note {
  id: number;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}