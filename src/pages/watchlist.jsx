import React from "react";
import AddMovie from "./../components/Layouts/AddMovie";
import useLogin from "../hooks/useLogin";

const WatchListPage = () => {
  useLogin();
  return <AddMovie path="movies" title="Your Watchlist" />;
};

export default WatchListPage;
