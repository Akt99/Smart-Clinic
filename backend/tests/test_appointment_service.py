from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.services.appointment_service import AppointmentService


class FakeScalar:
    def __init__(self, value):
        self.value = value

    def scalar_one_or_none(self):
        return self.value


class FakeBegin:
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False


@pytest.mark.asyncio
async def test_rejects_non_30_minute_boundary():
    db = SimpleNamespace(execute=AsyncMock(), begin=lambda: FakeBegin())
    service = AppointmentService(db)

    with pytest.raises(ValueError, match="30-minute"):
        await service.create_appointment(
            patient_id="user-1",
            doctor_id="doc-1",
            appointment_time=datetime(2026, 3, 10, 10, 15, tzinfo=timezone.utc),
        )


@pytest.mark.asyncio
async def test_conflict_prevention_when_slot_already_booked():
    db = SimpleNamespace(execute=AsyncMock(return_value=FakeScalar(object())), begin=lambda: FakeBegin(), flush=AsyncMock())
    service = AppointmentService(db)
    service.repo.get_for_update = AsyncMock(return_value=object())

    with pytest.raises(ValueError, match="already booked"):
        await service.create_appointment(
            patient_id="user-1",
            doctor_id="doc-1",
            appointment_time=datetime(2026, 3, 10, 10, 0, tzinfo=timezone.utc),
        )


@pytest.mark.asyncio
async def test_prevents_same_user_same_slot_duplicate():
    # 1st execute -> availability exists, 2nd execute -> duplicate exists.
    db = SimpleNamespace(
        execute=AsyncMock(side_effect=[FakeScalar(object()), FakeScalar(object())]),
        begin=lambda: FakeBegin(),
        flush=AsyncMock(),
    )
    service = AppointmentService(db)
    service.repo.get_for_update = AsyncMock(return_value=None)

    with pytest.raises(ValueError, match="already booked"):
        await service.create_appointment(
            patient_id="user-1",
            doctor_id="doc-1",
            appointment_time=datetime(2026, 3, 10, 10, 30, tzinfo=timezone.utc),
        )
