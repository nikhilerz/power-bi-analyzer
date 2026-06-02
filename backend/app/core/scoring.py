def generate_dashboard_score(profile_data: dict) -> dict:
    """
    Heuristic engine to score dataset complexity and dashboard potential.
    """
    rows = profile_data["overview"].get("rows", 0)
    cols = profile_data["overview"].get("columns", 0)
    
    # Simple heuristics
    base_score = 50
    if rows > 10000:
        base_score += 15
    elif rows > 1000:
        base_score += 10
        
    if cols > 15:
        base_score += 15
    elif cols > 5:
        base_score += 10
        
    num_categorical = len([c for c in profile_data.get("columns", []) if c["type"] == "categorical"])
    num_numeric = len([c for c in profile_data.get("columns", []) if c["type"] == "numeric"])
    
    if num_categorical >= 2 and num_numeric >= 2:
        base_score += 20 # High potential for cross-filtering
        
    final_score = min(base_score, 100)
    
    tier = "Basic"
    if final_score > 80:
        tier = "Advanced"
    elif final_score > 60:
        tier = "Intermediate"
        
    return {
        "score": final_score,
        "tier": tier,
        "metrics": {
            "dimension_richness": num_categorical,
            "measure_richness": num_numeric
        }
    }
