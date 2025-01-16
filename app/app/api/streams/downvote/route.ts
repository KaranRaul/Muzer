import { prismaCLient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createUpvoteSchema = z.object({
    streamId: z.string(),
})

export async function POST(res: NextRequest) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        // todo replce this with id everwhere

        return NextResponse.json({
            message: "you must be logged in to downvote",
        }, {
            status: 403
        })
    }
    const body = createUpvoteSchema.safeParse(await res.json());
    if (!body.success) {
        return NextResponse.json({
            message: "error while adding an downvote",
        }, {
            status: 400
        })
    }

    const { streamId } = body.data;
    const user = await prismaCLient.user.findFirst({
        where: {
            email: session.user.email
        }
    });
    if (!user) {
        return NextResponse.json({
            message: "user not found",
        }, {
            status: 404
        })
    }
    try {
        await prismaCLient.upvote.delete({
            where: {
                userId_streamId: {
                    streamId,
                    userId: user.id
                }
            }
        });
        return NextResponse.json({
            message: "stream downvoted"
        });
    } catch (_error) {
        return NextResponse.json({
            message: "error while upvoting",
            _error
        }, {
            status: 400

        })
    }


}