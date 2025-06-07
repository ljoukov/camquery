import type { RequestHandler } from './$types';
import { llmRequestSchema, type LLMDelta } from '$lib/util/llmApi';
import { errorAsString } from '$lib/util/error';
import { llmStream, type LLMMessage } from '$lib/server/llm';

export const POST = (async ({ request }) => {
	const llmRequest = llmRequestSchema.parse(await request.json());
	const messages: LLMMessage[] = [];
	for (const message of llmRequest.messages) {
		messages.push({
			role: message.role,
			content: [{ type: 'text', text: message.content }]
		});
	}
	const response = await llmStream({
		model: 'gemini-2.5-pro-preview-06-05',
		messages,
		max_tokens: 4096
	});
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
						for await (const llmDelta of response) {
							if (llmDelta.content) {
								for (const content of llmDelta.content) {
									if (content.type === 'text') {
										const delta: LLMDelta = {
											type: 'content',
											content: content.text
										};
										controller.enqueue(textEncoder.encode(`data: ${JSON.stringify(delta)}\n\n`));
									}
								}
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
