<script lang="ts">
	import { llmStreamApi, type LLMDelta } from '$lib/util/llmApi';

	let chatInput: string;
	async function handleSubmit() {
		const abortController = new AbortController();
		await llmStreamApi({
			llmRequest: { messages: [{ role: 'user', content: 'how are you?' }] },
			onDelta: (delta: LLMDelta) => {
				console.log({ delta });
			},
			onDone: () => {},
			signal: abortController.signal
		});
		console.log('hi');
	}
</script>

<main>
	<ul>
		<!-- {#each chat.messages as message, messageIndex (messageIndex)}
			<li>
				<div>{message.role}</div>
				<div>
					{#each message.parts as part, partIndex (partIndex)}
						{#if part.type === 'text'}
							<div>{part.text}</div>
						{:else if part.type === 'reasoning'}
							<div>{part.reasoning}</div>
						{/if}
					{/each}
				</div>
			</li>
		{/each} -->
	</ul>
	<form onsubmit={handleSubmit}>
		<input bind:value={chatInput} />
		<button type="submit">Send</button>
	</form>
</main>
