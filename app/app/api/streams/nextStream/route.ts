import { prismaCLient } from "@/app/lib/db";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
        return NextResponse.json({ message: "sign in first" }, { status: 401 });
    }

    const creatorId = req.nextUrl.searchParams.get('creatorId');
    if (!creatorId) {
        return NextResponse.json({ message: "invalid creator id" }, { status: 401 });
    }

    const stream = await prismaCLient.streams.findFirst({
        where: {
            userId: creatorId
        },
        orderBy: {
            upvotes: {
                _count: "desc"
            }
        }
    });

    if (!stream) {
        return NextResponse.json({ message: "add songs to the queue" }, { status: 401 });
    }
    await prismaCLient.streams.delete({
        where: {
            id: stream.id
        }
    });



    return NextResponse.json({ url: stream?.url });

}