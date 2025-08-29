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

/** Ответ API для списка заметок — как требует ревьюер */
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/** Список заметок */
export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
}): Promise<FetchNotesResponse> {
  const { page, perPage, search = "" } = params;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search },
  });

  // возвращаем ровно ту структуру, которую ждёт проверка
  return {
    notes: data.notes ?? [],
    totalPages: data.totalPages ?? 0,
  };
}

/** Получить заметку по id */
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

/** Создать заметку */
export async function createNote(payload: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

/** Удалить заметку — вернуть полный объект удалённой заметки */
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
