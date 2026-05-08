import os
from langchain_community.embeddings.ollama import OllamaEmbeddings

BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL_NAME = os.getenv("OLLAMA_MODEL", "llama3.2")


def get_embedding():
    return OllamaEmbeddings(model=MODEL_NAME, base_url=BASE_URL)

if __name__ == "__main__":
    llama = get_embedding()
    print(llama.embed_query("Hello world"))
