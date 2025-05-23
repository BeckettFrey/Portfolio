const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center p-4">
      {/* Close Button / Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <span className="text-xl">🏠</span>
        </a>
      </div>

      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-8"></div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Animated 404 Visual */}
        <div className="mb-12">
          <div className="relative mx-auto w-80 h-80 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-200 rounded-full animate-bounce"></div>
              <div className="absolute top-8 right-8 w-6 h-6 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-12 left-12 w-4 h-4 bg-green-200 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-8 right-16 w-5 h-5 bg-yellow-200 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            </div>
            
            {/* Main 404 Display */}
            <div className="text-8xl font-bold text-gray-200 select-none">
              4🔍4
            </div>
            
            {/* Glitch Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-30 transform skew-x-12 animate-pulse"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a 
            href="/"
            className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">🏠</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Go Home</h3>
            <p className="text-gray-600 text-sm">Return to the main portfolio</p>
          </a>
          
          <a 
            href="/projects"
            className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">💼</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">View Projects</h3>
            <p className="text-gray-600 text-sm">Check out my latest work</p>
          </a>
          
          <button 
            onClick={() => window.history.back()}
            className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">⬅️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Go Back</h3>
            <p className="text-gray-600 text-sm">Return to previous page</p>
          </button>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">What happened?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Possible Reasons:</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• The page URL was typed incorrectly</li>
                <li>• The page has been moved or deleted</li>
                <li>• The link you followed is outdated</li>
                <li>• You don't have permission to access this page</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">What you can do:</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Check the URL for typos</li>
                <li>• Use the navigation menu above</li>
                <li>• Search for what you're looking for</li>
                <li>• Contact me if you think this is an error</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-red-600 mb-1">404</div>
            <div className="text-gray-600 text-sm">Error Code</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">∞</div>
            <div className="text-gray-600 text-sm">Pages Found</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-1">0</div>
            <div className="text-gray-600 text-sm">Broken Dreams</div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Lost in the digital wilderness? No worries! Every great explorer gets lost sometimes. 
            <br />
            Let's get you back on track to explore the <span className="font-semibold">Build Lab</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;