import { auth } from '@/auth'
import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto p-4">
        {session?.user ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <PostForm />
            <PostList />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold text-center text-primary mb-4">Welcome to Posty</h1>
            <p className="text-lg text-center text-base-content/80 bg-base-200 p-4 rounded-lg shadow-sm border border-base-300">
              Please sign in to start creating posts.
            </p>
            <PostList />
          </div>
        )}
      </main>
    </div>
  )
}
