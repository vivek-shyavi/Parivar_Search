import React from 'react';
import { Camera, FileText, Mic, Heart, Plus, Search } from 'lucide-react';

const Memories = () => {
  const memories = [
    {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80',
      title: 'Family Reunion 1960',
      date: '1960',
      location: 'Mumbai, India'
    },
    {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1574255155611-e864ecb66c0f?auto=format&fit=crop&q=80',
      title: 'Wedding Day',
      date: '1955',
      location: 'Delhi, India'
    },
    {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80',
      title: 'Traditional Celebration',
      date: '1965',
      location: 'Jaipur, India'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Family Memories</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Preserve and share your family's precious moments, stories, and traditions.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Memory
            </button>
            <button className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 transform hover:scale-105 transition-all duration-300 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Find Memories
            </button>
          </div>
        </div>
      </div>

      {/* Memory Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Camera className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Photos</h3>
            <p className="text-gray-600 mb-4">Upload and preserve your family photos and images.</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Upload Photos →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <FileText className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stories</h3>
            <p className="text-gray-600 mb-4">Write and share your family's stories and experiences.</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Write Story →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Mic className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Audio</h3>
            <p className="text-gray-600 mb-4">Record and preserve oral histories and interviews.</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Record Audio →
            </button>
          </div>
        </div>

        {/* Recent Memories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Recent Family Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memories.map((memory, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48">
                  <img
                    src={memory.url}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{memory.title}</h3>
                  <div className="text-sm text-gray-600">
                    <p>{memory.date}</p>
                    <p>{memory.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Start Preserving Your Family Memories</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Don't let your family's stories fade away. Begin capturing and sharing your precious memories today.
          </p>
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Memories;