import "./index.css"; //ha
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import store from "./app/store";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import DetailPage from "./pages/detail";
import ResultPage from "./pages/results";
import NotFoundPage from "./pages/notfound";
import AddHeader from "./components/Layouts/AddHeader";
import WatchListPage from "./pages/watchlist";
import TrackedPage from "./pages/tracked";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AddHeader>
        <LoginPage />
      </AddHeader>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/home",
    element: (
      <AddHeader>
        <HomePage />
      </AddHeader>
    ),
  },
  {
    path: "/results",
    element: (
      <AddHeader>
        <ResultPage />
      </AddHeader>
    ),
  },
  {
    path: "/detail/:id",
    element: (
      <AddHeader>
        <DetailPage />
      </AddHeader>
    ),
  },
  {
    path: "/watchlist",
    element: (
      <AddHeader>
        <WatchListPage />
      </AddHeader>
    ),
  },
  {
    path: "/tracked",
    element: (
      <AddHeader>
        <TrackedPage />
      </AddHeader>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
