import z from 'zod';
import { createParser, type ServerSourceEvent } from './eventsource-parser';

const llmMessageSchema = z.object({
	role: z.enum(['system', 'assistant', 'user']),
	content: z.string()
});

export const llmRequestSchema = z.object({
	messages: z.array(llmMessageSchema)
});

export type LLMMessage = z.infer<typeof llmMessageSchema>;
export type LLMRequest = z.infer<typeof llmRequestSchema>;

export const llmDeltaSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('content'),
		content: z.string()
	}),
	z.object({
		type: z.literal('thought'),
		thought: z.string()
	})
]);

export type LLMDelta = z.infer<typeof llmDeltaSchema>;

export async function llmStreamApi({
	llmRequest,
	onDelta,
	onDone,
	signal
}: {
	llmRequest: LLMRequest;
	onDelta: (delta: LLMDelta) => void;
	onDone: () => void;
	signal: AbortSignal;
}) {
	const llmResponse = await fetch('/api/llm', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(llmRequestSchema.parse(llmRequest)),
		signal
	});
	const body = llmResponse.body;
	if (!body) {
		return;
	}
	const reader = body.getReader();

	const parser = createParser(async (event: ServerSourceEvent) => {
		if (event.type === 'event') {
			if (event.data === '[DONE]') {
				onDone();
			} else {
				const delta = llmDeltaSchema.parse(JSON.parse(event.data));
				onDelta(delta);
			}
		}
	});

	const textDecoder = new TextDecoder();
	let done = false;
	while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		if (value) {
			await parser.feed(textDecoder.decode(value, { stream: true }));
		}
	}
}
