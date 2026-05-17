import { Request, Response } from 'express';
import OpenAI from 'openai';
import { ChatRequest, ChatResponse, MenuItem } from './types';
import { menuData } from './menuData';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

function buildMenuContext(menu: MenuItem[]): string {
  return menu
    .map(
      (item) =>
        `- ID: "${item.id}" | Name: "${item.name}" | Category: ${item.category} | Price: $${item.price} | Tags: ${item.tags.join(', ')} | Spice: ${item.spiceLevel}/3 | Desc: ${item.description}`
    )
    .join('\n');
}

function buildSystemPrompt(menu: MenuItem[]): string {
  return `You are the AI ordering assistant for "The Intelligent Bistro", a premium upscale restaurant.

Your job is to help guests order from the menu through natural, warm conversation. You understand casual language like "I want two of the chicken things" or "add some starters for me".

FULL MENU:
${buildMenuContext(menu)}

CRITICAL RULES:
1. You MUST ALWAYS respond with ONLY valid JSON — never plain text, never markdown, never explanation outside JSON.
2. The JSON must exactly match this shape:
{
  "reply": "your warm, concise conversational response here",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "string", "quantity": number, "modifier": "optional string" },
    { "type": "REMOVE_ITEM", "itemId": "string" },
    { "type": "UPDATE_QUANTITY", "itemId": "string", "quantity": number },
    { "type": "CLEAR_CART" },
    { "type": "NONE" }
  ]
}
3. Match items by name loosely — "wagyu burger" matches "Wagyu Beef Burger", "chicken sandwich" matches "Nashville Hot Chicken Sandwich", "water" matches "Still or Sparkling Water", etc.
4. If the guest asks to see the cart or asks what's in their cart, reply with what you know from the cartState and return [{ "type": "NONE" }].
5. If the message is unrelated to food, ordering, or the restaurant, reply helpfully but return [{ "type": "NONE" }].
6. Keep replies warm, brief (1-2 sentences), and elegant — like a professional sommelier would speak.
7. Use exact item IDs from the menu above for all actions.
8. "actions" must always be an array, even for a single action or NONE.
9. If the guest says "place order", "confirm order", "go ahead", "that's all", "submit order" or similar — return [{ "type": "PLACE_ORDER" }]. This will save the order and clear the cart automatically.
10. You have access to the guest's order history this session (provided in each message). Use it to answer questions like "what did I order?", "how long ago?", "what's been placed?" etc.`;
}

export async function chatHandler(req: Request, res: Response): Promise<void> {
  const { message, cartState, menuContext, orderHistory } = req.body as ChatRequest;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const menu = menuContext?.length ? menuContext : menuData;

  // Summarise the current cart for the AI so it can reference it
  const cartSummary =
    cartState?.length
      ? cartState
          .map((c) => {
            const item = menu.find((m) => m.id === c.itemId);
            return item ? `${c.quantity}x ${item.name}` : `${c.quantity}x unknown(${c.itemId})`;
          })
          .join(', ')
      : 'empty';

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(menu) },
        {
          role: 'user',
          content: `Current cart: [${cartSummary}]\nOrder history this session:\n${orderHistory ?? 'None'}\n\nGuest message: "${message}"`,
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    let parsed: ChatResponse;

    try {
      parsed = JSON.parse(raw) as ChatResponse;
    } catch {
      // If GPT somehow returns malformed JSON, wrap it gracefully
      parsed = {
        reply: "I'm sorry, I had trouble understanding that. Could you rephrase?",
        actions: [{ type: 'NONE' }],
      };
    }

    // Ensure actions is always an array
    if (!Array.isArray(parsed.actions)) {
      parsed.actions = [{ type: 'NONE' }];
    }

    res.json(parsed);
  } catch (err) {
    const error = err as Error;
    console.error('[/api/chat] OpenAI error:', error.message);
    res.status(500).json({
      reply: "I'm having trouble connecting right now. Please try again in a moment.",
      actions: [{ type: 'NONE' }],
    });
  }
}
