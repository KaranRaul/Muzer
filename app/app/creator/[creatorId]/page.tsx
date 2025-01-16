import StreamView from "@/components/StreamView";

interface PageProps {
    params: Promise<{
        creatorId: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { creatorId } = await params;

    return (
        <div>
            <StreamView creatorId={creatorId} playControl={false} />
        </div>
    );
}
