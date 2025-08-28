"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";

const PER_PAGE = 12;

/**
 * Client component for the notes listing page.  Manages local state such as
 * current page, search value and modal visibility.  Fetches data via
 * TanStack Query and renders the appropriate child components.  Because
 * this component is declared with `'use client'` it can leverage browser
 * APIs and event handlers.
 */
export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const totalPages = Math.ceil(
    (data?.total ?? 0) / (data?.perPage ?? PER_PAGE)
  );

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Could not fetch the list of notes.</p>}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
