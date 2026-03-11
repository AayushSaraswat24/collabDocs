import Link from "next/link"

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800
      bg-white dark:bg-neutral-900 hover:shadow-md transition"
    >
      <h3 className="font-semibold text-lg mb-2">{title}</h3>

      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
        {desc}
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="flex-1 overflow-y-auto  bg-white dark:bg-neutral-950">

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/70 via-transparent to-transparent dark:from-amber-900/10 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-24 text-center">

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Real-time collaborative writing
          </h1>

          <p className="mt-6 text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            CollabDoc lets teams write together in real-time with AI assistance,
            version history, and powerful collaboration tools.
          </p>

          <div className="flex justify-center mt-10">

            <Link
              href="/docs"
              className="px-6 py-3 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
            >
              Start Writing
            </Link>

          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">

        <div className="max-w-6xl mx-auto px-4 py-20">

          <h2 className="text-3xl font-semibold text-center text-neutral-900 dark:text-white mb-14">
            Built for seamless collaboration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <Feature
              title="Real-time editing"
              desc="Multiple users can edit the same document simultaneously with instant updates."
            />

            <Feature
              title="Live cursors"
              desc="See collaborator cursors in real-time with their name and color indicator."
            />

            <Feature
              title="Version history"
              desc="Save document snapshots and restore previous versions instantly."
            />

            <Feature
              title="Role based access"
              desc="Owner, editor, and viewer roles ensure secure document collaboration."
            />

            <Feature
              title="Invite collaborators"
              desc="Invite teammates to collaborate on documents instantly."
            />

            <Feature
              title="Export documents"
              desc="Export documents as PDF, Markdown, or Plain Text."
            />

          </div>

        </div>
      </section>


      {/* AI SECTION */}
      <section className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">

        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-14 items-center">

          <div>
            <h2 className="text-3xl font-semibold mb-4 text-neutral-900 dark:text-white">
              AI writing assistant
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Improve your writing with built-in AI tools. Rewrite, summarize,
              or generate ideas instantly while collaborating with your team.
            </p>

            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>• Rewrite paragraphs instantly</li>
              <li>• Summarize long documents</li>
              <li>• Generate ideas with AI</li>
            </ul>
          </div>

          <div
            className="rounded-xl border border-neutral-200 dark:border-neutral-800
            p-6 bg-white dark:bg-neutral-950 shadow-sm"
          >

            <p className="text-sm text-neutral-500">
              AI Example
            </p>

            <p className="mt-3 text-neutral-800 dark:text-neutral-200">
              “Rewrite this paragraph to sound more professional.”
            </p>

            <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 border-t pt-4">
              AI suggestions appear instantly inside the editor.
            </div>

          </div>

        </div>

      </section>


      {/* TECH STACK */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">

        <div className="max-w-5xl mx-auto px-4 py-20 text-center">

          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-10">
            Built with modern technologies
          </h2>

          <div className="flex flex-wrap justify-center gap-3 text-sm">

            <span className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
              Next.js App Router
            </span>

            <span className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
              Express + Socket.IO
            </span>

            <span className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
              Yjs Collaboration
            </span>

            <span className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
              Prisma + PostgreSQL
            </span>

            <span className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
              AI Integration
            </span>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">

          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-6">
            Start collaborating today
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 mb-10">
            Create documents, invite collaborators, and write together in real-time.
          </p>

          <Link
            href="/docs"
            className="px-8 py-3 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
          >
            Create your first document
          </Link>

        </div>

      </section>

    </main>
  )
}