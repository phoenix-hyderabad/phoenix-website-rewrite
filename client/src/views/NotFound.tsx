import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-black">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-7xl font-bold text-gray-800 dark:text-white">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold text-gray-600 dark:text-gray-100">
          Page Not Found
        </p>
        <p className="my-2 text-gray-500 dark:text-gray-200">
          The page you are looking for could not be found.
        </p>
        <Link to="/" className="underline">
          Home page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
