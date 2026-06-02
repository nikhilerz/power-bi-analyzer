import pandas as pd
import os

def profile_dataset(file_path: str):
    if file_path.endswith('.csv'):
        try:
            df = pd.read_csv(file_path)
        except UnicodeDecodeError:
            df = pd.read_csv(file_path, encoding='latin1')
    else:
        df = pd.read_excel(file_path)
        
    memory_usage = df.memory_usage(deep=True).sum() / (1024 * 1024)
    
    columns_info = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        unique_count = df[col].nunique()
        null_count = df[col].isnull().sum()
        null_pct = (null_count / len(df)) * 100
        
        if 'datetime' in dtype or 'date' in col.lower():
            category = 'Date (Time Intelligence)'
        elif 'int' in dtype or 'float' in dtype:
            category = 'Measure (Numeric)'
        else:
            category = 'Dimension (Categorical)'
            
        sample = df[col].dropna().head(3).astype(str).tolist()
        
        columns_info.append({
            "name": col,
            "type": dtype,
            "category": category,
            "unique": int(unique_count),
            "nulls": f"{null_count} ({null_pct:.2f}%)",
            "sample": ", ".join(sample)
        })
        
    profile_data = {
        "overview": {
            "rows": len(df),
            "columns": len(df.columns),
            "memory": f"{memory_usage:.2f} MB"
        },
        "columns": columns_info
    }
    
    return profile_data, df
