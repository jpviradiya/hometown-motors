import React from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface PageTitleProps {
  title?: string;
}

/**
 * Declarative component for setting the browser tab title in JSX layouts.
 */
export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

export default PageTitle;
