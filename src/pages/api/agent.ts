import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const SYSTEM_PROMPT = `You are an AI agent on Nguyen Trung Nguyen's personal website.
Answer questions about him concisely and naturally in the style of a terminal agent.
Keep answers short (3-6 lines). Use plain text, no markdown.

About Nguyen Trung Nguyen:
- Final-year B.S. Information Technology student at VNU University of Engineering and Technology (UET), Hanoi
- CPA: 3.7/4.0, Latest GPA: 4.0/4.0
- AI Engineer at Viettel Cyber Security (Aug 2025 - now): RAG Agents for Confluence, SQL Agent for Data Lake House, MCP Server integration (Jira, NocoDB, Confluence, FreshDesk)
- AI Engineer Intern at Viettel Network (Apr - Aug 2025)
- Research Assistant at Information System Lab, UET-VNU (Jun 2024 - now): DeepResearch Agents, RAG Agent for UET Finances Platform
- Published paper: FOAMI at SOICT 2025 (Springer) - ICS threat detection, 89% detection rate, 0.99% false alarm rate
- Skills: Python, TypeScript, Java, SQL, PyTorch, LangChain, LangGraph, LlamaIndex, MCP, FastAPI, Node.js, React, Next.js, Docker, MySQL, Qdrant, Trino
- Projects: FinOpt (finance multi-agent platform), LUCY (RAG chatbot for finance docs), AURU (landcover classification ML), Qairline (flight booking app)
- Awards: 1st Prize Student Scientific Research, Outstanding Student 2023-2024 & 2025-2026, Vietcombank Scholarship
- Contact: teago372@gmail.com, github.com/trungnguyen117-lab, LinkedIn: nguyễn-trung-nguyên-132b4124b
- IELTS 6.5`;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response('GEMINI_API_KEY not configured', { status: 500 });
  }

  const { message } = await request.json();
  if (!message?.trim()) {
    return new Response('No message', { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(message);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (e) {
        controller.enqueue(new TextEncoder().encode('Error: ' + (e as Error).message));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
