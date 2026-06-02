from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.copilot.graph import copilot_app
from app.core.chroma import retrieve_dataset_context
from langchain_core.messages import HumanMessage

router = APIRouter()

@router.websocket("/session-{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    # Retrieve dataset context from ChromaDB
    context = retrieve_dataset_context(session_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Formulate the state for LangGraph
            state = {
                "messages": [HumanMessage(content=data)],
                "dataset_schema": {"chroma_context": context},
            }
            
            try:
                # Invoke LangGraph AI agent
                result = await copilot_app.ainvoke(state)
                ai_response = result["messages"][-1].content
            except Exception as e:
                # Fallback if OPENAI_API_KEY is missing
                ai_response = f"I am connected to the backend. Your request was: '{data}'. Note: OpenAI LLM is disabled because the API key is missing. Error: {str(e)}"
                
            await websocket.send_text(ai_response)
    except WebSocketDisconnect:
        pass
