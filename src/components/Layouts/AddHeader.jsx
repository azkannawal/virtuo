import { getGuest } from "../../api";
import Header from "../Fragments/Header";

export let a;
getGuest()
  .then((token) => {
    a = token;
    console.log("Token:", a);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const AddHeader = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AddHeader;
