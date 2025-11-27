# Gemini AI Setup Guide

## ✅ What I've Done

1. **Installed Gemini SDK**: `@google/generative-ai` package
2. **Updated API Route**: Now supports both OpenAI and Gemini
3. **Added Provider Switching**: Uses `AI_PROVIDER` environment variable

## 🔑 Setup Steps

### Step 1: Get Your Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the API key

### Step 2: Update Your `.env.local`

Add these lines to your `.env.local` file:

```env
# AI Provider (use "gemini" or "openai")
AI_PROVIDER=gemini

# Google Gemini API Key
GOOGLE_GEMINI_API_KEY=your-gemini-key-here

# OpenAI API Key (only needed if AI_PROVIDER=openai)
OPENAI_API_KEY=sk-proj-your-key-here
```

### Step 3: Restart the Dev Server

1. **Stop the server**: Press `Ctrl + C` in terminal
2. **Start again**: Run `npm run dev`
3. The API will now use Gemini!

## 🎯 Model Used

- **Gemini**: `gemini-2.0-flash-exp` (Latest, fast, high quality, FREE tier available)
- **OpenAI**: `gpt-4o` (If you switch to OpenAI)

## 💡 Why Gemini?

- ✅ **Free tier available** (60 requests per minute)
- ✅ **Fast responses**
- ✅ **High quality output**
- ✅ **Good for prompt engineering**

## 🔄 Switching Between Providers

To switch between Gemini and OpenAI, just change `AI_PROVIDER` in `.env.local`:

```env
# Use Gemini (default)
AI_PROVIDER=gemini

# Or use OpenAI
AI_PROVIDER=openai
```

Then restart the dev server.

## 🧪 Testing

1. Add your Gemini API key to `.env.local`
2. Set `AI_PROVIDER=gemini`
3. Restart: `npm run dev`
4. Go to Email Tool → Enable AI mode
5. Fill form and click "Generate Prompt"
6. Should work now! ✅
