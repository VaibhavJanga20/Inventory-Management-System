
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2">The page you are looking for does not exist or has been moved.</p>
      <a href="/" className="mt-6 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
        Go Home
      </a>
    </div>
  );
}
