import React from "react";

export default function StreamViewSkeleton() {
    return (
        <div className="flex justify-center mx-auto p-4 bg-gray-900 min-h-screen text-white animate-pulse">
            <div className="max-w-7xl w-full">
                {/* <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-1/3 bg-gray-700 rounded"></div>
                    <div className="h-10 w-24 bg-purple-600 rounded"></div>
                </div> */}

                <div className="flex gap-8">
                    {/* Currently Playing Skeleton */}
                    <div className="w-1/3 bg-gray-800 p-4 rounded-lg">
                        <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
                        <div className="aspect-video bg-gray-700 rounded mb-4"></div>
                        <div className="h-10 w-full bg-green-600 rounded"></div>
                    </div>

                    {/* Add to Queue and Up Next Skeleton */}
                    <div className="w-2/3 space-y-8">
                        {/* Add to Queue Skeleton */}
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="h-6 w-1/3 bg-gray-700 rounded mb-4"></div>
                            <div className="flex gap-4">
                                <div className="h-10 w-2/3 bg-gray-700 rounded"></div>
                                <div className="h-10 w-24 bg-purple-600 rounded"></div>
                            </div>
                            <div className="mt-4 aspect-video max-w-sm bg-gray-700 rounded"></div>
                        </div>

                        {/* Up Next Skeleton */}
                        <div>
                            <div className="h-6 w-1/4 bg-gray-700 rounded mb-4"></div>
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 bg-gray-800 p-4 rounded"
                                    >
                                        <div className="w-32 h-20 bg-gray-700 rounded"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                                            <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="h-7 w-10 bg-gray-700 rounded"></div>
                                            <div className="h-4 w-6 bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
