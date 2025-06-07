import { z } from 'zod';
import { GOOGLE_GENERATIVE_AI_API_KEY } from '$env/static/private';
import { createParser, type ServerSourceEvent } from '$lib/util/eventsource-parser';
import type { Json } from './json';
import { errorAsString, responseErrorAsString } from './error';

const googleModels = ['gemini-2.5-pro-preview-06-05'] as const;

export type GoogleLLMModel = (typeof googleModels)[number];

export const llmModels = [...googleModels] as const;

export const llmModelSchema = z.enum(llmModels);

export type LLMModel = z.infer<typeof llmModelSchema>;

export function isGoogleModel(model: LLMModel): model is GoogleLLMModel {
	return (googleModels as readonly string[]).includes(model);
}

export type LlmCompletionDeltaParser = {
	feed(delta: string, controller: TransformStreamDefaultController<Uint8Array>): Promise<void>;
	done(controller: TransformStreamDefaultController<Uint8Array>): Promise<void>;
};

const googleLlmProviders = ['GOOGLE_AI'] as const;
const googleLlmProviderSchema = z.enum(googleLlmProviders);
type GoogleLLMProvider = z.infer<typeof googleLlmProviderSchema>;

function getGoogleLlmProvider(): GoogleLLMProvider {
	return 'GOOGLE_AI';
}

export const llmProvidersList = [...googleLlmProviders] as const;

export const llmProviderSchema = z.enum(llmProvidersList);
export type LLMProvider = z.infer<typeof llmProviderSchema>;

export const llmCompletionSchema = z.object({
	created: z.number(),
	choices: z
		.array(
			z.object({
				index: z.literal(0),
				message: z.object({
					role: z.literal('assistant'),
					content: z.string().optional()
				}),
				finish_reason: z
					.enum(['stop', 'length', 'function_call', 'content_filter'])
					.nullable()
					.optional()
			})
		)
		.length(1) /* always length 1 */
});

export type LLMCompletion = z.infer<typeof llmCompletionSchema>;

const llmMessageTextPart = z.object({
	type: z.literal('text'),
	text: z.string()
});

export type LLMMessageTextPart = z.infer<typeof llmMessageTextPart>;

export function textPart(text: string): LLMMessageContentPart {
	return { type: 'text', text };
}

const llmMessageContentPartSchema = z.discriminatedUnion('type', [llmMessageTextPart]);

export type LLMMessageContentPart = z.infer<typeof llmMessageContentPartSchema>;

const llmMessageContentSchema = z.array(llmMessageContentPartSchema);

export type LLMMessageContent = z.infer<typeof llmMessageContentSchema>;

const llmMessageSchema = z.object({
	role: z.enum(['system', 'assistant', 'user']),
	content: llmMessageContentSchema
});

export type LLMMessage = z.infer<typeof llmMessageSchema>;

export type LLMPromptMessage = Omit<LLMMessage, 'role'> & {
	role: Exclude<LLMMessage['role'], 'assistant'>;
};

export type LLMRequestId = {
	requestId: string;
	tag: string;
};

const llmLogRequestSchema = z.object({
	messages: z.array(llmMessageSchema),
	maxTokens: z.number(),
	temperature: z.number().optional()
});

type LLMLogRequest = z.infer<typeof llmLogRequestSchema>;

const llmLogRecordSchema = z.object({
	requestId: z.string(),
	createdAtMillis: z.number(),
	completedAtMillis: z.number().nullable(),
	model: z.string(),
	provider: z.string(),
	tag: z.string(),
	error: z.string().nullable(),
	responseModel: z.string().nullable(),
	promptTokens: z.number(),
	completionTokens: z.number(),
	request: llmLogRequestSchema,
	responseContent: llmMessageContentSchema.nullable()
});

const responseModalitiesSchema = z.enum(['text', 'image']);
type ResponseModalities = z.infer<typeof responseModalitiesSchema>;

export type LLMCompletionRequest = {
	llmRequestId: LLMRequestId;
	model: LLMModel;
	messages: LLMMessage[];
	max_tokens: number;
	n?: number;
	temperature?: number;
	responseModalities?: ResponseModalities[];
};

