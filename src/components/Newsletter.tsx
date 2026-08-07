'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

type Status =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string }

export function Newsletter() {
  let [status, setStatus] = useState<Status>({ state: 'idle' })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setStatus({
        state: 'error',
        message: 'Sign-up is not configured yet. Please check back soon.',
      })
      return
    }

    let form = event.currentTarget
    let formData = new FormData(form)

    // Honeypot: silently drop bot submissions that fill the hidden field.
    if (formData.get('botcheck')) {
      setStatus({ state: 'success', message: 'Thanks for subscribing!' })
      form.reset()
      return
    }

    formData.append('access_key', accessKey)
    formData.append('subject', 'New newsletter signup from jasonmelendez.com')
    formData.append('from_name', 'Jason Melendez website')

    setStatus({ state: 'submitting' })

    try {
      let response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      let data = await response.json()

      if (response.ok && data.success) {
        setStatus({
          state: 'success',
          message: 'Thanks for subscribing — keep an eye on your inbox.',
        })
        form.reset()
      } else {
        setStatus({
          state: 'error',
          message: data.message || 'Something went wrong. Please try again.',
        })
      }
    } catch {
      setStatus({
        state: 'error',
        message: 'Network error. Please try again.',
      })
    }
  }

  let isSubmitting = status.state === 'submitting'

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Stay up to date</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get notified when I publish something new, and unsubscribe at any time.
      </p>
      <div className="mt-6 flex items-center">
        <span className="flex min-w-0 flex-auto p-px">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            autoComplete="email"
            required
            className="w-full appearance-none rounded-[calc(var(--radius-md)-1px)] bg-white px-3 py-[calc(--spacing(2)-1px)] shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-teal-500/10 focus:outline-teal-500 sm:text-sm dark:bg-zinc-700/15 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-teal-400/10 dark:focus:outline-teal-400"
          />
        </span>
        {/* Honeypot field for spam bots; hidden from real users. */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <Button type="submit" className="ml-4 flex-none" disabled={isSubmitting}>
          {isSubmitting ? 'Joining…' : 'Join'}
        </Button>
      </div>
      {status.state === 'success' && (
        <p className="mt-4 text-sm text-teal-600 dark:text-teal-400" role="status">
          {status.message}
        </p>
      )}
      {status.state === 'error' && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {status.message}
        </p>
      )}
    </form>
  )
}
