'use server'

import prisma from '@/lib/prisma'

// READ actions
export async function GET() {
  try {
    const users = await prisma.user.findMany()

    return Response.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}
