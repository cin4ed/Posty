'use client'

import { Post, User, Like } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div className="border overflow-hidden rounded-box bg-base-200 border-base-300">
      <Link href={`/posts/${post.id}`}>
        <div className="flex flex-col hover:bg-base-content/90 sm:flex-row sm:justify-between bg-base-content/80 text-base-100 py-2 px-4">
          <div className="text-sm">by {post.author.email}</div>
          <div className="text-sm">Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}</div>
        </div>
      </Link>
      <div className="p-4">
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
    </div>
  )
}
