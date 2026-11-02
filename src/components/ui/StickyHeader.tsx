import type { ReactNode } from "react";
import Link from "next/link";

type StickyHeaderProps = {
  children: ReactNode;
  onClear?: () => void;
};

export default function StickyHeader({ children, onClear }: StickyHeaderProps) {
  return (
    <header className="top">
      <div className="top-in">
        {children}
        <div className="top-actions">
          {onClear && (
            <button type="button" className="btn link top-clear-button" onClick={onClear}>
              Borrar todo
            </button>
          )}
          <Link href="/" className="btn import-back-button top-back-button">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 4.5 7 10l5.5 5.5M7.5 10h8" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </header>
  );
}
