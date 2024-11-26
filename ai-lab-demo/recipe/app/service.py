from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain_community.callbacks import StreamlitCallbackHandler
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferWindowMemory
from flask import Flask, request
import requests
import time
import json
import os 
import json

model_service = os.getenv("MODEL_ENDPOINT",
                          "http://localhost:8001")
model_service = f"{model_service}/v1"

def checking_model_service():
    start = time.time()
    print("Checking Model Service Availability...")
    print(f"{model_service}/models")
    print(f"{model_service[:-2]}api/tags")
    ready = False
    while not ready:
        try:
            request_cpp = requests.get(f'{model_service}/models')
            request_ollama = requests.get(f'{model_service[:-2]}api/tags')
            if request_cpp.status_code == 200:
                server = "Llamacpp_Python"
                ready = True
            elif request_ollama.status_code == 200:
                server = "Ollama"
                ready = True        
        except:
            pass
        time.sleep(1)
    print(f"{server} Model Service Available")
    print(f"{time.time()-start} seconds")
    return server 

def get_models():
    try:
        response = requests.get(f"{model_service[:-2]}api/tags")
        return [i["name"].split(":")[0] for i in  
            json.loads(response.content)["models"]]
    except:
        return None

server = checking_model_service()

def memory():
    memory = ConversationBufferWindowMemory(return_messages=True,k=3)
    return memory

model_name = os.getenv("MODEL_NAME", "") 

if server == "Ollama":
    models = get_models()

llm = ChatOpenAI(base_url=model_service, 
        api_key="sk-no-key-required",
        model=model_name,
        streaming=True,)

prompt = ChatPromptTemplate.from_messages([
    ("system", """
        reply in JSON format with an array of objects with 2 fields name and url
        (and with no more text than the JSON output),
        with a list of pages in the website https://www.podman-desktop.io related to my query
    """),
    MessagesPlaceholder(variable_name="history"),
    ("user", "{input}")
])

chain = LLMChain(llm=llm, 
                prompt=prompt,
                verbose=False,
                memory=memory())


app = Flask(__name__)

@app.route('/')
def index():
    return 'ok'

@app.route('/query')
def query():
    q = request.args.get('q')
    response = chain.invoke(q)
    print(response['text'])
    cleanResponse = clean(response['text'])
    print(cleanResponse)
    jsonResponse = json.loads(cleanResponse)
    return {"request": q, "response": jsonResponse}

def clean(input):
    # keep text between first [ and last ]
    right = input[input.find('['):]
    return right[:1+right.rfind(']')]


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
