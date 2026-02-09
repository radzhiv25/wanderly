from pydantic import BaseModel, Field


class MessageRequest(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    message: str = Field(min_length=1, max_length=500)


class MessageResponse(BaseModel):
    greeting: str
    original_message: str
    message_length: int
