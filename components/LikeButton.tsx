'use client'

import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LikeButtonProps = {
  postId: string
  isLiked: boolean
  likeCount: number
  isAuthenticated: boolean
}

export default function LikeButton({
  postId,
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
  isAuthenticated,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const router = useRouter()

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  return (
    <button onClick={handleLike} className="btn btn-sm btn-ghost">
      <span className="text-sm mr-1">{likeCount}</span>
      {isLiked ? <HeartIcon className="size-4" /> : <HeartIconOutline className="size-4" />}
    </button>
  )
}
