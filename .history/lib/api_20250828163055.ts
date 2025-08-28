// lib/api.ts
import axios from "axios";
import type { Note } from "@/types/note";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

// ---- Список ----
export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
}) {
  const { page, perPage, search = "" } = params;
  const { data } = await api.get<{
    items: Note[];
    page: number;
    perPage: number;
    total: number;
  }>("/notes", { params: { page, perPage, search } });
  return data;
}

// ---- По id ----
export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

// ---- Создать ----
export async function createNote(payload: {
  title: string;
  content: string;
  tag: Note["tag"];
}) {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

// ---- Удалить ----
export async function deleteNote(id: string) {
  await api.delete(`/notes/${id}`);
  return { id };
}
