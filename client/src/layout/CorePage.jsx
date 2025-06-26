'use client';

import PropTypes from 'prop-types';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CorePage({
  header,
  children,
  showHomeButton = true,
  containerFixed = false,
  headingSize = '6xl',
}) {
  const router = useRouter();

  const handleHome = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/');
  };

  const containerClasses = [
    containerFixed ? 'absolute inset-0 overflow-hidden' : 'relative',
    'min-h-screen min-w-screen text-white font-sans overflow-x-hidden leading-tight',
  ].join(' ');

  return (
<div className={containerClasses}>
  {/* Background Grid – applies to entire page */}
  <div className="absolute inset-0 -z-20 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb1a_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb1a_1px,transparent_1px)] bg-[size:14px_24px]" />
  </div>
  
{header && (
  <div className="relative z-10 text-center mt-4">
    {/* Ultra-light headlight */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[50vw] max-w-[800px] bg-[radial-gradient(closest-side,#ffffff4d_0%,transparent_90%)] rounded-full blur-3xl opacity-40 -z-10 pointer-events-none" />

    <h1
      className={`text-${headingSize} font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-[1.2] pb-2`}
    >
      {header}
    </h1>
    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
  </div>
)}


      {/* Home Button */}
      {showHomeButton && (
        <div className="absolute top-2 left-2 z-50">
          <button
            onClick={handleHome}
            onTouchStart={handleHome}
            className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg home-button hover:scale-110"
          >
            <FaHome className="text-lg" />
          </button>
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
  showHomeButton: PropTypes.bool,
  containerFixed: PropTypes.bool,
  headingSize: PropTypes.string,
};
