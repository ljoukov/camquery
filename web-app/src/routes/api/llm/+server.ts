import type { RequestHandler } from './$types';
import { llmRequestSchema, type LLMDelta } from '$lib/util/llmApi';
import { llmStream } from '$lib/server/llm';
import type { Content } from '@google/genai';
import { errorAsString } from '$lib/util/error';

export const POST = (async ({ request }) => {
	const llmRequest = llmRequestSchema.parse(await request.json());
	const contents: Content[] = [];
	for (const message of llmRequest.messages) {
		contents.push({
			parts: [{ text: message.content }],
			role: message.role
		});
	}
	const response = await llmStream({ contents });
	const { readable, writable } = new TransformStream();
	const textEncoder = new TextEncoder();
	new ReadableStream({
		start(controller) {
			controller.enqueue(new Uint8Array(0));
			controller.close();
		}
	})
		.pipeThrough(
			new TransformStream({
				async start(controller) {
					try {
						for await (const content of response) {
							const delta: LLMDelta | undefined = (() => {
								if (content.candidates && content.candidates.length == 1) {
									const candidate = content.candidates[0];
									if (
										candidate.content &&
										candidate.content.parts &&
										candidate.content.parts.length === 1
									) {
										const part = candidate.content.parts[0];
										if (part.text) {
											if (part.thought) {
												return {
													type: 'thought',
													thought: part.text
												};
											} else {
												return {
													type: 'content',
													content: part.text
												};
											}
										}
									}
								}
							})();
							if (delta !== undefined) {
								controller.enqueue(textEncoder.encode(`data: ${JSON.stringify(delta)}\n\n`));
							}
						}
						controller.enqueue(textEncoder.encode(`data: [DONE]\n\n`));
						controller.terminate();
					} catch (e) {
						console.warn(`api/llm error: ${errorAsString(e)}`);
						controller.enqueue(textEncoder.encode(`error: server error\n\n`));
					}
				}
			})
		)
		.pipeTo(writable)
		.catch(() => {
			console.error('Exception in api/llm.catch, aborting response generation.');
		});
	const responseHeaders = {
		headers: { 'Content-Type': 'text/event-stream' }
	};
	return new Response(readable, responseHeaders);
}) satisfies RequestHandler;
