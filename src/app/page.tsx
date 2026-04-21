import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <Image
            width={180}
            alt="imagen"
            src="data:image/png;base64,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"
          ></Image>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
