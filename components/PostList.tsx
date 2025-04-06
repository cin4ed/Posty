import { Post, User } from '@prisma/client'

type PostWithAuthor = Post & {
  author: User
}

async function getPosts() {
  const res = await fetch('http://localhost:3000/api/posts')
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  return res.json()
}

export default async function PostList() {
  const posts = await getPosts()

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
