import plotly.express as px
import json

def generate_recommendations(profile_data, df):
    numeric_cols = [c["name"] for c in profile_data["columns"] if "Measure" in c["category"]]
    categorical_cols = [c["name"] for c in profile_data["columns"] if "Dimension" in c["category"]]
    date_cols = [c["name"] for c in profile_data["columns"] if "Date" in c["category"]]
    
    kpis = []
    kpis.append({
        "name": "Total Records",
        "desc": "Total number of records in dataset",
        "visual": "Card",
        "formula": "Total_Records = COUNTROWS('Table')"
    })
    
    for col in numeric_cols[:3]:
        kpis.append({
            "name": f"Total {col}",
            "desc": f"Sum of all {col} values",
            "visual": "Card",
            "formula": f"Total_{col} = SUM('Table'[{col}])"
        })
        
    charts = []
    if date_cols and numeric_cols:
        x_col = date_cols[0]
        y_col = numeric_cols[0]
        try:
            # Aggregate to prevent sending millions of points
            df_plot = df.groupby(x_col)[y_col].sum().reset_index().head(500)
            fig = px.line(df_plot, x=x_col, y=y_col)
            fig.update_layout(margin=dict(l=20, r=20, t=20, b=20), autosize=True, height=250)
            charts.append({
                "title": f"{y_col} Over Time",
                "type": "Line chart",
                "desc": "Shows trend across time periods",
                "x": x_col,
                "y": y_col,
                "agg": "SUM",
                "plot_json": json.loads(fig.to_json())
            })
        except Exception as e:
            print("Chart 1 err:", e)

    if categorical_cols and numeric_cols:
        x_col = categorical_cols[0]
        y_col = numeric_cols[0]
        try:
            # Top 10 categories
            df_plot = df.groupby(x_col)[y_col].sum().reset_index().nlargest(10, y_col)
            fig = px.bar(df_plot, x=x_col, y=y_col, color=x_col)
            fig.update_layout(margin=dict(l=20, r=20, t=20, b=20), autosize=True, height=250, showlegend=False)
            charts.append({
                "title": f"Top 10 {x_col} by {y_col}",
                "type": "Bar chart",
                "desc": "Compare top values across categories",
                "x": x_col,
                "y": y_col,
                "agg": "SUM",
                "plot_json": json.loads(fig.to_json())
            })
        except Exception as e:
            print("Chart 2 err:", e)
            
    # Fallback chart if not enough columns detected
    if not charts and numeric_cols and len(numeric_cols) > 1:
        x_col = numeric_cols[0]
        y_col = numeric_cols[1]
        try:
            df_plot = df.head(500)
            fig = px.scatter(df_plot, x=x_col, y=y_col)
            fig.update_layout(margin=dict(l=20, r=20, t=20, b=20), autosize=True, height=250)
            charts.append({
                "title": f"{x_col} vs {y_col}",
                "type": "Scatter plot",
                "desc": "Correlation between two measures",
                "x": x_col,
                "y": y_col,
                "agg": "NONE",
                "plot_json": json.loads(fig.to_json())
            })
        except Exception as e:
             pass

    filters = []
    if date_cols:
        filters.append({"field": date_cols[0], "type": "Date Slicer", "style": "Between", "desc": "Allow date range selection"})
    if categorical_cols:
        filters.append({"field": categorical_cols[0], "type": "List Slicer", "style": "Dropdown", "desc": "Filter by category"})
        
    return {
        "kpis": kpis,
        "charts": charts,
        "layout": [
            { "section": "KPI Cards Section", "position": "Top (Full Width) - 15%", "desc": "Display critical KPIs", "visuals": ["Card", "KPI"] },
            { "section": "Trend Analysis", "position": "Middle Left (60% width)", "desc": "Primary time-based trend", "visuals": ["Line Chart"] }
        ],
        "filters": filters
    }
