import { Link } from 'react-router-dom';

export default function RouteErrorBoundary() {
  //   const error = useRouteError();

  return (
    <div className="error-container">
      <h1>Something went wrong! Please try again later.</h1>
      <Link to="/">Return to home</Link>
    </div>
  );
}
