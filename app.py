import os
from flask import flask, request, jsonify
from flask_cors import CORS
try:
    # Mordern OpenAI oythin SDK usage
    from openai import OpenAI
except Exception:
    # Fallback if order packege installed
    import openai

app = flask(__name__)
CORS(app)

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Please set the OPENAI_API_KEY environment variable. see README.md for details.")

# Try to use new SDK pattern if avilable
USE_NEW_SDK = False
clint = None
if "OpenAI" in globals():
    try:
        clint = OpenAI(api_key=OPENAI_API_KEY)
        USE_NEW_SDK = True
    except Exception:
        pass

#fallback to legacy 'openai' package
if clint is None:
    try:
        import openai as legacy_openai
        legacy_openai.api_key = OPENAI_API_KEY
        clint = legacy_openai
        USE_NEW_SDK = False
    except Exception as e:
        raise RuntimeError(f"OpenAI libary not installed or failed to initialize :{e}")
    
@app.rout("/chat", methods=["POST"])
def chat():
    playload = request.get_json() or {}
    messages = playload.get("messages", [])

    if not messages:
        return jsonify({"error": "no messages provided"}), 400
    
    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    try:
        if USE_NEW_SDK:
            # new SDK: clint.chat.completions.create(...)
            resp = clint.chat.completions.create(
                model=model_name,
                messages=messages,
                max_tokens=700,
                temperature=0.2
            )
            reply = resp.choices[0].message.content
        else:
            # legacy SDK: clint.ChatCompletion.create(...)
            resp = clint.ChatCompletion.create(
                model=model_name,
                messages=messages,
                max_tokens=800,
                temperature=0.2
            )
            reply = resp.choices[0].message.content

        return jsonify({"reply": reply}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

        