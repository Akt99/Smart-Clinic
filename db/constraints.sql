-- Critical concurrency constraints
CREATE UNIQUE INDEX IF NOT EXISTS uq_doctor_appointment_time_idx
ON appointments (doctor_id, appointment_time);

CREATE UNIQUE INDEX IF NOT EXISTS uq_same_user_same_slot_idx
ON appointments (patient_id, doctor_id, appointment_time);

-- Optional partial index for fast active schedule lookup
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_time_scheduled
ON appointments (doctor_id, appointment_time)
WHERE status = 'Scheduled';
