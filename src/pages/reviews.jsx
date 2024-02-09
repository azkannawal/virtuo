import React from "react";
import AddMovie from "../components/Layouts/AddMovie";
import useLogin from "../hooks/useLogin";

const ReviewsPage = () => {
  useLogin();
  return <AddMovie path="notes" title="Your Movies Review"/>;
};

export default ReviewsPage;
