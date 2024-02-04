import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchMovie } from "../../api";
import { setSearchResult } from "../../features/movie/searchSlice";
import { useNavigate } from "react-router-dom";

const SearchComponent = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (isFocused & searchQuery.length > 0) {
          const query = await searchMovie(searchQuery);
          dispatch(setSearchResult(query));
          navigate("/results");
        } else if (isFocused & searchQuery.length == 0) {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error in handleSearch:", error);
      }
    };

    handleSearch();
  }, [searchQuery, dispatch, navigate]);

  return (
    <div style={{ display: "flex", gap: "10px", height: "30px" }}>
      <input
        type="text"
        placeholder="search movie"
        className="custom-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: `${isFocused || searchQuery.length > 0 ? "140px" : "30px"}`,
          cursor: `${isFocused ? "auto" : "pointer"}`,
          backgroundColor: "transparent",
          paddingLeft: "32px",
          color: "white",
          border: "none",
          transition: "width 0.3s ease, padding-left 0.3s ease",
          backgroundImage: "url(/images/search-icon.svg)",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

export default SearchComponent;
