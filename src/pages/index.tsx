import Head from "next/head";
import { api } from "$/utils/api";
import Image from "next/image";
import React from "react";

type Rating = 1 | 2 | 3 | 4 | 5;

export default function Home() {
  const [currentRating, setCurrentRating] = React.useState<Rating | null>(null);
  const [currentComicId, setCurrentComicId] = React.useState<number>(-1);
  const comicQuery = api.getComicById.useQuery(
    {
      id: currentComicId,
    },
    {
      refetchOnWindowFocus: false,
      retry(_failureCount, error) {
        return error.data?.code !== "BAD_REQUEST";
      },
    },
  );

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-800 p-12 text-white">
        {comicQuery.isFetching ? (
          <p>Loading...</p>
        ) : comicQuery.isError ? (
          <p>Error: {comicQuery.error.message}</p>
        ) : comicQuery.isSuccess ? (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl">{comicQuery.data.title}</h1>

            <Image
              src={comicQuery.data.img}
              alt={comicQuery.data.alt}
              width={400}
              height={400}
            />

            <div className="flex items-center gap-2">
              {([1, 2, 3, 4, 5] as const satisfies readonly Rating[]).map(
                (rating) => (
                  <button
                    type="button"
                    key={rating}
                    onClick={() => {
                      setCurrentRating(rating);
                    }}
                    className={
                      rating <= (currentRating ?? 0)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentRating(null);
                setCurrentComicId((prev) => prev + 1);
              }}
              disabled={currentRating === null}
              className="mt-4 rounded-md bg-white px-4 py-2 text-black disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : (
          <p>No data, unknown error</p>
        )}
      </main>
    </>
  );
}
