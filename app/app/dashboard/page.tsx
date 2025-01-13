"use client";

import StreamView from "@/components/StreamView";
import axios from "axios";
import { useEffect, useState } from "react";
import StreamViewSkeleton from "../skeleton/StreamViewSkeleton";

export default function Page() {
    const [creatorId, setCreatorId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("/api/user");
                setCreatorId(response.data.user.id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    if (loading) {
        return <div><StreamViewSkeleton /></div>;
    }

    return (
        <div>
            <StreamView creatorId={creatorId!} />
        </div>
    );
}
