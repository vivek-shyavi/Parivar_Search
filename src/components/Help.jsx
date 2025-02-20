import React from 'react';
import { HelpCircle, Book, Phone, MessageCircle, Video, Users, Search } from 'lucide-react';

const Help = () => {
  const helpCategories = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Getting Started",
      topics: [
        "Creating an Account",
        "Building Your Family Tree",
        "Searching Records",
        "Adding Family Members"
      ]
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: "Research Help",
      topics: [
        "Finding Historical Records",
        "Reading Old Documents",
        "Understanding Family History",
        "Research Strategies"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Family Tree",
      topics: [
        "Adding People",
        "Editing Information",
        "Merging Duplicates",
        "Sharing Your Tree"
      ]
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Tutorials",
      topics: [
        "Beginner's Guide",
        "Advanced Search Tips",
        "Working with Records",
        "Using Family Tree Tools"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <Search className="absolute right-4 top-3 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Phone className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">
              Get help from our support team available 24/7.
            </p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Contact Us →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <MessageCircle className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Forum</h3>
            <p className="text-gray-600 mb-4">
              Connect with other users and share experiences.
            </p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Join Discussion →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Video className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
            <p className="text-gray-600 mb-4">
              Learn through our step-by-step video guides.
            </p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Watch Now →
            </button>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {helpCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-orange-600 mr-3">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <ul className="space-y-3">
                {category.topics.map((topic, topicIndex) => (
                  <li key={topicIndex}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-orange-600 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-2">•</span>
                      {topic}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is available 24/7 to assist you with any questions or concerns you may have.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Support
            </button>
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;