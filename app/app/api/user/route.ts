import { prismaCLient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    if (!session?.user?.email)
        return NextResponse.json({ message: "erro while getting user data" }, { status: 401 })
    const user = await prismaCLient.user.findFirst({
        where: {
            id: session?.user.id
        }
    });

    if (!user)
        return NextResponse.json({
            message: "not a valid user"
        }, { status: 402 });

    return NextResponse.json({ user });
}