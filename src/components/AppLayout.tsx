import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <main className="pb-24">{children}</main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
