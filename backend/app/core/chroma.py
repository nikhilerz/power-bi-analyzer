import chromadb
import os
import json

CHROMA_DATA_PATH = os.path.join(os.getcwd(), "chroma_data")
client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

# We create a collection to store dataset schemas and their narratives
collection = client.get_or_create_collection(name="dataset_contexts")

def store_dataset_context(dataset_id: str, profile_data: dict, narrative: str):
    """
    Embeds the dataset metadata and narrative into ChromaDB for future RAG retrieval.
    """
    # Create a string representation of the schema
    schema_str = f"Dataset Narrative: {narrative}\nColumns:\n"
    for col in profile_data.get("columns", []):
        schema_str += f"- {col['name']} ({col['type']}): {col.get('description', '')}\n"
        
    collection.upsert(
        documents=[schema_str],
        metadatas=[{"dataset_id": dataset_id}],
        ids=[dataset_id]
    )

def retrieve_dataset_context(dataset_id: str) -> str:
    """
    Retrieves the dataset context from ChromaDB.
    """
    results = collection.get(
        ids=[dataset_id]
    )
    if results and results["documents"]:
        return results["documents"][0]
    return ""
