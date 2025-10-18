'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const navigateToStartPage = () => {
    router.push('/dashboard/start');
  };

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <button
          type="button"
          onClick={navigateToStartPage}
          className="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center font-semibold text-sm text-white uppercase transition duration-200 ease-in-out hover:bg-gray-900"
        >
          Start the App
        </button>
      </main>
    </div>
  );
}
