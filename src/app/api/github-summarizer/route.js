import { NextResponse } from 'next/server';
import { z } from "zod";
import { analyzeReadme } from './chain';

// Define nested schemas for better structure
const RepositoryInfoSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  owner: z.string().min(1, "Owner name is required"),
  repo: z.string().min(1, "Repository name is required"),
  readmeUrl: z.string().url("Must be a valid README URL")
});

const AnalysisSchema = z.object({
  summary: z.string()
    .min(10, "Summary must be at least 10 characters")
    .max(500, "Summary must not exceed 500 characters"),
  cool_facts: z.array(z.string())
    .length(3, "Must have exactly 3 cool facts")
    .refine(
      (facts) => facts.every(fact => fact.length >= 10),
      "Each cool fact must be at least 10 characters"
    )
});

const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    repository: RepositoryInfoSchema,
    analysis: AnalysisSchema,
    timestamp: z.string().datetime()
  })
});

export async function POST(request) {
  try {
    const { githubUrl } = await request.json();

    // Basic validation for GitHub URL
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid GitHub URL'
      });
    }

    // Parse GitHub URL to get owner and repo
    const urlParts = githubUrl.split('github.com/')[1].split('/');
    const owner = urlParts[0];
    const repo = urlParts[1]?.split('#')[0]?.split('?')[0];

    if (!owner || !repo) {
      return NextResponse.json({
        success: false,
        message: 'Invalid GitHub repository URL format'
      });
    }

    // Fetch README content from GitHub API
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'KeySphere-App'
        }
      }
    );

    if (!readmeResponse.ok) {
      return NextResponse.json({ 
        success: false,
        message: 'Failed to fetch README from GitHub',
        error: await readmeResponse.text()
      });
    }

    const readmeData = await readmeResponse.json();
    const readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');

    // Analyze README using LangChain
    const { summary, cool_facts } = await analyzeReadme(readmeContent);

    // Prepare the response data
    const responseData = {
      success: true,
      data: {
        repository: {
          url: githubUrl,
          owner,
          repo,
          readmeUrl: readmeData.html_url
        },
        analysis: {
          summary,
          cool_facts
        },
        timestamp: new Date().toISOString()
      }
    };

    // Validate the complete response
    try {
      const validatedResponse = ApiResponseSchema.parse(responseData);
      return NextResponse.json(validatedResponse);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ 
        success: false,
        message: 'Failed to generate valid response',
        errors: validationError.errors
      });
    }

  } catch (error) {
    console.error('GitHub summarizer error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing GitHub repository',
      error: error.message
    }, { status: 500 });
  }
}