async function llmFetch(request: {
	url: URL;
	headers: Record<string, string>;
	requestBody: Json;
}): Promise<Response & { body: ReadableStream<Uint8Array> }> {
	const fetchResponse = await fetch(request.url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...request.headers
		},
		body: JSON.stringify(request.requestBody)
	});
	if (!fetchResponse.ok) {
		const errorText = await responseErrorAsString(fetchResponse);
		console.log(
			errorText,
			'\nREQUEST:',
			JSON.stringify(request.requestBody, null, 2).slice(0, 1_000)
		);
		throw Error(errorText);
	}
	if (!fetchResponse.body) {
		const errorText = 'LLM returned empty body';
		console.log(errorText);
		throw Error(errorText);
	}
	return fetchResponse as Response & { body: ReadableStream<Uint8Array> };
}

function getBearerHeaders(token: string): Record<string, string> {
	return {
		Authorization: `Bearer ${token}`
	};
}

export type LLMDelta = {
	index: number;
	content?: LLMMessageContent;
	isLast?: boolean;
};

export type LLMUsage = {
	responseModel?: string;
	promptTokens?: number;
	completionTokens?: number;
};

type LLMApiConfig = {
	provider: LLMProvider;
	url: URL;
	headers: Record<string, string>;
	requestBody: Json;
	parseDelta: (delta: string, usage: LLMUsage) => Promise<LLMDelta>;
};

// https://ai.google.dev/api/caching#Part
const googleContentPartSchema = z.object({ text: z.string() });
type GoogleContentPart = z.infer<typeof googleContentPartSchema>;

const googleContentPartsSchema = z.array(googleContentPartSchema);
type GoogleContentParts = z.infer<typeof googleContentPartsSchema>;

const googleRoleSchema = z.enum(['user', 'model']);
type GoogleRole = z.infer<typeof googleRoleSchema>;

// https://ai.google.dev/api/caching#Content
const googleContentSchema = z.object({
	role: googleRoleSchema.optional(),
	parts: googleContentPartsSchema
});

const googleSystemInstructionSchema = z.object({
	parts: googleContentPartsSchema
});

export type GoogleSystemInstruction = z.infer<typeof googleSystemInstructionSchema>;
export type GoogleLlmMessage = z.infer<typeof googleContentSchema>;

// https://ai.google.dev/api/generate-content#generationconfig
const googleLlmRequestSchema = z.object({
	contents: z.array(googleContentSchema),
	generationConfig: z.object({
		stopSequences: z.array(z.string()).optional(),
		candidateCount: z.number().int().min(1).optional(),
		maxOutputTokens: z.number().int().min(1),
		temperature: z.number().min(0).max(2).optional(),
		topP: z.number().int().min(0).optional(),
		responseModalities: z.array(z.enum(['TEXT', 'IMAGE'])).optional()
	}),
	safetySettings: z.array(
		z.object({
			category: z.enum([
				'HARM_CATEGORY_HATE_SPEECH',
				'HARM_CATEGORY_DANGEROUS_CONTENT',
				'HARM_CATEGORY_SEXUALLY_EXPLICIT',
				'HARM_CATEGORY_HARASSMENT'
			]),
			threshold: z.enum([
				'OFF',
				'BLOCK_NONE',
				'BLOCK_ONLY_HIGH',
				'BLOCK_MEDIUM_AND_ABOVE',
				'BLOCK_LOW_AND_ABOVE'
			])
		})
	),
	systemInstruction: googleSystemInstructionSchema.optional()
});

export type GoogleLlmRequest = z.infer<typeof googleLlmRequestSchema>;

async function llmMessageToGoogleContentParts(message: LLMMessage): Promise<GoogleContentParts> {
	if (Array.isArray(message.content)) {
		return await Promise.all(
			message.content.map(async (part) => {
				switch (part.type) {
					case 'text':
						return { text: part.text };
					default:
						throw Error(`Unsupported message content type: ${JSON.stringify(part)}`);
				}
			})
		);
	} else {
		return [{ text: message.content }];
	}
}

