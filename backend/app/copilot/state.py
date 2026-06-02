from typing import TypedDict, Annotated, List, Dict, Any, Optional
from langchain_core.messages import BaseMessage
import operator

class CopilotState(TypedDict):
    # The history of the conversation
    messages: Annotated[List[BaseMessage], operator.add]
    
    # Metadata about the uploaded dataset
    dataset_schema: Dict[str, Any]
    
    # The current focus/intent of the AI
    current_context: str
    
    # Artifacts generated (e.g., DAX formulas, Chart JSONs)
    generated_artifacts: Annotated[List[Dict[str, Any]], operator.add]
    
    # Optional flags for routing
    requires_review: bool
    review_feedback: Optional[str]
