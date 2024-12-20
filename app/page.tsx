"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import imagePlaceholder from "@/public/image-placeholder.png";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageResponse = {
  b64_json: string;
  timings: { inference: number };
};

type Generation = {
  prompt: string;
  image: ImageResponse;
  settings: {
    width: number;
    height: number;
    steps: number;
    iterativeMode: boolean;
  };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [iterativeMode, setIterativeMode] = useState(false);
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  const [steps, setSteps] = useState(3);
  const [generations, setGenerations] = useState<Generation[]>([]);
  let [activeIndex, setActiveIndex] = useState<number>();

  const { data: image, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [prompt, shouldGenerate, width, height, steps, iterativeMode],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, iterativeMode, width, height, steps }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      return (await res.json()) as ImageResponse;
    },
    enabled: shouldGenerate && !!prompt.trim(),
    staleTime: Infinity,
    retry: false,
  });

  // Reset shouldGenerate after query completes
  useEffect(() => {
    if (!isFetching && shouldGenerate) {
      setShouldGenerate(false);
    }
  }, [isFetching, shouldGenerate]);

  useEffect(() => {
    if (image && !generations.map((g) => g.image).includes(image)) {
      setGenerations((prev) => [
        ...prev,
        {
          prompt,
          image,
          settings: {
            width,
            height,
            steps,
            iterativeMode,
          },
        },
      ]);
      setActiveIndex(generations.length);
    }
  }, [generations, image, prompt, width, height, steps, iterativeMode]);

  useEffect(() => {
    if (activeIndex !== undefined) {
      const activeGeneration = generations[activeIndex];
      setPrompt(activeGeneration.prompt);
      setWidth(activeGeneration.settings.width);
      setHeight(activeGeneration.settings.height);
      setSteps(activeGeneration.settings.steps);
      setIterativeMode(activeGeneration.settings.iterativeMode);
    }
  }, [activeIndex, generations]);

  let activeImage =
    activeIndex !== undefined ? generations[activeIndex].image : undefined;

  const handleDownload = () => {
    if (!activeImage) return;
    
    // Convert base64 to blob
    const byteString = atob(activeImage.b64_json);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluxtogether-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col px-5">
      <header className="flex justify-center mb-16 mt-12 md:mt-16">
        <div className="text-2xl font-bold text-gray-200">
          FluxTogether<span className="text-sm text-gray-300">[free]</span>
        </div>
      </header>

      <div className="flex justify-center">
        <form className="w-full max-w-lg">
          <fieldset>
            <div className="relative">
              <Textarea
                rows={4}
                spellCheck={false}
                placeholder="Describe your image..."
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full resize-none rounded-lg border-gray-300 border-opacity-50 bg-gray-400 px-4 text-base placeholder-gray-300"
              />
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-200">Width</label>
                    <select
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="rounded bg-gray-400 px-2 py-1 text-sm"
                    >
                      <option value={512}>512px</option>
                      <option value={768}>768px</option>
                      <option value={1024}>1024px</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-200">Height</label>
                    <select
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="rounded bg-gray-400 px-2 py-1 text-sm"
                    >
                      <option value={512}>512px</option>
                      <option value={768}>768px</option>
                      <option value={1024}>1024px</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-200">Steps</label>
                    <select
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="rounded bg-gray-400 px-2 py-1 text-sm"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label
                    title="Use earlier images as references"
                    className="inline-flex items-center gap-2 text-sm text-gray-200"
                  >
                    Consistency mode
                    <Switch
                      checked={iterativeMode}
                      onCheckedChange={setIterativeMode}
                    />
                  </label>
                  <Button 
                    onClick={() => setShouldGenerate(true)}
                    disabled={isFetching || !prompt.trim()}
                    className="bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    {isFetching ? <Spinner className="size-4" /> : "Generate Image"}
                  </Button>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>

      <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
        {generations.length === 0 ? (
          <div className="max-w-xl md:max-w-4xl lg:max-w-3xl">
            <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-4xl">
              Get flux-y with your images
            </p>
            <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
              Enter a prompt and generate images in milliseconds
            </p>
          </div>
        ) : (
          <div className="mt-4 flex w-full max-w-4xl flex-col justify-center">
            <div className="relative">
              <Image
                placeholder="blur"
                blurDataURL={imagePlaceholder.blurDataURL}
                width={1024}
                height={768}
                src={`data:image/png;base64,${activeImage.b64_json}`}
                alt=""
                className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
              />
              <Button
                onClick={handleDownload}
                className="absolute bottom-4 right-4 bg-gray-200/80 text-gray-600 hover:bg-gray-300/90 backdrop-blur-sm"
                disabled={!activeImage}
              >
                Download
              </Button>
            </div>

            <div className="mt-4 flex gap-4 overflow-x-scroll pb-4">
              {generations.map((generation, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative min-w-[256px] overflow-hidden rounded-lg ${
                    i === activeIndex
                      ? "ring-2 ring-gray-200 ring-offset-2 ring-offset-gray-500"
                      : ""
                  }`}
                >
                  <Image
                    placeholder="blur"
                    blurDataURL={imagePlaceholder.blurDataURL}
                    width={256}
                    height={192}
                    src={`data:image/png;base64,${generation.image.b64_json}`}
                    alt=""
                    className="aspect-[4/3] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-sm text-gray-300 pb-4">
        Powered by Shalabi
      </footer>
    </div>
  );
}
