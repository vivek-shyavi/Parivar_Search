import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* <div>
            <h3 className="text-white font-semibold mb-4">Research</h3>
            <ul className="space-y-2">
              
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Activities</h3>
            <ul className="space-y-2">
              
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              
            </ul>
          </div> */}
          {/* <div>
            <h3 className="text-white font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
          

            </ul>
          </div> */}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>© {new Date().getFullYear()} ParivarSearch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;