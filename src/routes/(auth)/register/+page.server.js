import { invalid, redirect } from "@sveltejs/kit"
import bcrypt from "bcrypt"

import { db } from "$lib/database"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, "/")
    }
}

/** @type {import('./$types').Action} */
const register = async ({ request }) => {
    const data = await request.formData()
    const username = data.get("username")
    const password = data.get("password")

    
    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username ||
        !password
    ) {
        return invalid(400, { invalid: true })
    }
    
    const user = await db.user.findUnique({
        where: { username }
    })
    
    if (user) {
        return invalid(400, { user: true })
    }
        
    await db.user.create({
        data: {
            username,
            passwordHash: await bcrypt.hash(password, 10),
            userAuthToken: crypto.randomUUID()
        }
    })

    throw redirect(303, "/login")
}

/** @type {import('./$types').Actions} */
export const actions = { register }