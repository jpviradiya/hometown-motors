import React from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  useDocumentTitle("Page Not Found");

  return (
    <div className="flex h-full min-h-[450px] items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
