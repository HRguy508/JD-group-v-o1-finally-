import React, { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { searchHistory, addToSearchHistory } = useUser();

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      // Add to search history
      await addToSearchHistory(searchQuery);
      
      // Perform search (replace with actual search logic)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(10);

      if (!error && data) {
        setResults(data);
      }
    } else {
      setResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-cta"
            />
          </div>
        </div>

        {query ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Search Results</h3>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No results found</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Recent Searches</h3>
            {searchHistory.length > 0 ? (
              <div className="space-y-2">
                {searchHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearch(item.query)}
                    className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent searches</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}