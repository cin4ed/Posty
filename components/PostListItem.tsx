'use client'

import { Post, User, Like } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

type PostWithAuthorAndLikes = Post & {
  author: User
  likes: Like[]
  _count: {
    likes: number
  }
}

type PostListItemProps = {
  post: PostWithAuthorAndLikes
  onLike: (postId: string) => void
  onUnlike: (postId: string) => void
}

export default function PostListItem({ post, onLike, onUnlike }: PostListItemProps) {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  const handleLike = () => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    setIsLiked((isLiked) => !isLiked)

    if (isLiked) {
      onUnlike(post.id)
    } else {
      onLike(post.id)
    }
  }

  useEffect(() => {
    setIsLiked(session?.user ? post.likes.some((like) => like.authorId === session.user?.id) : false)
  }, [session, post.likes])

  return (
    <div className="p-4 border rounded-box bg-base-200 border-base-300">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="mt-2 text-sm text-base-content/60">by {post.author.email}</div>
        <div className="mt-2 text-sm text-base-content/60">
          Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
      {post.content && <p className="mt-2">{post.content}</p>}
      <div className="flex items-center justify-end mt-2">
        {/* {session?.user && ( */}
        <button onClick={handleLike} className={`btn btn-sm btn-ghost`}>
          <span className="text-sm">{post._count?.likes || 0}</span>
          {isLiked ? <HeartIcon className="size-4" /> : <HeartIconOutline className="size-4" />}
        </button>
        {/* )} */}
      </div>
    </div>
  )
}
