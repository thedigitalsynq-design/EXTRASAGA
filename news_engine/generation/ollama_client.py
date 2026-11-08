"""
Local Ollama API client for zero-cost offline AI model inference.
Communicates with locally running Ollama instance via HTTP REST endpoints.
"""
import json
import logging
from typing import Dict, Any, Optional
import httpx
from news_engine.config.settings import get_settings

logger = logging.getLogger(__name__)


class OllamaClient:
    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.OLLAMA_MODEL
        self.timeout = float(settings.OLLAMA_TIMEOUT_SECONDS)

    async def is_available(self) -> bool:
        """Checks if the local Ollama daemon is reachable and responding."""
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.base_url}/api/version")
                return res.status_code == 200
        except Exception:
            return False

    async def list_models(self) -> list:
        """Returns list of downloaded local Ollama models."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    return [m.get("name") for m in data.get("models", [])]
        except Exception as e:
            logger.debug(f"Error fetching Ollama models: {e}")
        return []

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        json_format: bool = True,
        temperature: float = 0.2,
    ) -> Optional[str]:
        """
        Sends an inference request to local Ollama and returns the generated text.
        Uses low temperature (0.2) to strictly minimize hallucinations.
        """
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system_prompt or "",
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": 1500,
            },
        }
        if json_format:
            payload["format"] = "json"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload)
                if response.status_code != 200:
                    logger.error(f"Ollama returned HTTP {response.status_code}: {response.text}")
                    return None

                data = response.json()
                return data.get("response")
        except httpx.ConnectError:
            logger.warning(
                f"Cannot connect to Ollama at {self.base_url}. Ensure Ollama is running ('ollama serve')."
            )
            return None
        except Exception as e:
            logger.error(f"Ollama generation error: {e}")
            return None
