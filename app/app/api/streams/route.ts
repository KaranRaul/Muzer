import { prismaCLient } from "@/app/lib/db";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// @ts-expect-error thil lib does not have types
import youtubesearchapi from 'youtube-search-api';
import { z } from "zod";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(),
})


export async function POST(req: NextRequest) {
    const data = createStreamSchema.safeParse(await req.json());
    if (!data.success) {
        return NextResponse.json({
            message: "error while adding a stream",
        }, {
            status: 400,
        })
    }

    const { creatorId, url } = data.data;
    const urlMatch = url.match(YT_REGEX);
    if (!urlMatch) {
        return NextResponse.json({
            message: "invalid youtube url",
        }, {
            status: 400,
        })
    }
    const extractedId = url.split('v=')[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    // console.log("test")
    // const thumbnails = res.thumbnail.thumbnails;
    // thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1)
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
        a.width < b.width ? -1 : 1,
    );
    // console.log(thumbnails)


    const stream = await prismaCLient.streams.create({
        data: {

            type: url.match(/youtube/) ? 'Youtube' : 'Spotify',
            userId: creatorId,
            url: url,
            extractedId,
            title: res.title ?? "Can't find title",
            smallImg: thumbnails.length > 1 ? thumbnails[1].url : thumbnails[0].url ?? "data:image/png;base64,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",
            bigImg: thumbnails[0].url ?? "data:image/png;base64,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"
        }
    });

    return NextResponse.json({
        message: "Added Stream",
        id: stream.id
    })
};

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get('creatorId') || "";
    const session = await getServerSession(authOptions);
    const user = await prismaCLient.user.findFirst({
        where: {
            id: creatorId
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "not a valid user"
        }, { status: 401 })
    }
    console.log(session?.user.id)
    console.log(creatorId)
    const streams = await prismaCLient.streams.findMany({
        where: {
            userId: creatorId
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: session?.user.id
                }
            }
        }
    })


    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        }))
    })
}


export async function DELETE(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get('creatorId') || "";
    const user = await prismaCLient.user.findFirst({
        where: {
            id: creatorId
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "not a valid user"
        }, { status: 401 })
    }
    const data = await req.json()

    try {
        console.log(data)
        await prismaCLient.streams.delete({
            where: {
                id: data.streamId
            }
        });

        return NextResponse.json({
            message: "stream deleted succefully"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "error while deleting stream",
            error
        }, {
            status: 401
        })
    }
}


