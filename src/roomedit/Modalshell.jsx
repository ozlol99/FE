// ModalShell.jsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ModalShell({
  open,
  onClose,
  backdropClosable = false,
  children,
  className = '',
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);

    // 최초 포커스
    const el = panelRef.current;
    const first =
      el?.querySelector(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
      ) || el;
    first?.focus?.();

    return () => {
      document.body.style.overflow = prev || '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && backdropClosable) onClose?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-[1px]"
      onMouseDown={onBackdrop}
    >
      <div className="grid min-h-dvh place-items-center p-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={`outline-none ${className}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
