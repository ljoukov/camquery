<script lang="ts">
	import { marked } from 'marked';
	import { llmStreamApi, type LLMDelta, type LLMMessage } from '$lib/util/llmApi';

	let streaming = false;
	let dialog: LLMMessage[] = [];
	let chatInput: string;
	let responseThought: string = '';
	let responseContent: string = '';
	async function onSubmit() {
		if (streaming) {
			return;
		}
		streaming = true;
		responseThought = '';
		responseContent = '';
		const abortController = new AbortController();
		try {
			dialog.push({ role: 'user', content: chatInput });
			chatInput = '';
			dialog = dialog;
			await llmStreamApi({
				llmRequest: { messages: dialog },
				onDelta: (delta: LLMDelta) => {
					switch (delta.type) {
						case 'content': {
							responseContent += delta.content;
							break;
						}
						case 'thought': {
							responseThought += delta.thought;
							break;
						}
					}
				},
				onDone: () => {},
				signal: abortController.signal
			});
		} finally {
			dialog.push({ role: 'assistant', content: responseContent });
			dialog = dialog;
			streaming = false;
		}
	}

	const questions: string[] = [
		'How many new homes are being planned?',
		"What's the policy on building in my garden?",
		'Are there plans to protect the River Cam?'
	];

	function selectQuestion(question: string) {}
</script>

