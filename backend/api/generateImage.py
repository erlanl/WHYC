from flask import Flask, make_response, jsonify, request
from keyOpenAI import OPENAI_API_KEY, MODEL_GPT
import openai

openai.api_key = OPENAI_API_KEY
openai.Model.list()

app = Flask(__name__)
app.json.sort_keys = False


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

if __name__ == "__main__":
    app.run()