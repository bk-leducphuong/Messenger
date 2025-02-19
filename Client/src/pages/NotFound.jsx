import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="">
            <h1 className="">404</h1>
            <p className="">Oops! Page not found</p>
            <p className="">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className=""
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;