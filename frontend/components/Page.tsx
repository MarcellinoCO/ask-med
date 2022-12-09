import { FC, memo, PropsWithChildren } from "react";

import { twMerge } from "tailwind-merge";
import { Footer, Navbar } from "@components";

type PageProps = {
  className?: string;
};

const Page: FC<PropsWithChildren<PageProps>> = memo(
  ({ className, children }) => (
    <div className="container relative flex flex-col items-stretch w-screen min-h-screen">
      <Navbar />
      <main
        className={twMerge(
          "flex flex-col items-stretch px-2 py-4 w-full",
          className
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
);

Page.displayName = "Page";
export { Page };
