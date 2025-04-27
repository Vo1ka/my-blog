import { useState } from 'react';
import './SearchBar.scss'
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по названию..."
      />
      <button type="submit">
        <CiSearch />
      </button>
    </form>
  );
};

export default SearchBar;