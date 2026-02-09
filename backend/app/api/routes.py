from fastapi import APIRouter

from app.schemas.message import MessageRequest, MessageResponse
from app.services.message_service import MessageService

router = APIRouter(prefix="/api/v1", tags=["api"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/message", response_model=MessageResponse)
def process_message(payload: MessageRequest) -> MessageResponse:
    return MessageService.build_response(payload)