async function getGoogleLlmRequestBody(
	llmRequest: LLMCompletionRequest & { model: GoogleLLMModel }
) {
	const requestSystemInstruction: GoogleSystemInstruction | undefined =
		llmRequest.messages[0].role === 'system'
			? { parts: await llmMessageToGoogleContentParts(llmRequest.messages[0]) }
			: undefined;
	const requestNonSystemMessages: GoogleLlmMessage[] = await Promise.all(
		llmRequest.messages
			.filter((m) => m.role !== 'system')
			.map(async (m) => ({
				role: m.role === 'assistant' ? 'model' : 'user',
				parts: await llmMessageToGoogleContentParts(m)
			}))
	);
	const { systemInstruction, contents } = ((): {
		systemInstruction: GoogleSystemInstruction | undefined;
		contents: GoogleLlmMessage[];
	} => {
		if (requestNonSystemMessages.length > 0) {
			return { systemInstruction: requestSystemInstruction, contents: requestNonSystemMessages };
		} else if (requestSystemInstruction !== undefined) {
			return {
				systemInstruction: undefined,
				contents: [{ role: 'user', ...requestSystemInstruction }]
			};
		} else {
			return { systemInstruction: undefined, contents: [] };
		}
	})();
	const requestBody: GoogleLlmRequest = {
		contents,
		generationConfig: {
			maxOutputTokens: llmRequest.max_tokens,
			...(llmRequest.responseModalities
				? {
						responseModalities: llmRequest.responseModalities.map((m) => {
							switch (m) {
								case 'text':
									return 'TEXT';
								case 'image':
									return 'IMAGE';
							}
						})
					}
				: {}),
			...(llmRequest.temperature ? { temperature: llmRequest.temperature } : {})
		},
		safetySettings: [
			{ category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
			{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
			{ category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
			{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' }
		],
		...(systemInstruction !== undefined ? { systemInstruction } : {})
	};
	return requestBody;
}

function googleRequestModel(model: GoogleLLMModel): string {
	switch (model) {
		case 'gemini-2.5-pro-preview-06-05':
			return model;
	}
}

async function googleLlmApiConfig(
	llmRequest: LLMCompletionRequest & { model: GoogleLLMModel }
): Promise<LLMApiConfig> {
	const provider = getGoogleLlmProvider();
	const model: string = googleRequestModel(llmRequest.model);
	const requestBody = await getGoogleLlmRequestBody(llmRequest);
	switch (provider) {
		case 'GOOGLE_AI': {
			// const url = new URL(
			// 	`https://gateway.ai.cloudflare.com/v1/${getEnv().CLOUDFLARE_ACCOUNT_ID}/${getEnv().CLOUDFLARE_GATEWAY_SLUG}/google-ai-studio/v1beta/models/${model}:streamGenerateContent?alt=sse`,
			// );
			const url = new URL(
				`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`
			);
			return {
				provider,
				url,
				headers: { 'X-goog-api-key': GOOGLE_GENERATIVE_AI_API_KEY },
				requestBody,
				parseDelta: parseGoogleLlmDelta
			};
		}
	}
}

const googleLlmDeltaSchema = z.object({
	candidates: z
		.array(
			z.object({
				finishReason: z
					.enum([
						'FINISH_REASON_UNSPECIFIED',
						'STOP',
						'MAX_TOKENS',
						'SAFETY',
						'RECITATION',
						'OTHER'
					])
					.optional(),
				content: z.object({
					role: z.enum(['model']),
					parts: z
						.array(
							z.object({
								text: z.string()
							})
						)
						.optional()
				})
			})
		)
		.length(1)
});

async function parseGoogleContentPart(part: GoogleContentPart): Promise<LLMMessageContentPart> {
	return { type: 'text', text: part.text };
}

async function parseGoogleLlmDelta(data: string): Promise<LLMDelta> {
	try {
		const json = JSON.parse(data);
		const chunk = googleLlmDeltaSchema.parse(json);
		const parts = chunk.candidates[0].content.parts;
		const content =
			parts === undefined ? undefined : await Promise.all(parts.map(parseGoogleContentPart));
		return {
			index: 0,
			content,
			...(chunk.candidates[0].finishReason !== undefined ? { isLast: true } : {})
		};
	} catch (e) {
		console.log(`\
parseGoogleLlmDelta: failed to parse LLM delta: ${errorAsString(e)}
DELTA:
${data}`);
		throw e;
	}
}

async function llmApiConfig(llmRequest: LLMCompletionRequest): Promise<LLMApiConfig> {
	const model = llmRequest.model;
	if (isGoogleModel(model)) {
		return await googleLlmApiConfig({ ...llmRequest, model });
	} else {
		return model; // if we enumerated all possible models, the model should be of type 'never'.
	}
}

export async function llmTextCompletion(llmRequest: LLMCompletionRequest): Promise<string> {
	let text = '';
	for await (const delta of llmTextStream(llmRequest)) {
		text += delta;
	}
	return text;
}

export async function llmCompletion(llmRequest: LLMCompletionRequest): Promise<LLMMessageContent> {
	const responseContent: LLMMessageContent = [];
	for await (const llmDelta of llmStream(llmRequest)) {
		if (llmDelta.content !== undefined) {
			for (const delta of llmDelta.content) {
				const lastItem = responseContent[responseContent.length - 1];
				if (responseContent.length > 0 && lastItem.type === 'text' && delta.type === 'text') {
					lastItem.text += delta.text;
				} else {
					responseContent.push(delta);
				}
			}
		}
	}
	return responseContent;
}

export async function llmStreamCompletion(llmRequest: LLMCompletionRequest) {
	const { provider, url, headers, requestBody, parseDelta } = await llmApiConfig(llmRequest);
	const fetchResponse = await llmFetch({
		url,
		headers,
		requestBody
	});
	const responseBody = fetchResponse.body;
	return { responseBody, parseDelta, provider };
}

export async function* llmStream(llmRequest: LLMCompletionRequest): AsyncGenerator<LLMDelta> {
	const { provider, url, headers, requestBody, parseDelta } = await llmApiConfig(llmRequest);

	const requestId = llmRequest.llmRequestId.requestId;

	let responseContent: LLMMessageContent | null = null;
	const fetchResponse = await llmFetch({
		url,
		headers,
		requestBody
	});
	const responseBody = fetchResponse.body;

	const llmUsage: LLMUsage = {};
	let onDataCallback: (() => void) | null = null;
	const callOnDataCallback = () => {
		if (onDataCallback) {
			onDataCallback();
			onDataCallback = null;
		}
	};
	const dataQueue: LLMDelta[] = [];
	let llmDone = false;
	let llmError: unknown;

	const textDecoder = new TextDecoder();
	const sseParser = createParser(async (event: ServerSourceEvent) => {
		if (event.type === 'event') {
			if (event.data === '[DONE]') {
				llmDone = true;
			} else {
				const llmDelta = await parseDelta(event.data, llmUsage);
				if (llmDelta.content !== undefined) {
					if (responseContent === null || responseContent.length === 0) {
						responseContent = llmDelta.content;
					} else {
						for (const delta of llmDelta.content) {
							const lastItem = responseContent[responseContent.length - 1];
							if (lastItem.type === 'text' && delta.type === 'text') {
								lastItem.text += delta.text;
							} else {
								responseContent.push(delta);
							}
						}
					}
				}
				dataQueue.push(llmDelta);
			}
			callOnDataCallback();
		}
	});

	(async () => {
		const llmReader = responseBody.getReader();
		try {
			for (;;) {
				const { done, value } = await llmReader.read();
				if (done) {
					break;
				}
				if (value) {
					const chunk = textDecoder.decode(value, { stream: true });
					await sseParser.feed(chunk);
				}
			}
			llmDone = true;
		} catch (e) {
			llmError = e;
		} finally {
			callOnDataCallback();
			llmReader.releaseLock();
		}
	})();

	for (;;) {
		while (dataQueue.length > 0) {
			yield dataQueue.shift()!;
		}
		if (llmDone) {
			break;
		}
		if (llmError) {
			throw llmError;
		}
		await new Promise<void>((resolve) => (onDataCallback = resolve));
	}
}

export async function* llmTextStream(llmRequest: LLMCompletionRequest): AsyncGenerator<string> {
	for await (const delta of llmStream(llmRequest)) {
		if (delta.content) {
			if (delta.index !== 0) {
				throw Error(`Unexpected non-zero delta index: ${JSON.stringify(delta)}`);
			}
			let text = '';
			for (const content of delta.content) {
				if (content.type !== 'text') {
					throw Error(
						`Unexpected content type '${content.type}' in delta: ${JSON.stringify(delta)}`
					);
				}
				text += content.text;
			}
			yield text;
		}
	}
}
