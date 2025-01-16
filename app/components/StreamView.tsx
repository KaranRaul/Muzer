"use client"
import React, { useState, useEffect } from 'react';
import { Share2, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Appbar } from './Appbar';
import StreamViewSkeleton from '@/app/skeleton/StreamViewSkeleton';
import Image from 'next/image';


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

const INTERVAL_TIME_ME = 1000 * 10;

export default function StreamView({ creatorId, playControl }: { creatorId: string, playControl: boolean }) {
    const [currentVideo, setCurrentVideo] = useState<string | null>('');
    const [loading, setLoading] = useState(true);
    const [newVideo, setNewVideo] = useState<string | null>()
    const [showShareToast, setShowShareToast] = useState(false);
    const [queue, setQueue] = useState<Video[]>([]);
    const [addSongLoading, setAddSongLoading] = useState(false);
    async function refreshStreams() {
        try {
            const response = await axios.get(`/api/streams?creatorId=${creatorId}`, {
                withCredentials: true
            });
            setLoading(false);
            // console.log(response.data.streams)
            setQueue(response.data.streams.sort((a: Video, b: Video) => a.upvotes > b.upvotes ? -1 : 1))
            // console.log(response.data.streams.sort((a: Video, b: Video) => a.upvotes > b.upvotes ? -1 : 1))

        } catch (error) {
            console.log(error)
        }
    }

    async function playNext() {
        if (queue.length > 0) {

            console.log('reached')
            const response = await axios.get(`/api/streams/nextStream?creatorId=${creatorId}`);

            setCurrentVideo(null)
            setCurrentVideo(response.data.url);
            console.log(response)
            refreshStreams();
        }

    }
    useEffect(() => {
        let player: YT.Player;
        const onPlayerReady = (event: YT.PlayerEvent) => {
            event.target.playVideo();
        };


        const onPlayerStateChange = async (event: YT.OnStateChangeEvent) => {
            console.log(event)
            if (event.data === YT.PlayerState.ENDED) {
                if (playControl) await playNext(); // Call your playNext function when the video ends
            }
        };

        const loadYouTubePlayer = () => {
            if (!currentVideo || !window.YT) return;

            player = new YT.Player("youtube-player", {
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
            console.log(player)
        };

        // Load YouTube Player API script
        if (!window.YT) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            script.onload = loadYouTubePlayer;
            document.body.appendChild(script);
        } else {
            loadYouTubePlayer();
        }

        return () => {
            // Clean up the player instance if the component unmounts or `currentVideo` changes
            if (player && typeof player.destroy === "function") {
                player.destroy();
            }
        };
    }, [currentVideo]);


    useEffect(() => {
        refreshStreams();
        setInterval(() => {
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
        setAddSongLoading(true);
        if (newVideo) {
            await axios.post('/api/streams', {
                creatorId,
                url: newVideo
            })
            refreshStreams();
            // setCurrentVideo('');
            setNewVideo(null);
        }
        setAddSongLoading(false)
    };
    if (loading)
        return
    <div>
        <Appbar />
        <StreamViewSkeleton />
    </div>
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
                                    id="youtube-player"
                                    className="w-full h-full rounded"
                                    src={`https://www.youtube.com/embed/${getVideoId(currentVideo)}?autoplay=1&enablejsapi=1`}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />

                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded">
                                    <span className="text-gray-400">No video playing</span>
                                </div>
                            )}
                        </div>
                        {playControl && <button
                            onClick={playNext}
                            className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                        >
                            Play Next
                        </button>}
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
                                    disabled={addSongLoading}
                                    className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
                                >
                                    {addSongLoading ? 'Adding ' : 'Add'}
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
                                        <Image src={video.bigImg} alt={video.title}
                                            className="w-32 rounded" width={100} height={100} />


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