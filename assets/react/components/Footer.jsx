import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Safety information</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Cancellation options</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">COVID-19 response</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Community</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Diversity & Belonging</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Accessibility</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Airbnb Associates</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Guest Referrals</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Hosting</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Host your home</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Host an Experience</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Responsible hosting</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Resource Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Airbnb</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Newsroom</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Careers</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Investors</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Gift cards</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <span className="text-sm text-gray-600">© 2023 Airbnb, Inc.</span>
                            <span className="text-gray-600">·</span>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
                            <span className="text-gray-600">·</span>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
