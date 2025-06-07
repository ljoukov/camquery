import { GOOGLE_GENERATIVE_AI_API_KEY } from '$env/static/private';
import { GenerateContentResponse, GoogleGenAI, type Content } from '@google/genai';

export async function llmStream({
	contents
}: {
	contents: Content[];
}): Promise<AsyncGenerator<GenerateContentResponse>> {
	const ai = new GoogleGenAI({
		apiKey: GOOGLE_GENERATIVE_AI_API_KEY
	});
	const config = {
		responseMimeType: 'text/plain',
		thinkingConfig: {
			includeThoughts: true
		}
	};
	const model = 'gemini-2.5-pro-preview-06-05';
	return await ai.models.generateContentStream({
		model,
		config,
		contents
	});
	// let thoughts = '';
	// let answer = '';
	// for await (const chunk of response) {
	// 	for (const part of chunk.candidates[0].content.parts) {
	// 		if (!part.text) {
	// 			continue;
	// 		} else if (part.thought) {
	// 			if (!thoughts) {
	// 				console.log('Thoughts summary:');
	// 			}
	// 			console.log(part.text);
	// 			thoughts = thoughts + part.text;
	// 		} else {
	// 			if (!answer) {
	// 				console.log('Answer:');
	// 			}
	// 			console.log(part.text);
	// 			answer = answer + part.text;
	// 		}
	// 	}
	// }
}
