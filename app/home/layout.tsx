import NavbarHome from "@/components/NavbarHome";
import type { Metadata } from "next";
import '@mdxeditor/editor/style.css';
import PushNotificationManager from "@/components/PushNotificationManger";

export const metadata: Metadata = {
  title: "Medium Clone - Home",
  description: "Medium Clone",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full mx-auto flex flex-col light w-full gap-1">
      <PushNotificationManager />
      <NavbarHome />
      <hr className="border-b-2 border-blue-600" />
      <div className="md:w-8/12 mx-auto p-2 w-full">
        {children}
      </div>
    </div>
  );
}
