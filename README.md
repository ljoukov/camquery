# CamQuery

### Demystifying Local Government Policy with Frugal AI.

`Created for the Frugal AI Hub Hackathon - Judge Business School - June 2025`

[![Hackathon](https://img.shields.io/badge/Frugal%20AI%20Hackathon-June%202025-blue)](https://www.jbs.cam.ac.uk/faculty-research/hubs/frugal-ai-hub/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-prototype-orange.svg)]()

---

## 1. The Problem: The Democratic Information Gap

Local government plans, like the **Greater Cambridge Local Plan**, are the blueprints for our community's future. They dictate everything from where new homes are built to how we protect our green spaces.

However, these documents are often hundreds of pages long, filled with technical jargon and complex policy codes. This creates a significant barrier for the average resident, leading to:

- **Reduced Citizen Engagement:** People can't participate in consultations if they can't easily understand the proposals.
- **Increased Digital Inequality:** Those without the time or expertise to decode these documents are left out of the conversation.
- **Opaque Decision-Making:** It's difficult to hold local authorities accountable for policies that are hard to find and comprehend.

The source document for this project, the _Greater Cambridge Local Plan First Proposals (2021)_, is **372 pages long**. How can a busy parent, a small business owner, or a student be expected to find the specific information that affects them?

## 2. Our Solution: CamQuery

**CamQuery** is a frugal, AI-powered conversational chatbot that acts as a knowledgeable and patient guide to local planning documents.

Instead of reading 372 pages, residents can simply ask questions in plain English, such as:

- `"How many new homes are being planned?"`
- `"What's the policy on building in my garden?"`
- `"Are there plans to protect the River Cam?"`

CamQuery reads the entire document in seconds and provides a clear, concise answer, complete with a direct reference to the source policy and page number for verification.

**[Link to Live Demo - Deployed on Hugging Face Spaces]** `(placeholder)`

### Key Features

- **Natural Language Q&A:** Ask questions just like you would to a person.
- **Source-Cited Answers:** Every answer includes a link to the specific policy or page number, building trust and allowing for deeper dives.
- **Thematic Query Suggestions:** Provides example questions to help users explore key themes like housing, environment, and transport.
- **Lightweight & Mobile-First:** Designed to be accessible on any device, especially mobile phones, without requiring a powerful computer.
- **"Explain It Simply" Mode:** A feature that re-phrases complex policy language into easy-to-understand summaries.

### Screenshot

_(A mock-up of the simple, clean interface)_

```
-----------------------------------------
| CamQuery - Your Local Plan Expert      |
|----------------------------------------|
|                                        |
| AI: Hello! How can I help you          |
|     understand the Greater Cambridge   |
|     Local Plan today?                  |
|                                        |
| You: What are the rules on car         |
|      parking for new houses?           |
|                                        |
| AI: The plan proposes a design-led     |
|     approach, avoiding fixed standards.|
|     Parking levels will depend on how  |
|     accessible a location is by public |
|     transport. It also requires new    |
|     homes with private parking to have |
|     an electric vehicle charge point.  |
|                                        |
|     (Source: Policy I/EV, Pages 307-308)|
|                                        |
| [____________________________________] |
-----------------------------------------
```

## 3. Technical Architecture

### We ensure quality of responses by:

1. We use **official documents** from Cambridge City Council to ensure model does not halucinate the answers
2. We use prompt engineering to ensure the answers come with **explicit quotations** from the documents, including page number.
3. We ensure **numbers** are correctly calculated by using code execution (instread of LLM making calculations which is challenging for LLMs)

### We adhere to frugal AI spirit minimizing costs by:

1. Original documents come in PDF format, this is expensive to handle with Large Language Models, thus we prepare the documents in simpler form using [LlamaIndex AI](https://www.llamaindex.ai/) dropping the costs more than 10x.
2. We outline the thinking process for the Large Language Model in the prompt thus reducing its reasoning budget over 2x
3. We further limit maximum resource usage by the Large Language Model
4. We host the solution on Cloudflare which does not charge when LLM is producing response. It takes up to 10-30 seconds to produce typical response which is expensive with other hosting providers like Amazon AWS or Google GCP, with Cloudflare we inccur negligible costs as fit well into the free budget.

## 4. How We Addressed the Hackathon Challenges

- **Enhancing Citizen Engagement:** CamQuery directly tackles this by transforming a dense, inaccessible document into an interactive, easy-to-use tool. It empowers residents to understand and question local policy.
- **Tackling Digital Inequality:** By simplifying complex information and making it mobile-accessible, we level the playing field. Residents no longer need a law degree or hours of free time to understand how planning decisions will affect their lives.
- **Visualising and Interpreting Public Data:** Our solution interprets 372 pages of unstructured text data, making it searchable and understandable, and presenting the findings in a clean, digestible format.

## 5. Future Work

- **Multi-Document Knowledge Base:** Ingest a wider range of documents (e.g., adopted final plans, supplementary planning documents, council meeting minutes from 2022-2025) to provide a truly up-to-date and comprehensive knowledge source.
- **Proactive Alerts:** Allow users to subscribe to alerts for specific policies or locations (e.g., "Notify me of any new planning applications that reference Policy H/GL").
- **Multi-Language Support:** Use translation APIs to make the service accessible to non-English speakers, further enhancing inclusivity.
- **Voice Accessibility:** Integrate voice-to-text and text-to-speech for users with visual impairments or those who prefer voice interaction.
