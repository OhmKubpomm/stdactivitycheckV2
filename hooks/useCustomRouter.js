import { useRouter, useSearchParams } from "next/navigation";

const useCustomRouter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = {};
  const search = searchParams.get("search");
  const page = searchParams.get("page");

  if (search) query.search = search;
  if (page) query.page = parseInt(page);

  const pushQuery = ({ search, page }) => {
    if (search !== undefined) {
      search === "" ? delete query.search : (query.search = search);
    }
    if (page !== undefined) {
      page === 1 ? delete query.page : (query.page = page);
    }

    const newQuery = new URLSearchParams(query).toString();
    router.push(`?${newQuery}`);
  };

  return { pushQuery, query };
};

export default useCustomRouter;
