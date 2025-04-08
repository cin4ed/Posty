'use client'

import { Post, User, Like } from '@prisma/client'
import { useEffect, useState } from 'react'
import PostListItem from './PostListItem'
import { SessionProvider } from 'next-auth/react'

type PostWithAuthorAndLikes = Post & {
  author: User
  likes: Like[]
  _count: {
    likes: number
  }
}

export default function PostList() {
  const [posts, setPosts] = useState<PostWithAuthorAndLikes[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleUnlike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error unliking post:', error)
    }
  }

  useEffect(() => {
    fetchPosts()

    const handlePostCreated = () => {
      fetchPosts()
    }

    window.addEventListener('postCreated', handlePostCreated)
    return () => {
      window.removeEventListener('postCreated', handlePostCreated)
    }
  }, [])

  if (isLoading) {
    return <div className="text-center">Loading posts...</div>
  }

  return (
    <SessionProvider>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} onLike={handleLike} onUnlike={handleUnlike} />
        ))}
      </div>
    </SessionProvider>
  )
}
