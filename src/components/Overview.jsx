import React from 'react';
import { Users, Search, Heart, TreePine } from 'lucide-react';

const Overview = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TreePine className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Your Family Tree</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover and connect with your ancestors through an interactive family tree experience.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Search className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Find People</h3>
            <p className="text-gray-600 mb-4">Search records to discover your ancestors and add them to your tree.</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Start Searching →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Add Family Members</h3>
            <p className="text-gray-600 mb-4">Manually add known family members to begin building your tree.</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Add Family →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Heart className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share Memories</h3>
            <p className="text-gray-600 mb-4">Add photos and stories to preserve your family's legacy.</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Add Memories →
            </button>
          </div>
        </div>

        {/* Tree Placeholder */}
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <TreePine className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Start Your Family Tree</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your family tree is waiting to be discovered. Begin by adding yourself and your immediate family members.
          </p>
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-300">
            Begin Your Tree
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overview;