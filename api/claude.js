// Serverless function (Vercel-style). Deploying this project to Vercel
// picks it up automatically as POST /api/claude.
//
// Set ANTHROPIC_API_KEY in your deployment's environment variables
// (Vercel dashboard -> Project -> Settings -> Environment Variables).
// The key never reaches the browser this way.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY não está configurada no ambiente do servidor.",
    });
  }

  const { system, userText } = req.body || {};
  if (!userText) {
    return res.status(400).json({ error: "userText é obrigatório." });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: userText }],
      }),
    });

    const data = await anthropicRes.json();
    return res.status(anthropicRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao chamar a API da Anthropic." });
  }
}
