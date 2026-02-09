# Backend (FastAPI)

## 1. Create a virtual environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

## 3. Configure env vars

```bash
cp .env.example .env
```

## 4. Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 5. Verify endpoints

- Root: `http://localhost:8000/`
- Health: `http://localhost:8000/api/v1/health`
- Docs: `http://localhost:8000/docs`

Sample request:

```bash
curl -X POST "http://localhost:8000/api/v1/message" \
  -H "Content-Type: application/json" \
  -d '{"name":"radzhiv","message":"hello fastapi"}'
```

Expected response shape:

```json
{
  "greeting": "Hello, Radzhiv!",
  "original_message": "hello fastapi",
  "message_length": 13
}
```
