'use client'

import { useState } from 'react'

export default function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      // Reset form
      setTitle('')
      setContent('')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 p-4 rounded-box border border-base-300">
        <legend className="fieldset-legend">Create a new post</legend>
        <label className="fieldset-label">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter post title"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="fieldset-label">Content</label>
        <textarea
          id="content"
          placeholder="Enter post content"
          className="textarea textarea-bordered h-24 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button type="submit" className="btn btn-neutral" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
