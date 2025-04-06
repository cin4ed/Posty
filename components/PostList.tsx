import { Post, User } from '@prisma/client'
import prisma from '@/lib/prisma'

type PostWithAuthor = Post & {
  author: User
}

export default async function PostList() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  })

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
