import pandas as pd
import json

file_path = 'database.xlsx.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    schema = {}
    for sheet_name in xl.sheet_names:
        df = xl.parse(sheet_name)
        schema[sheet_name] = {
            'rowCount': len(df),
            'columns': df.columns.astype(str).tolist()
        }

    with open('excel_schema.json', 'w', encoding='utf-8') as f:
        json.dump(schema, f, ensure_ascii=False, indent=2)
    print("Schema extraction successful.")
except Exception as e:
    print(f"Error: {e}")
