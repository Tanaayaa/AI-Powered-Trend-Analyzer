import os
from pathlib import Path
from langchain_community.vectorstores import Chroma
from langchain_community.llms.ollama import Ollama
from ollama_embedding import get_embedding
from database import build_database

BASE_DIR = Path(__file__).resolve().parent
CHROMA_PATH = BASE_DIR / "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


def ensure_chroma_data():
    if not CHROMA_PATH.exists() or not any(CHROMA_PATH.iterdir()):
        build_database()


def query_rag(query_text: str):
    ensure_chroma_data()

    embedding_function = get_embedding()
    db = Chroma(persist_directory=str(CHROMA_PATH), embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=5)
    if not results:
        return {"response": "No relevant documents found.", "sources": []}

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt = PROMPT_TEMPLATE.format(context=context_text, question=query_text)

    model_name = os.getenv("OLLAMA_MODEL", "llama3.2:latest")
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model = Ollama(model=model_name, base_url=base_url)
    response_text = model.invoke(prompt)

    sources = [doc.metadata.get("id") for doc, _score in results]

    return {
        "response": response_text,
        "sources": sources,
    }


if __name__ == "__main__":
    query_text = os.environ.get("QUERY_TEXT", "Hello")
    print(query_rag(query_text))
