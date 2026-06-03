"use client";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">&#x1F370;</div>
      <h1 className="font-serif text-xl text-wood tracking-[3px] mb-2">出了点问题</h1>
      <p className="text-sm text-wood-light mb-8">请刷新页面重试</p>
      <button onClick={reset} className="btn-primary">
        刷新
      </button>
    </div>
  );
}
