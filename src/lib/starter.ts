import ideas from "@/data/projectIdeas.json";

type Idea = { title: string; description: string; stack: string };
const IDEAS = ideas as Record<string, Idea[]>;

/** The project a student picked, or the first idea for their branch. */
export function ideaFor(branch: string, picked?: string | null): Idea {
  const list = IDEAS[branch] ?? IDEAS["Other Engineering"];
  return list.find((i) => i.title === picked) ?? list[0];
}

const pyString = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

/**
 * A small, complete Gradio app for the student's chosen project.
 * It follows the workshop's own steps: read the key from a secret, call a model, wrap it in a chat interface.
 * The model id is a variable because free hosted models change; the workshop confirms the one to use.
 */
export function starterApp(rawName: string, branch: string, idea: Idea) {
  // letters, digits, apostrophe and hyphen only: this goes inside a Python docstring
  const firstName = rawName.replace(/[^\p{L}\p{N}'-]/gu, "").slice(0, 40) || "you";
  const title = pyString(idea.title);
  const about = pyString(idea.description);
  return `"""
${idea.title}
Starter for ${firstName} (${branch}) - Build Your First AI Project in 60 Minutes

Run it in Google Colab or a Hugging Face Space:
  1. Add your Hugging Face token as a secret named HF_TOKEN (never paste it into this file).
  2. pip install -r requirements.txt
  3. python app.py
"""
import os

import gradio as gr
from huggingface_hub import InferenceClient

# A free hosted chat model. If this one is unavailable, swap in the model named in the workshop.
MODEL_ID = os.environ.get("MODEL_ID", "HuggingFaceH4/zephyr-7b-beta")

# The key comes from a secret. Never write it in the code.
client = InferenceClient(token=os.environ.get("HF_TOKEN"))

# This is the part that makes the app yours. Change it, test it, change it again.
SYSTEM_PROMPT = (
    "You are an assistant called '${title}', built for ${pyString(branch)} engineering students. "
    "What you help with: ${about} "
    "Answer in clear, numbered steps. If you are not sure, say so instead of guessing."
)


def respond(message, history):
    """Send the conversation to the model and return its answer."""
    if not message or not message.strip():
        return "Type a question to get started."

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for turn in history:
        # Gradio passes earlier turns as {"role": ..., "content": ...} dictionaries.
        if isinstance(turn, dict) and turn.get("role") in ("user", "assistant"):
            messages.append({"role": turn["role"], "content": str(turn.get("content", ""))})
    messages.append({"role": "user", "content": message})

    try:
        reply = client.chat_completion(messages=messages, model=MODEL_ID, max_tokens=500, temperature=0.4)
        return reply.choices[0].message.content
    except Exception as error:  # show a helpful message instead of crashing the app
        return f"The model did not answer ({type(error).__name__}). Check your HF_TOKEN secret and the MODEL_ID."


demo = gr.ChatInterface(
    fn=respond,
    type="messages",
    title="${title}",
    description="${about}",
    examples=["Give me a quick example of what you can do."],
)

if __name__ == "__main__":
    demo.launch()
`;
}

export const STARTER_REQUIREMENTS = `gradio>=5.0
huggingface_hub>=0.25
`;

export function starterReadme(idea: Idea) {
  return `# ${idea.title}

${idea.description}

Built in the "Build Your First AI Project in 60 Minutes" workshop.

- **What it does:** ${idea.description}
- **Built with:** Gradio and a hosted language model
- **Try asking:** (add one good example question here)
`;
}
