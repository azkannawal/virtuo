import React from "react";
import AddMovie from "./../components/Layouts/AddMovie";
import useLogin from "../hooks/useLogin";

const TrackedPage = () => {
  useLogin();
  return <AddMovie path="notes" title="Your Tracked Movies"/>;
};

export default TrackedPage;
