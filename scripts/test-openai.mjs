import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const res = await openai.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-6-luna',
    input: 'Say hello in one word.',
});

console.log(res.output_text);
