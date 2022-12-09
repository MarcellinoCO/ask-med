import { Page, SearchBar } from "@components";

const Home = () => (
  <Page className="justify-center items-center h-[calc(100vh-4rem)]">
    <h1>Ask Med</h1>
    <p>about your medical questions</p>

    <SearchBar className="mt-4" />
  </Page>
);

export default Home;
