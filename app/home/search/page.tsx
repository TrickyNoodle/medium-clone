// page.tsx
import { Suspense } from "react";
import SearchPage from "@/components/SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <SearchPage />
    </Suspense>
  );
}