from openai import OpenAI

client = OpenAI(
  api_key="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"
)

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  store=True,
  messages=[
    {"role": "user", "content": "write a haiku about ai"}
  ]
)

print(completion.choices[0].message);
