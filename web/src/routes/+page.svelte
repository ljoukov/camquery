<!-- <script lang="ts">
	// Search functionality
	function submitQuery() {
		const query = document.getElementById('queryInput').value.trim();
		if (query) {
			showResults(query);
		}
	}

	function selectQuestion(question) {
		document.getElementById('queryInput').value = question;
		showResults(question);
	}

	function showResults(query) {
		const resultsSection = document.getElementById('resultsSection');
		const resultsContent = document.getElementById('resultsContent');

		// Show results section
		resultsSection.classList.remove('hidden');
		resultsSection.scrollIntoView({ behavior: 'smooth' });

		// Simulate loading and show mock results
		resultsContent.innerHTML = `
          <div class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
      `;

		// Simulate API response after 1.5 seconds
		setTimeout(() => {
			resultsContent.innerHTML = generateMockResults(query);
		}, 1500);
	}

	function generateMockResults(query) {
		const mockResponses = {
			default: `
              <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div class="flex">
                      <div class="flex-shrink-0">
                          <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                      </div>
                      <div class="ml-3">
                          <p class="text-sm text-blue-700">
                              <strong>Your Question:</strong> "${query}"
                          </p>
                      </div>
                  </div>
              </div>
              
              <div class="space-y-6">
                  <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">Cambridge Local Plan 2018-2040</h3>
                      <p class="text-gray-600 mb-4">Based on the current Local Plan, Cambridge has allocated sites for approximately 14,000 new homes between 2018-2040. This includes both urban developments and strategic sites around the city.</p>
                      <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-500">Updated: March 2025</span>
                          <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Read Full Document →</a>
                      </div>
                  </div>
                  
                  <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">Recent Planning Committee Decisions</h3>
                      <p class="text-gray-600 mb-4">The Planning Committee has recently approved several major developments including the North East Cambridge development which will provide 8,000 new homes with 40% affordable housing provision.</p>
                      <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-500">Updated: February 2025</span>
                          <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View Committee Minutes →</a>
                      </div>
                  </div>
                  
                  <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">Housing Delivery Update</h3>
                      <p class="text-gray-600 mb-4">Cambridge is currently delivering approximately 1,200 new homes per year. Priority areas include sustainable transport corridors and brownfield regeneration sites.</p>
                      <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-500">Updated: January 2025</span>
                          <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View Housing Strategy →</a>
                      </div>
                  </div>
              </div>
              
              <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600">
                      <strong>Need more specific information?</strong> Contact Cambridge City Council Planning Department at 
                      <a href="mailto:planning@cambridge.gov.uk" class="text-blue-600 hover:text-blue-800">planning@cambridge.gov.uk</a> 
                      or call 01223 457000.
                  </p>
              </div>
          `
		};

		return mockResponses.default;
	}

	// Enter key functionality
	document.getElementById('queryInput').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			submitQuery();
		}
	});

	// Smooth scrolling for anchor links
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});
</script> -->

<script lang="ts">
	function submitQuery() {}
	function selectQuestion(question: string) {}

	const questions: string[] = [];
</script>

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
							on:click={submitQuery}
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
