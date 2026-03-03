INSERT INTO roles (name) VALUES ('Patient'), ('Doctor'), ('Admin')
ON CONFLICT (name) DO NOTHING;

INSERT INTO departments (name, prompt_template)
VALUES
(
    'Psychiatry',
    'You are a helpful medical assistant for the Psychiatry department. You can provide general awareness, first aid guidance and home remedies. You must not provide prescriptions, diagnosis, or legal-medical advice. If symptoms are severe (self-harm thoughts, psychosis, severe panic), advise emergency support and booking consultation.'
),
(
    'Gynaecology',
    'You are a helpful medical assistant for the Gynaecology department. You can provide general awareness, first aid guidance and home remedies. You must not provide prescriptions or diagnosis. For severe pain, heavy bleeding, pregnancy complications, or urgent symptoms, advise immediate consultation.'
),
(
    'Orthopaedics',
    'You are a helpful medical assistant for the Orthopaedics department. You can provide general awareness, first aid guidance and home remedies. You must not provide prescriptions or diagnosis. For severe fractures, deformity, numbness, or intense pain, advise urgent consultation.'
)
ON CONFLICT (name) DO NOTHING;

WITH d AS (SELECT id, name FROM departments)
INSERT INTO doctors (name, specialization, department_id, years_of_experience, consultation_fee, available_time_slots)
VALUES
('Dr. Sam Michael', 'Psychiatrist', (SELECT id FROM d WHERE name='Psychiatry'), 11, 900.00, '{"days": ["Mon", "Wed", "Fri"], "slot_duration_minutes": 30}'::jsonb),
('Dr. Robin Ahmed', 'Psychiatrist', (SELECT id FROM d WHERE name='Psychiatry'), 8, 800.00, '{"days": ["Tue", "Thu"], "slot_duration_minutes": 30}'::jsonb),
('Dr. Tom Alter', 'Gynaecologist', (SELECT id FROM d WHERE name='Gynaecology'), 14, 1000.00, '{"days": ["Mon", "Tue", "Sat"], "slot_duration_minutes": 30}'::jsonb),
('Dr. Vikash Parekh', 'Gynaecologist', (SELECT id FROM d WHERE name='Gynaecology'), 10, 950.00, '{"days": ["Wed", "Fri"], "slot_duration_minutes": 30}'::jsonb),
('Dr. Ram Vilas', 'Orthopaedist', (SELECT id FROM d WHERE name='Orthopaedics'), 12, 850.00, '{"days": ["Mon", "Thu"], "slot_duration_minutes": 30}'::jsonb),
('Dr. Amar Govind', 'Orthopaedist', (SELECT id FROM d WHERE name='Orthopaedics'), 9, 800.00, '{"days": ["Tue", "Fri", "Sat"], "slot_duration_minutes": 30}'::jsonb)
ON CONFLICT DO NOTHING;

-- Sample availability slots for next working day at 09:00-11:30 UTC
INSERT INTO doctor_availability_slots (doctor_id, slot_time)
SELECT doc.id, gs.slot_time
FROM doctors doc
CROSS JOIN LATERAL (
    SELECT generate_series(
        date_trunc('day', NOW() + INTERVAL '1 day') + INTERVAL '9 hour',
        date_trunc('day', NOW() + INTERVAL '1 day') + INTERVAL '11 hour 30 minute',
        INTERVAL '30 minute'
    ) AS slot_time
) gs
ON CONFLICT (doctor_id, slot_time) DO NOTHING;
