"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Модалка рендерится УСЛОВНО (монтируется только когда открыта),
 * поэтому isOpen проп не нужен. Блокируем скролл на время монтирования.
 */
export default function Modal({ onClose, children }: ModalProps) {
  // Блокируем прокрутку body пока модалка смонтирована
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Закрытие по Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Закрытие по клику по бэкдропу
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
}
