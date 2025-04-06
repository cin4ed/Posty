'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'

type CreatePostInput = {
  title: string
  content?: string
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  try {
    const body = (await req.json()) as CreatePostInput
    const { title, content } = body

    if (!title) {
      return new Response('Title is required', { status: 400 })
    }

    if (!session.user.id) {
      return new Response('User ID not found', { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
    })

    return Response.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  })
  return Response.json(posts)
}
