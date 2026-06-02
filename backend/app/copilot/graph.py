from langgraph.graph import StateGraph, END
from app.copilot.state import CopilotState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
import os

from dotenv import load_dotenv
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=gemini_api_key, temperature=0)

def create_copilot_graph():
    graph = StateGraph(CopilotState)
    
    def dax_specialist(state: CopilotState):
        messages = state["messages"]
        schema = state.get("dataset_schema", {})
        
        system_prompt = f"You are a Power BI DAX expert. Write an optimized DAX measure based on the user's request. Dataset Context: {schema}"
        
        # Invoke LLM
        response = llm.invoke([SystemMessage(content=system_prompt)] + messages)
        
        return {"messages": [response], "generated_artifacts": [{"type": "dax", "content": response.content}]}
        
    def visual_designer(state: CopilotState):
        return {"generated_artifacts": []}
        
    def intent_router(state: CopilotState):
        return {"current_context": "dax"}
        
    graph.add_node("intent_router", intent_router)
    graph.add_node("dax_specialist", dax_specialist)
    graph.add_node("visual_designer", visual_designer)
    
    graph.set_entry_point("intent_router")
    graph.add_edge("intent_router", "dax_specialist")
    graph.add_edge("dax_specialist", END)
    
    return graph.compile()

copilot_app = create_copilot_graph()
