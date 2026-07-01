import { Suspense } from "react";
import SearchPage from "@/components/SearchPage";
import Loading from "../loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medium Clone - Search",
  description:"Search Page"
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPage />
    </Suspense>
  );
}