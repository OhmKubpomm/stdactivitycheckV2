import React from "react";
import { getFeedbacks } from "@/actions/feedbackActions";

import { FeedbackList } from "@/components/profile/FeedbackList";
interface SearchParams {
  page?: string;
  limit?: string;
}

const FeedbackPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { feedbacks, count, totalPage } = await getFeedbacks(searchParams);

  return (
    <FeedbackList
      feedbacks={feedbacks}
      itemsPerPage={10}
      totalCount={count}
      totalPage={totalPage}
    />
  );
};

export default FeedbackPage;
