// pages/index.js
import React from 'react';
import { Play, Music, Users, Heart, Mic2, ArrowRight } from 'lucide-react';


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-800 to-black text-white">
            {/* Navigation */}


            {/* Hero Section */}
            <main className="container mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Connect with Your Fans Through Music
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        The platform where independent artists thrive and fans discover their next favorite creator.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button className="px-8 py-3 bg-purple-600 rounded-full hover:bg-purple-500 flex items-center gap-2">
                            Start Creating <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-3 border border-purple-600 rounded-full hover:bg-purple-900/50">
                            Explore Music
                        </button>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Play />}
                        title="Direct Fan Connection"
                        description="Engage directly with your audience through live streams, exclusive content, and personal messages."
                    />
                    <FeatureCard
                        icon={<Heart />}
                        title="Fair Revenue Share"
                        description="Keep more of what you earn with our artist-friendly revenue model and transparent pricing."
                    />
                    <FeatureCard
                        icon={<Users />}
                        title="Community Building"
                        description="Build and grow your community with powerful tools designed for creator success."
                    />
                </div>
            </section>

            {/* Creator Section */}
            <section id="creators" className="bg-purple-900/30 py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6">Made for Creators</h2>
                            <p className="text-gray-300 mb-8">
                                Take control of your music career with powerful tools designed to help you grow your audience and monetize your passion.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Upload unlimited tracks",
                                    "Detailed analytics and insights",
                                    "Custom artist profile",
                                    "Direct fan messaging",
                                    "Exclusive content distribution"
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <Mic2 className="w-5 h-5 text-purple-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1">
                            <div className="bg-purple-800/50 p-8 rounded-lg">
                                {/* Placeholder for creator dashboard preview */}
                                <div className="aspect-video bg-purple-950 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Share Your Music?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of creators who are building their careers and connecting with fans on our platform.
                </p>
                <button className="px-8 py-3 bg-purple-600 rounded-full hover:bg-purple-500">
                    Get Started For Free
                </button>
            </section>

            {/* Footer */}
            <footer className="bg-purple-950">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Music className="w-6 h-6 text-purple-400" />
                                <span className="font-bold">MusicStream</span>
                            </div>
                            <p className="text-gray-400">
                                Empowering independent artists to share their music with the world.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Platform</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Features</li>
                                <li>Pricing</li>
                                <li>For Artists</li>
                                <li>For Fans</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Blog</li>
                                <li>Help Center</li>
                                <li>Community</li>
                                <li>Guidelines</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>About</li>
                                <li>Careers</li>
                                <li>Press</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-purple-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 MusicStream. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 bg-purple-900/30 rounded-lg">
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);