import { useState } from 'react';
import {
  SearchForm,
  SearchFormBtn,
  SearchFormInput,
  SearchbarHeader,
} from './Searchbar.styled';
import { FaSearch } from 'react-icons/fa';

const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = ({ target: { value } }) => {
    setSearchQuery(value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    onSubmit(searchQuery);
    setSearchQuery('');
  };

  return (
    <SearchbarHeader>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormBtn type="submit" disabled={!searchQuery}>
          <FaSearch />
        </SearchFormBtn>
        <SearchFormInput
          className="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchForm>
    </SearchbarHeader>
  );
};

export default Searchbar;
