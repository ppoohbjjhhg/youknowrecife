// Serverless function (Vercel-style). Deploying this project to Vercel
// picks it up automatically as POST /api/claude.
//
// Usa a API gratuita do Google Gemini. Configure GEMINI_API_KEY nas
// variáveis de ambiente do projeto na Vercel.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY não está configurada no ambiente do servidor.",
    });
  }

  const { system, userText } = req.body || {};
  if (!userText) {
    return res.status(400).json({ error: "userText é obrigatório." });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: userText }] }],
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: data.error?.message || "Erro na API do Gemini.",
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao chamar a API do Gemini." });
  }
}
