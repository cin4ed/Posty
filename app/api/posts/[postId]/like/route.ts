import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const session = await auth()
  const { postId } = await params

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!session.user.id) {
    return new Response('User ID not found', { status: 400 })
  }

  try {
    const like = await prisma.like.create({
      data: {
        postId,
        authorId: session.user.id,
      },
    })

    return Response.json(like)
  } catch (error) {
    console.error('Error liking post:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const session = await auth()
  const { postId } = await params

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!session.user.id) {
    return new Response('User ID not found', { status: 400 })
  }

  try {
    await prisma.like.deleteMany({
      where: {
        postId,
        authorId: session.user.id,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error unliking post:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
