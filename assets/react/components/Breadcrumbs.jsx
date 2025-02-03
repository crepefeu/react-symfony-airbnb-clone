import React from 'react';

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="bg-gray-50 border-b mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-12">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li>
                            <a href="/" className="hover:text-gray-700">Home</a>
                        </li>
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <li>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </li>
                                <li>
                                    {item.href ? (
                                        <a href={item.href} className="hover:text-gray-700">
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span className="text-gray-900">{item.label}</span>
                                    )}
                                </li>
                            </React.Fragment>
                        ))}
                    </ol>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumbs;
