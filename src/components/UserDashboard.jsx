

import React, { useState, useEffect } from 'react';
import { Search, User, ChevronLeft, ChevronRight, Users, FileText, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../config/api.config';

const MemberDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  // Initialize states with localStorage values if they exist
  const [searchParams, setSearchParams] = useState(() => {
    const savedParams = localStorage.getItem('searchParams');
    return savedParams ? JSON.parse(savedParams) : {
      given_name: '',
      surname: '',
      father_name: ''
    };
  });

  const [searchResults, setSearchResults] = useState(() => {
    const savedResults = localStorage.getItem('searchResults');
    return savedResults ? JSON.parse(savedResults) : [];
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });

  const [showResults, setShowResults] = useState(() => {
    const savedResults = localStorage.getItem('searchResults');
    return !!savedResults;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save to localStorage whenever these values change
  useEffect(() => {
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
  }, [searchResults]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...searchParams,
          min_similarity: 0.5
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch results');
      }

      const data = await response.json();
      setSearchResults(data.matches);
      setShowResults(true);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
      localStorage.removeItem('searchResults');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      given_name: '',
      surname: '',
      father_name: ''
    });
    setSearchResults([]);
    setShowResults(false);
    setCurrentPage(1);
    setError(null);
    localStorage.removeItem('searchParams');
    localStorage.removeItem('searchResults');
    localStorage.removeItem('currentPage');
  };

  const resultsPerPage = 25;
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const getMatchColor = (quality) => {
    switch (quality) {
      case 'Excellent Match': return 'text-green-600';
      case 'Very Good Match': return 'text-blue-600';
      case 'Good Match': return 'text-yellow-600';
      case 'Fair Match': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getPageNumbers = (currentPage, totalPages) => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        rangeEnd = 4;
      }
      if (currentPage >= totalPages - 2) {
        rangeStart = totalPages - 3;
      }
      
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (totalPages !== 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleRowClick = (metadataId) => {
    navigate(`/family-tree/${metadataId}`, {
      state: { searchResults, searchParams, currentPage },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#E85D04] to-[#F48C06] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-16 h-16 text-white/90 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4 animate-fade-in tracking-tight font-serif">
            Welcome back!
          </h1>
          <p className="text-center text-xl opacity-90 max-w-2xl mx-auto font-light tracking-wide">
            Explore your family tree and discover your roots
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 relative z-20">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label htmlFor="given_name" className="block text-sm font-medium text-gray-700 tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  id="given_name"
                  value={searchParams.given_name}
                  onChange={(e) => setSearchParams({ ...searchParams, given_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-[#E85D04] transition-all duration-200 placeholder-gray-400 bg-gray-50 focus:bg-white font-light"
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 tracking-wide">
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  value={searchParams.surname}
                  onChange={(e) => setSearchParams({ ...searchParams, surname: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-[#E85D04] transition-all duration-200 placeholder-gray-400 bg-gray-50 focus:bg-white font-light"
                  placeholder="Enter surname"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 tracking-wide">
                  Father's Name
                </label>
                <input
                  type="text"
                  id="father_name"
                  value={searchParams.father_name}
                  onChange={(e) => setSearchParams({ ...searchParams, father_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-[#E85D04] transition-all duration-200 placeholder-gray-400 bg-gray-50 focus:bg-white font-light"
                  placeholder="Enter father's name"
                />
              </div>
            </div>
            <div className="flex justify-center pt-4 space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-lg text-white bg-[#E85D04] hover:bg-[#D04A03] focus:outline-none focus:ring-4 focus:ring-[#E85D04] focus:ring-opacity-50 transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-6 h-6 mr-2" />
                {isLoading ? 'Searching...' : 'Search Members'}
              </button>
              
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Clear Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Record Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Personal Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Parents Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Spouse Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedResults.map((result) => (
                    <tr 
                      key={result.metadata_id} 
                      className="hover:bg-orange-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => handleRowClick(result.metadata_id)}
                    >
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {/* <div className="text-sm font-medium text-gray-900">metadata_id: {result.metadata_id}</div> */}
                          <div className="text-sm font-medium text-gray-900">image: {result.image_number}</div>
                          <div className="text-sm text-gray-900">Record: {result.record_number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">Name: {result.given_name}</div>
                          <div className="text-sm text-gray-900">Surname: {result.surname}</div>
                          {/* <div className="text-sm text-gray-900">overall_similarity: {result.overall_similarity}</div> */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">Father: {result.father_name} {result.father_surname}</div>
                          <div className="text-sm text-gray-900">Mother: {result.mother_name} {result.mother_surname}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">Name: {result.spouse_name}</div>
                          <div className="text-sm text-gray-900">Father: {result.spouse_father_name} {result.spouse_father_surname}</div>
                          <div className="text-sm text-gray-900">Mother: {result.spouse_mother_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">City: {result.city}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-4 py-6 flex flex-col items-center justify-center gap-4 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-sm text-gray-700">
                  <span>
                    Showing <span className="font-medium">{((currentPage - 1) * resultsPerPage) + 1}</span>
                    {' '}-{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * resultsPerPage, searchResults.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{searchResults.length}</span> results
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85D04] bg-white text-[#E85D04] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-2 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-[#E85D04] text-white border border-[#E85D04]'
                              : 'bg-white border border-[#E85D04] text-[#E85D04] hover:bg-orange-50'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85D04] bg-white text-[#E85D04] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && searchResults.length === 0 && !error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            No matches found. Try adjusting your search terms or using fewer fields.
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;