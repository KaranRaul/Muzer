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
            message: "you must be logged in to upvote",
        }, {
            status: 403
        })
    }
    const body = createUpvoteSchema.safeParse(await res.json());
    if (!body.success) {
        return NextResponse.json({
            message: "error while adding an upvote",
        }, {
            status: 400
        })
    }
    console.log(body.data);

    const { streamId } = body.data;
    const user = await prismaCLient.user.findFirst({
        where: {
            email: session.user.email
        }
    });
    console.log(JSON.stringify(user));
    if (!user) {
        return NextResponse.json({
            message: "user not found",
        }, {
            status: 404
        })
    }
    console.log(user.id);

    try {
        const stream = await prismaCLient.streams.findUnique({
            where: { id: streamId },
        });

        if (!stream) {
            return NextResponse.json(
                { message: "Stream not found" },
                { status: 404 }
            );
        }
        const response = await prismaCLient.upvote.create({
            data: {
                streamId: body.data.streamId,
                userId: user.id,

            }
        });
        console.log(response)

        return NextResponse.json({
            message: "stream upvoted"
        });

    } catch (error) {
        return NextResponse.json({
            message: "error while upvoting",
            error
        }, {
            status: 400

        })
    }


}