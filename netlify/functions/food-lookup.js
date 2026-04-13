exports.handler = async (event) => {
  const { query } = JSON.parse(event.body);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are a nutrition database. Return ONLY a valid JSON array — no markdown, no explanation, no backticks. Format: [{"name":"Food Name","calories":000,"protein":00,"carbs":00,"fat":00,"serving":"e.g. 1 cup (240g)"}]. Give 1-4 options with realistic nutrition estimates.`,
      messages: [{ role: 'user', content: `Nutrition for: "${query}"` }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || '[]';

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: text
  };
};