<!-- <main>
	<ul>
		{#each dialog as message, messageIndex (messageIndex)}
			<li class="border-2 p-2">
				<div>{message.role}</div>
				<div>
					{#if message.content}
						{#if message.role === 'assistant'}
							<div>{@html marked(message.content)}</div>
						{:else}
							<div>{message.content}</div>
						{/if}
					{/if}
				</div>
			</li>
		{/each}
		{#if streaming}
			<div class="border-2 p-2">
				<div>{@html marked(responseThought)}</div>
				<div>{@html marked(responseContent)}</div>
			</div>
		{/if}
	</ul>
	<form onsubmit={handleSubmit}>
		<input disabled={streaming} bind:value={chatInput} />
		<button type="submit" disabled={streaming}>Send</button>
	</form>
</main> -->

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="gradient-bg relative overflow-hidden py-6 text-white">
		<div class="floating-shapes">
			<div class="shape h-16 w-16 rounded-full bg-white"></div>
			<div class="shape h-12 w-12 rounded-lg bg-white"></div>
			<div class="shape h-20 w-20 rounded-full bg-white"></div>
		</div>

		<div class="container relative z-10 mx-auto px-4">
			<div class="fade-in text-center">
				<h1 class="mb-4 text-4xl font-bold md:text-6xl">
					<span class="text-yellow-300">Cam</span>Query
				</h1>
				<p class="mb-2 text-xl text-blue-100 md:text-2xl">Cambridge Planning Portal</p>
				<p class="mx-auto max-w-2xl text-lg text-blue-200">
					Your gateway to understanding Cambridge's development plans, housing policies, and
					planning regulations
				</p>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-12">
		<!-- Search Section -->
		<section class="fade-in stagger-1 mb-16">
			<div class="mx-auto max-w-4xl">
				<div class="glass-effect rounded-2xl p-8 shadow-lg">
					<h2 class="mb-8 text-center text-3xl font-bold text-gray-800">
						Ask Your Cambridge Planning Question
					</h2>

					<div class="relative">
						<input
							type="text"
							id="queryInput"
							placeholder="e.g., How many new homes are being planned for Cambridge?"
							class="search-input w-full rounded-xl border-2 border-gray-200 px-6 py-4 text-lg shadow-sm focus:border-blue-500 focus:outline-none"
						/>
						<button
							on:click={onSubmit}
							class="absolute right-2 top-2 rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700"
						>
							Search
						</button>
					</div>

					<div class="mt-6 text-center">
						<p class="text-gray-600">Press Enter to search or click on a popular question below</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Popular Questions -->
		<section class="mb-16">
			<div class="mx-auto max-w-6xl">
				<h2 class="fade-in stagger-2 mb-12 text-center text-3xl font-bold text-gray-800">
					Popular Questions
				</h2>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each questions as question}
						<button
							type="button"
							class="question-card glass-effect fade-in stagger-3 rounded-xl p-6 shadow-lg"
							on:click={() => selectQuestion(question)}
						>
							<div class="flex items-start space-x-4">
								<div class="rounded-lg bg-blue-100 p-3">
									<svg
										class="h-6 w-6 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										></path>
									</svg>
								</div>
								<div>
									<h3 class="mb-2 font-semibold text-gray-800">New Housing Development</h3>
									<p class="text-sm text-gray-600">
										How many new homes are being planned for Cambridge?
									</p>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="mb-16">
			<div class="mx-auto max-w-6xl">
				<h2 class="fade-in mb-12 text-center text-3xl font-bold text-gray-800">
					Why Use CamQuery?
				</h2>

				<div class="grid gap-8 md:grid-cols-3">
					<div class="fade-in stagger-1 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
						>
							<svg
								class="h-8 w-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-800">Fast Answers</h3>
						<p class="text-gray-600">
							Get instant responses to your Cambridge planning questions with our intelligent search
							system.
						</p>
					</div>

					<div class="fade-in stagger-2 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
						>
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-800">Accurate Information</h3>
						<p class="text-gray-600">
							Access up-to-date and verified information from Cambridge City Council planning
							departments.
						</p>
					</div>

					<div class="fade-in stagger-3 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100"
						>
							<svg
								class="h-8 w-8 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
								></path>
							</svg>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-800">Community Focused</h3>
						<p class="text-gray-600">
							Built specifically for Cambridge residents to stay informed about local development
							and planning.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Results Section (Hidden initially) -->
		<section id="resultsSection" class="mb-16 hidden">
			<div class="mx-auto max-w-4xl">
				<div class="glass-effect rounded-2xl p-8 shadow-lg">
					<h2 class="mb-6 text-2xl font-bold text-gray-800">Search Results</h2>
					<div id="resultsContent" class="space-y-4">
						<!-- Results will be populated here -->
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="bg-gray-800 py-12 text-white">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 md:grid-cols-3">
				<div>
					<h3 class="mb-4 text-xl font-bold">CamQuery</h3>
					<p class="text-gray-300">
						Making Cambridge planning information accessible to all residents.
						<br />
						<strong>Disclaimer:</strong> CamQuery is an independent project and is not affiliated with
						or endorsed by Cambridge City Council.
					</p>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-semibold">Source Code</h3>
					<p class="text-gray-300">
						<a href="https://github.com/ljoukov/camquery" class="hover:underline" target="_blank">
							Open source on GitHub
						</a>
					</p>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-semibold">Offical References</h3>
					<p class="mb-2 text-gray-300">
						<a
							href="https://www.cambridge.gov.uk/"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:underline"
						>
							Cambridge City Council
						</a>
					</p>
					<p class="text-gray-300">
						<a
							href="https://www.cambridge.gov.uk/planning"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:underline"
						>
							Planning Department
						</a>
					</p>
				</div>
			</div>

			<div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
				<p>&copy; 2025 CamQuery. Unofficial. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

	body {
		font-family: 'Inter', sans-serif;
	}

	.gradient-bg {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.glass-effect {
		backdrop-filter: blur(10px);
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.question-card {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
	}

	.question-card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.search-input {
		transition: all 0.3s ease;
	}

	.search-input:focus {
		transform: scale(1.02);
	}

	.floating-shapes {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 0;
	}

	.shape {
		position: absolute;
		opacity: 0.1;
		animation: float 6s ease-in-out infinite;
	}

	.shape:nth-child(1) {
		top: 20%;
		left: 10%;
		animation-delay: 0s;
	}

	.shape:nth-child(2) {
		top: 60%;
		right: 10%;
		animation-delay: 2s;
	}

	.shape:nth-child(3) {
		bottom: 20%;
		left: 20%;
		animation-delay: 4s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
		}
	}

	.fade-in {
		animation: fadeIn 0.8s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.stagger-1 {
		animation-delay: 0.1s;
	}
	.stagger-2 {
		animation-delay: 0.2s;
	}
	.stagger-3 {
		animation-delay: 0.3s;
	}
	.stagger-4 {
		animation-delay: 0.4s;
	}
	.stagger-5 {
		animation-delay: 0.5s;
	}
</style>
