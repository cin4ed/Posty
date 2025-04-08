import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import LikeButton from '@/components/LikeButton'
import Header from '@/components/Header'

type Props = {
  params: {
    postId: string
  }
}

export default async function PostPage({ params }: Props) {
  const session = await auth()
  const { postId } = params

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  const isLiked = session?.user ? post.likes.some((like) => like.authorId === session.user?.id) : false

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="border overflow-hidden rounded-box bg-base-200 border-base-300">
            <div className="flex flex-col sm:flex-row sm:justify-between bg-base-content/80 text-base-100 py-2 px-4">
              <div className="text-sm">by {post.author.email}</div>
              <div className="text-sm">Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}</div>
            </div>
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
              {post.content && <p className="text-lg mb-4">{post.content}</p>}
              <div className="flex items-center justify-end">
                <LikeButton
                  postId={post.id}
                  isLiked={isLiked}
                  likeCount={post._count.likes}
                  isAuthenticated={!!session?.user}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
