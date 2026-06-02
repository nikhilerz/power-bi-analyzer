def generate_data_narrative(profile_data: dict, score_data: dict) -> str:
    """
    Generates a natural language executive summary.
    """
    rows = profile_data["overview"].get("rows", 0)
    cols = profile_data["overview"].get("columns", 0)
    tier = score_data.get("tier", "Basic")
    
    narrative = f"This dataset contains {rows:,} records across {cols} attributes. "
    
    metrics = score_data.get("metrics", {})
    if metrics.get("dimension_richness", 0) > 3:
        narrative += "It features rich dimensional data, making it highly suitable for deep slice-and-dice analysis in Power BI. "
    
    narrative += f"Overall, this dataset supports an '{tier}' level dashboard configuration, allowing for dynamic cross-filtering and complex KPI tracking."
    
    return narrative
