"use client"
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2, ArrowUp, ArrowBigDown, ArrowDown01, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Appbar } from './Appbar';

interface Video {
    "id": string,
    "type": string,
    "url": string,
    "extractedId": string,
    "title": string,
    "smallImg": string,
    "bigImg": string,
    "active": boolean,
    "userId": string,
    "upvotes": number,
    "haveUpvoted": boolean
}

const INTERVAL_TIME_ME = 1000 * 15;

export default function StreamView({ creatorId }: { creatorId: string }) {
    const [currentVideo, setCurrentVideo] = useState<string | null>('');
    const [preview, setPreview] = useState<string | null>(null);
    const [newVideo, setNewVideo] = useState<string | null>()
    const [showShareToast, setShowShareToast] = useState(false);
    const [queue, setQueue] = useState<Video[]>([]);
    async function refreshStreams() {
        try {
            const response = await axios.get(`/api/streams?creatorId=${creatorId}`, {
                withCredentials: true
            });
            setQueue(response.data.streams.sort((a: Video, b: Video) => { a.upvotes > b.upvotes ? -1 : 1 }))

        } catch (error) {
            console.log(error)
        }


        // console.log('data')
        // console.log(response.data);
        // return response.data;
    }

    async function playNext() {
        if (queue.length > 0) {
            setCurrentVideo(queue[0].url);
            await axios.delete(`/api/streams?creatorId=${creatorId}`, {
                data: { streamId: queue[0].id }
            });
            setQueue(queue.slice(1))
        }

    }


    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        }, INTERVAL_TIME_ME)
    }, [])

    const handleShare = async () => {
        try {
            const url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/creator/' + creatorId;
            // console.log(url)
            await navigator.clipboard.writeText(url);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    async function changeUpvote(streamId: string, haveUpvoted: boolean) {
        await axios.post(`/api/streams/${haveUpvoted ? 'downvote' : 'upvote'}`, {
            streamId
        });
        refreshStreams();
    }

    const getVideoId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleSubmit = async () => {
        if (newVideo) {
            const respone = await axios.post('/api/streams', {
                creatorId,
                url: newVideo
            })
            refreshStreams();
            // setCurrentVideo('');
            setNewVideo(null);
        }
    };

    return (

        <div className="flex justify-center mx-auto p-6 bg-gray-900 min-h-screen text-white">
            <div className="max-w-7xl w-full">
                <Appbar />
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Stream Queue</h1>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
                    >
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>
                </div>

                {showShareToast && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                        Link copied to clipboard!
                    </div>
                )}

                <div className="grid grid-cols-3 gap-8">
                    {/* Currently Playing */}
                    <div className="col-span-1 bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Currently Playing</h2>
                        <div className="aspect-video mb-4">
                            {currentVideo ? (
                                <iframe
                                    className="w-full h-full rounded"
                                    src={`https://www.youtube.com/embed/${getVideoId(
                                        currentVideo
                                    )}`}
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded">
                                    <span className="text-gray-400">No video playing</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={playNext}
                            className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                        >
                            Play Next
                        </button>
                    </div>

                    {/* Add to Queue */}
                    <div className="col-span-2 space-y-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Add to Queue</h2>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={newVideo || ""}
                                    onChange={(e) => setNewVideo(e.target.value)}
                                    placeholder="Paste YouTube URL"
                                    className="flex-1 px-4 py-2 rounded bg-gray-700 text-white"
                                />
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
                                >
                                    Add
                                </button>
                            </div>
                            {newVideo && (
                                <div className="mt-4 aspect-video max-w-md mx-auto bg-gray-700 rounded flex items-center justify-center">
                                    <iframe
                                        className="w-full h-full rounded"
                                        src={`https://www.youtube.com/embed/${getVideoId(
                                            newVideo
                                        )}`}
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>

                        {/* Up Next */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Up Next</h2>
                            <div className="space-y-4">
                                {queue.map((video) => (
                                    <div
                                        key={video.id}
                                        className="flex items-center gap-4 bg-gray-700 p-4 rounded"
                                    >
                                        <img
                                            src={video.smallImg}
                                            alt={video.title}
                                            className="w-32 rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-300">{video.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="bg-gray-500 h-7 w-10 rounded flex items-center justify-center hover:bg-gray-700 cursor-pointer"
                                                onClick={() =>
                                                    changeUpvote(video.id, video.haveUpvoted)
                                                }
                                            >
                                                {video.haveUpvoted ? <ChevronDown /> : <ChevronUp />}
                                            </div>
                                            <span>{video.upvotes}</span>
                                        </div>
                                    </div>
                                ))}
                                {queue.length === 0 && (
                                    <p className="text-gray-400 text-center">No videos in the queue.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}