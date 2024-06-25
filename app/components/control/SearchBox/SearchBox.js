import { useCallback, useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import classes from "styles/search-box.module.css";

const SearchBox = ({ className, value, onSearch, placeholder = 'Search', width = null }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (value) {
      setSearchText(value);
    }
  }, [value]);

  const handleFormSubmit = useCallback((e) => {
      e.preventDefault();

      if (!searchText) return;

      onSearch(searchText);
      setSearchText("");
    }, [searchText, onSearch]);

  const handleSearchTextChange = useCallback((e) => {
    const newValue = e.target.value;

    setSearchText(newValue);
  }, []);

  return (
    <Form
      className={`d-flex align-items-center ms-3 me-3 ${className || ''}`}
      style={width && {
        width,
      }}
      onSubmit={handleFormSubmit}
    >
      <InputGroup>
        <Form.Control
          className={classes.searchInput}
          type="search"
          value={searchText}
          onChange={handleSearchTextChange}
          placeholder={placeholder}
          aria-label="Search"
        />
        <Button type="submit" className={classes.searchBtn}>
          <motion.div initial={{ scale: 1.5 }} whileHover={{ scale: 2.0 }}>
            🔍
          </motion.div>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
