'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

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
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
