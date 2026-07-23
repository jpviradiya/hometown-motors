import { useEffect } from "react";

const APP_NAME = "Hometown Motors";

/**
 * Custom React hook to dynamically manage the browser document title.
 * Formats titles as `${title} • Hometown Motors` or `Hometown Motors` if no title is provided.
 *
 * @param title - The dynamic title of the current page or component.
 * @param preserveOnUnmount - Optional flag to retain the title after component unmounts.
 */
export function useDocumentTitle(title?: string, preserveOnUnmount = false): void {
  useEffect(() => {
    const previousTitle = document.title;
    const cleanTitle = title?.trim();
    const formattedTitle = cleanTitle ? `${cleanTitle} • ${APP_NAME}` : APP_NAME;

    document.title = formattedTitle;

    return () => {
      if (!preserveOnUnmount) {
        document.title = previousTitle;
      }
    };
  }, [title, preserveOnUnmount]);
}

export default useDocumentTitle;
