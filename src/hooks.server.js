import { db } from "$lib/database"

/** @type {import('./$types').Handle} */
export const handle = async ({ event, resolve }) => {
    const session = event.cookies.get("session")
    let user = false
    
    if (session) {
        user = await db.user.findUnique({
            where: { userAuthToken: session },
            select: {
                id: true,
                username: true,
                createdAt: true,
                role: true,
                admin: true,
                characters: {
                    select: {
                        id: true,
                        name: true,
                        dob: true,
                        ethnicity: true,
                        age: true,
                        vehicles: true,
                        licenses: true
                    }
                },
                callsign: true
            }
        })
    }

    if (user) {
        event.locals.user = user
    }

    return await resolve(event)
    
}