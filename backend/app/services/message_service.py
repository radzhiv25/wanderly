from app.schemas.message import MessageRequest, MessageResponse


class MessageService:
    @staticmethod
    def build_response(payload: MessageRequest) -> MessageResponse:
        clean_name = payload.name.strip().title()
        clean_message = payload.message.strip()

        return MessageResponse(
            greeting=f"Hello, {clean_name}!",
            original_message=clean_message,
            message_length=len(clean_message),
        )
