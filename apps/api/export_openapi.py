import json
from main import app # Import your FastAPI instance

schema = app.openapi() 

with open("../../openapi.json", "w") as f:
    json.dump(schema, f, indent=2)