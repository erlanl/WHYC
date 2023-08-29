from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import openai
import json

MODEL_GPT = 'gpt-4'
with open('backend/credentials.json', 'r') as f:
    credentials = json.load(f)

openai.api_key = credentials['openai_api_key']
openai.Model.list()

app = Flask(__name__)
app.json.sort_keys = False
CORS(app)


@app.route('/generate-image', methods=['POST'])
def generate_image():
    key_words = request.json

    dalle_prompt = gpt_call(key_words["key_words"])
    image_url = dalle_call(dalle_prompt)

    return make_response(
        jsonify(message='IMAGE URL:', data=image_url)
    )

def gpt_call(key_words):
    gpt_prompt = "Crie um DALLE prompt em inglês utilizando as seguintes palavras:"
    for i in key_words:
        gpt_prompt = gpt_prompt + " " + i
    print(f"GPT PROMPT -> {gpt_prompt}")
    
    gpt_response = openai.ChatCompletion.create(
        model = MODEL_GPT,
        messages = [
            #{"role": "system", "content": ""},
            {"role": "user", "content": gpt_prompt}
        ],
        temperature = 1,
    )
    dalle_prompt = gpt_response['choices'][0]['message']['content']
    print(f"DALLE PROMPT -> {dalle_prompt}")
    
    return dalle_prompt

def dalle_call(dalle_prompt):
    dalle_response = openai.Image.create(
        prompt = dalle_prompt,
        n = 1,
        size = "1024x1024"
    )
    image_url = dalle_response['data'][0]['url']
    print(f"IMAGE URL -> {image_url}")

    return image_url


@app.route('/generate-image/test-post', methods=['POST'])
def post_test():
    key_words = request.json

    return make_response(
        jsonify(message='LISTA DE KEYWORDS:', data=key_words)
    )


if __name__ == "__main__":
    app.run()