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
  const { feedbacks, count, totalPage, chartData } = await getFeedbacks(
    searchParams
  );

  return (
    <FeedbackList
      feedbacks={feedbacks}
      itemsPerPage={parseInt(searchParams.limit || "10")}
      totalCount={count}
      totalPage={totalPage}
      chartData={chartData}
    />
  );
};

export default FeedbackPage;
