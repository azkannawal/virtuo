import Header from "../Fragments/Header";

const AddHeader = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AddHeader;
