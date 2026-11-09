export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!token || !supabaseUrl || !publishableKey) {
    return res.status(401).json({ error: "تسجيل الدخول مطلوب." });
  }

  try {
    const verified = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${token}`
      }
    });
    if (!verified.ok) {
      return res.status(401).json({ error: "جلسة الدخول غير صالحة." });
    }
    const key = process.env.DIFY_API_KEY;
    const endpoint = process.env.DIFY_WORKFLOW_URL || "https://api.dify.ai/v1/workflows/run";
    if (!key) return res.status(503).json({ error: "مساعد AI غير مفعّل حاليًا." });

    const goal = String(req.body?.client_goal || "").trim().slice(0, 12000);
    if (!goal) return res.status(400).json({ error: "اكتب هدف العميل وبياناته." });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: { client_goal: goal },
        response_mode: "blocking",
        user: "coach-gado-os"
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || "Dify request failed" });
    return res.status(200).json({ answer: data.data?.outputs?.answer ?? data.outputs?.answer ?? "" });
  } catch {
    return res.status(502).json({ error: "تعذر الاتصال بخدمة التحليل." });
  }
}
