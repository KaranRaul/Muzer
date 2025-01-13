"use client";
import { Music } from "lucide-react";
import { signIn, useSession, signOut } from "next-auth/react";

export function Appbar() {
    const { data: session } = useSession(); // Destructure session for clarity

    return (
        <div className="bg-gray-900 text-white shadow-md">
            <div className="flex justify-between items-center px-6 py-4">
                <nav className="flex justify-between items-center w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Music className="w-8 h-8 text-purple-400" />
                        <span className="text-xl font-bold">MUZER</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex gap-8">
                        <a
                            href="#features"
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#creators"
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                            For Creators
                        </a>
                        <a
                            href="#pricing"
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                            Pricing
                        </a>
                    </div>

                    {/* Authentication Buttons */}
                    <div className="flex gap-4">
                        {!session?.user ? (
                            <button
                                onClick={() => signIn()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
                            >
                                Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    signOut({ callbackUrl: "/" }) // Use callbackUrl for redirection
                                }
                                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
                            >
                                Sign Out
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}
