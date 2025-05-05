
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (term: string) => void;
};

export function SearchBar({ placeholder = "Search...", onSearch }: SearchBarProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative w-96">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        placeholder={placeholder}
        onChange={handleSearch}
      />
    </div>
  );
}
