from app.schemas.common import TimestampedSchema


class DepartmentResponse(TimestampedSchema):
    name: str
    prompt_template: str
