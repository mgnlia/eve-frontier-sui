FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy project files
COPY pyproject.toml .
COPY main.py .

# Install dependencies with uv
RUN uv pip install --system -r pyproject.toml 2>/dev/null || uv pip install --system fastapi uvicorn httpx pydantic python-dotenv

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
