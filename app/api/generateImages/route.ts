import Together from "together-ai";
import { z } from "zod";

const ImageConfig = z.object({
  prompt: z.string(),
  iterativeMode: z.boolean(),
  width: z.number().min(512).max(1024).default(1024),
  height: z.number().min(512).max(1024).default(768),
  steps: z.number().min(1).max(4).default(3),
});

export async function POST(req: Request) {
  let json = await req.json();
  let { prompt, iterativeMode, width, height, steps } = ImageConfig.parse(json);

  const client = new Together({});

  try {
    const response = await client.images.create({
      prompt,
      model: "black-forest-labs/FLUX.1-schnell-Free",
      width,
      height,
      seed: iterativeMode ? 123 : undefined,
      steps,
      // @ts-expect-error - this is not typed in the API
      response_format: "base64",
    });

    return Response.json(response.data[0]);
  } catch (e: any) {
    return Response.json(
      { error: e.toString() },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
