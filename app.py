import os
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    # Modern OpenAI Python SDK
    from openai import OpenAI
except Exception:
    # Fallback if only legacy package installed
    import openai

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Please set the OPENAI_API_KEY environment variable. See README.md for details.")

# Try to use new SDK pattern if available
USE_NEW_SDK = False
client = None
if "OpenAI" in globals():
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        USE_NEW_SDK = True
    except Exception:
        pass

# Fallback to legacy 'openai' package
if client is None:
    try:
        import openai as legacy_openai
        legacy_openai.api_key = OPENAI_API_KEY
        client = legacy_openai
        USE_NEW_SDK = False
    except Exception as e:
        raise RuntimeError(f"OpenAI library not installed or failed to initialize: {e}")
    

@app.route("/chat", methods=["POST"])
def chat():
    payload = request.get_json() or {}
    messages = payload.get("messages", [])

    if not messages:
        return jsonify({"error": "No messages provided"}), 400
    
    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    try:
        if USE_NEW_SDK:
            # new SDK: client.chat.completions.create(...)
            resp = client.chat.completions.create(
                model=model_name,
                messages=messages,
                max_tokens=700,
                temperature=0.2
            )
            reply = resp.choices[0].message.content
        else:
            # legacy SDK: client.ChatCompletion.create(...)
            resp = client.ChatCompletion.create(
                model=model_name,
                messages=messages,
                max_tokens=800,
                temperature=0.2
            )
            reply = resp.choices[0].message["content"]

        return jsonify({"reply": reply}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
