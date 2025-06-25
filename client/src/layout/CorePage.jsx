'use client';

import PropTypes from 'prop-types';
import { FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function CorePage({ header, children, showHomeButton = true, containerFixed = false }) {
  const containerClasses = [
    containerFixed ? 'fixed' : 'relative',
    'min-h-screen min-w-screen text-white font-sans overflow-x-hidden leading-tight',
  ].join(' ');

  return (
    <div className={containerClasses}>
        
      {/* Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Texture Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        {/* Radial Glow */}
        <div className="absolute inset-x-0 top-[-10%] size-[1000px] mx-auto rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]" />
      </div>

      {/* Styles */}
      <style jsx>{`
        .page-container {
          transition: opacity 0.2s ease-in-out;
        }
        .section {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .home-button {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        @media (max-width: 767px) {
          .container {
            padding: 40px;
          }
        }
      `}</style>

      {/* Home Button */}
      {showHomeButton && (
        <div className="absolute top-2 left-2 z-50">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg home-button hover:scale-110"
          >
            <FaHome className="text-lg" />
          </Link>
        </div>
      )}

      {/* Header */}
      {header && (
        <div className="text-center mt-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-[1.2] pb-2">
            {header}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl z-10 relative page-container">
        {children}
      </div>
    </div>
  );
}

CorePage.propTypes = {
  header: PropTypes.string,
  children: PropTypes.node.isRequired,
};
