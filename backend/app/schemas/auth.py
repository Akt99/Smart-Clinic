from pydantic import BaseModel, Field


class SendOTPRequest(BaseModel):
    phone_number: str = Field(min_length=8, max_length=20)


class VerifyOTPRequest(BaseModel):
    phone_number: str = Field(min_length=8, max_length=20)
    otp: str = Field(min_length=4, max_length=6)
    full_name: str = Field(min_length=2, max_length=150)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
