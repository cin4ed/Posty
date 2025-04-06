'use client'

import { Post, User } from '@prisma/client'
import { useEffect, useState } from 'react'

type PostWithAuthor = Post & {
  author: User
}

export default function PostList() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
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

  useEffect(() => {
    fetchPosts()

    // Listen for post creation events
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
    <div className="space-y-4">
      {posts.map((post: PostWithAuthor) => (
        <div key={post.id} className="p-4 border rounded-box bg-base-200 border-base-300">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          {post.content && <p className="mt-2">{post.content}</p>}
          <div className="flex justify-between">
            <div className="mt-2 text-sm text-base-content/60">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 text-sm text-base-content/60">by {post.author.email}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
