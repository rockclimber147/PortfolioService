import os
import json
from main import app # or wherever your FastAPI app is

# Get the directory where THIS script is located
current_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(current_dir, "openapi.json")

def export_openapi():
    # Generate the schema
    openapi_schema = app.openapi()
    
    # Write to apps/api/openapi.json
    with open(output_path, "w") as f:
        json.dump(openapi_schema, f, indent=2)
    print(f"✅ OpenAPI schema exported to {output_path}")

if __name__ == "__main__":
    export_openapi()