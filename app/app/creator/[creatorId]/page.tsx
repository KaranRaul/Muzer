
import StreamView from "@/components/StreamView"


export default function page({ params: { creatorId } }: { params: { creatorId: string } }) {
    return <div>
        <StreamView creatorId={creatorId} />
    </div>
}
