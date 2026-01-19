
const AGENT_PERSONAS = {
    'debugger': {
        name: 'Debugger',
        role: 'Bug Hunter',
        style: 'Technical, precise, and analytical. Focuses on finding errors, explaining root causes, and providing fixed code snippets.',
        greeting: 'I am ready to analyze your code. Paste a snippet or upload a file, and I will identify the issues.'
    },
    'optimizer': {
        name: 'Optimizer',
        role: 'Performance Specialist',
        style: 'Efficiency-focused. Looks for O(n) improvements, memory leaks, and readable refactors.',
        greeting: 'Let\'s make your code faster and cleaner. Show me what you have.'
    },
    'evaluator': {
        name: 'Evaluator',
        role: 'Code Reviewer',
        style: 'Constructive and comprehensive. specific. Evaluates best practices, security, and maintainability.',
        greeting: 'I will review your implementation against industry standards. Please provide context.'
    }
};

function detectLanguage(code) {
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('console.log')) return 'javascript';
    return 'javascript'; // default
}

function generateDebuggerResponse(input) {
    const lang = detectLanguage(input);
    const isPython = lang === 'python';

    let fixedCode = "";

    if (isPython) {
        fixedCode = input
            .replace(/:\s*$/, ':\n    # Added missing indentation pass') // Mock formatting
            .replace(/print\s+(?![\("'])/, 'print(') // Mock fixing print 2 -> print(2)
            + "\n    # Logic verified";

        // If input looks okay, just echo it with a comment
        if (fixedCode === input + "\n    # Logic verified") {
            fixedCode = input + "\n\n# Fixed: Added type hinting for clarity\ndef corrected_function(a: int, b: int) -> int:\n    return a + b";
        }
    } else {
        fixedCode = input.replace(/var /g, 'let '); // Modernize JS
        if (fixedCode === input) {
            fixedCode = input + "\n\n// Fixed: Added error handling\ntry {\n    " + input + "\n} catch (e) {\n    console.error(e);\n}";
        }
    }

    return `### 🐞 Debug Report

I have analyzed your **${lang}** code.

**Issue Detected:** Potential syntax ambiguity or lack of robustness.

**Corrected Code:**
\`\`\`${lang}
${fixedCode}
\`\`\`

I have refined the code to adhere to best practices.`;
}

function generateOptimizerResponse(input) {
    const lang = detectLanguage(input);

    return `### ⚡ Optimization Result

I have refactored your **${lang}** code for efficiency.

**Changes:**
- Removed redundant operations.
- Improved variable naming.

**Simplified Code:**
\`\`\`${lang}
// Optimized Version
${input.split('\n').filter(l => l.trim().length > 0).join('\n')}
// (Refactored for clarity)
\`\`\`

The complexity has been reduced.`;
}

function generateEvaluatorResponse(input) {
    return `### 📊 Code Evaluation

Analysis of your provided code:

**1. Code Quality**
- **Input:** \`${input.substring(0, 50)}${input.length > 50 ? '...' : ''}\`
- **Rating:** 8.5/10
- The logic is generally sound, but can be tightened.

**2. Performance**
- No major bottlenecks detected in this specific snippet.
- **Suggestion:** Ensure efficient memory usage for large datasets.

**3. Maintainability**
- Good naming conventions.
- **Recommendation:** Add comments for complex logic blocks.

**Summary:**
Solid implementation. The suggested improvements are minor but will help in the long run.`;
}

function generateSimulatedResponse(mode, input, files) {
    if (files && files.length > 0) {
        // Since we are client side, 'files' object structure might differ depending on how the component sends it.
        // Assuming file objects directly from input.
        const fileNames = Array.from(files).map(f => f.name).join(", ");
        return `I received ${files.length} file(s): **${fileNames}**. \n\nI am analyzing the contents...`;
    }

    const lowerInput = input.toLowerCase();

    // Mode-specific logic
    switch (mode) {
        case 'debugger':
            return generateDebuggerResponse(input);
        case 'optimizer':
            return generateOptimizerResponse(input);
        case 'evaluator':
            return generateEvaluatorResponse(input);
        default:
            return "I am not sure how to handle this request.";
    }
}


export const streamChatResponse = async (mode, messages, files = [], onChunk, onComplete, onError) => {
    try {
        // 1. Validation
        if (!AGENT_PERSONAS[mode]) {
            throw new Error("Invalid agent mode");
        }

        const lastUserMessage = messages[messages.length - 1]?.content || "";

        // 3. Generate Response (Simulation)
        let fullResponse = generateSimulatedResponse(mode, lastUserMessage, files);

        // Streaming Loop Simulation
        const chunks = fullResponse.split(' '); // Split by words for "typing" effect

        for (const chunk of chunks) {
            onChunk(chunk + " ");
            // Random delay to simulate thinking/typing
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
        }

        if (onComplete) onComplete();

    } catch (error) {
        console.error("Chat Stream Error:", error);
        if (onError) onError(error);
    }
};
