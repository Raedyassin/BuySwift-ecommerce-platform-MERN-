export default function ErrorBoundaryMessage({ handleRetry }) {
  return (
    <div
      className="min-h-screen  bg-gradient-to-br from-gray-50 to-indigo-100
      flex items-start pt-[4rem] justify-center p-4  "
    >
      <div className="max-w-2xl w-full  rounded-xl   px-6 md:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* logo */}
          <div
            className="flex  justify-center items-center text-4xl 
          lg:text-6xl font-bold text-gray-900"
          >
            <div className="md:pb-10 text-4xl lg:text-6xl pb-5 ">
              <svg
                stroke="currentColor"
                fill="#432DD7"
                strokeWidth="0"
                viewBox="0 0 256 256"
                className="text-3xl sm:text-4xl md:text-5xl font-bold group-hover:text-indigo-700"
                height="3em"
                width="3em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M248,160a48.05,48.05,0,0,1-48,48H152c-17.65,0-32-14.75-32-32.89s14.35-32.89,32-32.89a31,31,0,0,1,3.34.18A48,48,0,0,1,248,160ZM112,72a87.57,87.57,0,0,1,61.35,24.91A8,8,0,0,0,184.5,85.44,104,104,0,0,0,8,160v16a8,8,0,0,0,16,0V160A88.1,88.1,0,0,1,112,72Zm0,32a55.58,55.58,0,0,1,33.13,10.84A8,8,0,1,0,154.6,102,72,72,0,0,0,40,160v16a8,8,0,0,0,16,0V160A56.06,56.06,0,0,1,112,104Zm15.21,26.71a8,8,0,0,0-5.94-9.63A40,40,0,0,0,72,160v16a8,8,0,0,0,16,0V160a24,24,0,0,1,29.57-23.35A8,8,0,0,0,127.21,130.71Z"></path>
              </svg>
            </div>
            <div className="text-indigo-700 italic>">Dream Store</div>
          </div>

          {/* Error Message */}
          <div className="flex  juctify-center items-center  ">
            <div className="text-red-500">
              <svg
                className="w-15 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
              Oops! Something Went Wrong
            </h1>
          </div>

          <p className="text-gray-600 text-center text-base md:text-lg">
            We are having trouble loading this page. Please try again or contact
            support if the problem persists.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-6">
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
              hover:to-purple-700 transition-all duration-300 cursor-pointer   
              text-white px-6 py-3 rounded-lg font-medium  "
            >
              Try Again
            </button>
            {/* i use <a></a> instead of <Link></Link> don't use Link because Forces a full page reload (clears memory, resets state)
              Acts as a "nuclear option" to recover from critical errors
              Works even if React Router is in a broken state
              */}
            <a
              href="/"
              className=" cursor-pointer  text-white
              bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700  duration-300
              px-6 py-3 rounded-lg font-medium text-center 
                    transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
