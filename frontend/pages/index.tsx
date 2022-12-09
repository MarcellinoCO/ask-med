import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { Page } from "@components";
import { MagnifyingGlass } from "@icons";

const Home = () => {
  const { push } = useRouter();

  const [query, setQuery] = useState("");
  const onSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (query) push({ pathname: "/search", query: { q: query } });
    },
    [push, query]
  );

  return (
    <Page className="justify-center items-center h-[calc(100vh-4rem)]">
      <h1>Ask Med</h1>
      <p>about your medical questions</p>

      <form className="input-group justify-center mt-4" onSubmit={onSearch}>
        <input
          className="input input-primary input-bordered w-full max-w-lg transition"
          placeholder="Search…"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="btn btn-primary btn-square" type="submit">
          <MagnifyingGlass />
        </button>
      </form>
    </Page>
  );
};

export default Home;
