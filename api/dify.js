export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.DIFY_API_KEY;
  const endpoint =
    process.env.DIFY_WORKFLOW_URL ||
    "https://api.dify.ai/v1/workflows/run";

  if (!key) {
    return res.status(500).json({ error: "DIFY_API_KEY missing" });
  }

  const goal = String(req.body?.client_goal || "").trim();
  if (!goal) {
    return res.status(400).json({ error: "اكتب هدف العميل وبياناته." });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: { client_goal: goal },
        response_mode: "blocking",
        user: "coach-gado-os"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Dify request failed"
      });
    }

    return res.status(200).json({
      answer: data.data?.outputs?.answer ??
              data.outputs?.answer ??
              ""
    });
  } catch {
    return res.status(502).json({
      error: "تعذر الاتصال بـ Dify"
    });
  }
}
