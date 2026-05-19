-- Insert mock verification event logs for visual testing
-- This populates the verification_events table with realistic test data

INSERT INTO verification_events (
  user_id,
  document_type,
  metadata,
  received_at,
  created_at
) VALUES
-- Verified entries
(1, 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.98,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:15:30Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Rajesh Kumar',
    'user_email', 'rajesh.kumar@example.com'
  ),
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),

(2, 'PAN', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'PAN',
    'confidence', 0.95,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:45:15Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Priya Sharma',
    'user_email', 'priya.sharma@example.com'
  ),
  NOW() - INTERVAL '1.5 hours',
  NOW() - INTERVAL '1.5 hours'
),

(3, 'Passport', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Passport',
    'confidence', 0.99,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:20:45Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Ahmed Hassan',
    'user_email', 'ahmed.hassan@example.com'
  ),
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
),

(4, 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.96,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:05:20Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Meera Patel',
    'user_email', 'meera.patel@example.com'
  ),
  NOW() - INTERVAL '45 minutes',
  NOW() - INTERVAL '45 minutes'
),

(5, 'Driving License', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Driving License',
    'confidence', 0.94,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:30:00Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Vikram Singh',
    'user_email', 'vikram.singh@example.com'
  ),
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '30 minutes'
),

-- Flagged entries
(6, 'PAN', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'PAN',
    'confidence', 0.62,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T07:30:45Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'John Doe',
    'user_email', 'john.doe@example.com',
    'flag_reason', 'Low confidence score'
  ),
  NOW() - INTERVAL '3.5 hours',
  NOW() - INTERVAL '3.5 hours'
),

(7, 'Aadhaar', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'Aadhaar',
    'confidence', 0.58,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T06:15:20Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Sarah Johnson',
    'user_email', 'sarah.johnson@example.com',
    'flag_reason', 'Duplicate entry detected'
  ),
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '5 hours'
),

(8, 'Passport', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'Passport',
    'confidence', 0.71,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T05:45:30Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Michael Chen',
    'user_email', 'michael.chen@example.com',
    'flag_reason', 'Document image quality poor'
  ),
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
),

(9, 'PAN', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'PAN',
    'confidence', 0.68,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T04:20:15Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Lisa Anderson',
    'user_email', 'lisa.anderson@example.com',
    'flag_reason', 'Suspicious pattern detected'
  ),
  NOW() - INTERVAL '7.5 hours',
  NOW() - INTERVAL '7.5 hours'
),

-- Pending entries
(10, 'Aadhaar', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'Aadhaar',
    'confidence', 0.85,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T11:00:00Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Arjun Desai',
    'user_email', 'arjun.desai@example.com'
  ),
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '5 minutes'
),

(11, 'Driving License', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'Driving License',
    'confidence', 0.92,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:50:30Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Emma Wilson',
    'user_email', 'emma.wilson@example.com'
  ),
  NOW() - INTERVAL '10 minutes',
  NOW() - INTERVAL '10 minutes'
),

(12, 'PAN', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'PAN',
    'confidence', 0.88,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:40:45Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Sunil Verma',
    'user_email', 'sunil.verma@example.com'
  ),
  NOW() - INTERVAL '20 minutes',
  NOW() - INTERVAL '20 minutes'
),

(13, 'Passport', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'Passport',
    'confidence', 0.91,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:25:15Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Fatima Al-Rashid',
    'user_email', 'fatima.rashid@example.com'
  ),
  NOW() - INTERVAL '35 minutes',
  NOW() - INTERVAL '35 minutes'
),

-- More verified for good visual balance
(14, 'PAN', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'PAN',
    'confidence', 0.97,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:50:20Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Deepak Gupta',
    'user_email', 'deepak.gupta@example.com'
  ),
  NOW() - INTERVAL '50 minutes',
  NOW() - INTERVAL '50 minutes'
),

(15, 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.93,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:35:40Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Nisha Kapoor',
    'user_email', 'nisha.kapoor@example.com'
  ),
  NOW() - INTERVAL '1 hour 5 minutes',
  NOW() - INTERVAL '1 hour 5 minutes'
),

(16, 'Driving License', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Driving License',
    'confidence', 0.96,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:15:50Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Rohan Bhat',
    'user_email', 'rohan.bhat@example.com'
  ),
  NOW() - INTERVAL '1 hour 15 minutes',
  NOW() - INTERVAL '1 hour 15 minutes'
),

-- One more flagged for visual variety
(17, 'Driving License', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'Driving License',
    'confidence', 0.65,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:30:25Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Carlos Rodriguez',
    'user_email', 'carlos.rodriguez@example.com',
    'flag_reason', 'Expired document'
  ),
  NOW() - INTERVAL '2 hours 10 minutes',
  NOW() - INTERVAL '2 hours 10 minutes'
),

(18, 'Passport', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Passport',
    'confidence', 0.98,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:00:10Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Sophie Laurent',
    'user_email', 'sophie.laurent@example.com'
  ),
  NOW() - INTERVAL '2 hours 40 minutes',
  NOW() - INTERVAL '2 hours 40 minutes'
),

(19, 'PAN', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'PAN',
    'confidence', 0.89,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T11:10:00Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Aditya Puri',
    'user_email', 'aditya.puri@example.com'
  ),
  NOW() - INTERVAL '1 minute',
  NOW() - INTERVAL '1 minute'
),

(20, 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.99,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T07:45:35Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Divya Nair',
    'user_email', 'divya.nair@example.com'
  ),
  NOW() - INTERVAL '3 hours 15 minutes',
  NOW() - INTERVAL '3 hours 15 minutes'
);

-- Verify the data was inserted
SELECT COUNT(*) as total_logs,
       COUNT(CASE WHEN metadata->>'status' = 'verified' THEN 1 END) as verified,
       COUNT(CASE WHEN metadata->>'status' = 'flagged' THEN 1 END) as flagged,
       COUNT(CASE WHEN metadata->>'status' = 'pending' THEN 1 END) as pending
FROM verification_events; 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'PAN',
    'confidence', 0.95,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:45:15Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Priya Sharma',
    'user_email', 'priya.sharma@example.com'
  ),
  NOW() - INTERVAL '1.5 hours',
  NOW() - INTERVAL '1.5 hours'
),

('550e8400-e29b-41d4-a716-446655440003', 'Passport', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Passport',
    'confidence', 0.99,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:20:45Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Ahmed Hassan',
    'user_email', 'ahmed.hassan@example.com'
  ),
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
),

('550e8400-e29b-41d4-a716-446655440004', 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.96,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:05:20Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Meera Patel',
    'user_email', 'meera.patel@example.com'
  ),
  NOW() - INTERVAL '45 minutes',
  NOW() - INTERVAL '45 minutes'
),

('550e8400-e29b-41d4-a716-446655440005', 'Driving License', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Driving License',
    'confidence', 0.94,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:30:00Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Vikram Singh',
    'user_email', 'vikram.singh@example.com'
  ),
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '30 minutes'
),

-- Flagged entries
('550e8400-e29b-41d4-a716-446655440006', 'PAN', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'PAN',
    'confidence', 0.62,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T07:30:45Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'John Doe',
    'user_email', 'john.doe@example.com',
    'flag_reason', 'Low confidence score'
  ),
  NOW() - INTERVAL '3.5 hours',
  NOW() - INTERVAL '3.5 hours'
),

('550e8400-e29b-41d4-a716-446655440007', 'Aadhaar', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'Aadhaar',
    'confidence', 0.58,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T06:15:20Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Sarah Johnson',
    'user_email', 'sarah.johnson@example.com',
    'flag_reason', 'Duplicate entry detected'
  ),
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '5 hours'
),

('550e8400-e29b-41d4-a716-446655440008', 'Passport', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'Passport',
    'confidence', 0.71,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T05:45:30Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Michael Chen',
    'user_email', 'michael.chen@example.com',
    'flag_reason', 'Document image quality poor'
  ),
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
),

('550e8400-e29b-41d4-a716-446655440009', 'PAN', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'PAN',
    'confidence', 0.68,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T04:20:15Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Lisa Anderson',
    'user_email', 'lisa.anderson@example.com',
    'flag_reason', 'Suspicious pattern detected'
  ),
  NOW() - INTERVAL '7.5 hours',
  NOW() - INTERVAL '7.5 hours'
),

-- Pending entries
('550e8400-e29b-41d4-a716-446655440010', 'Aadhaar', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'Aadhaar',
    'confidence', 0.85,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T11:00:00Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Arjun Desai',
    'user_email', 'arjun.desai@example.com'
  ),
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '5 minutes'
),

('550e8400-e29b-41d4-a716-446655440011', 'Driving License', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'Driving License',
    'confidence', 0.92,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:50:30Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Emma Wilson',
    'user_email', 'emma.wilson@example.com'
  ),
  NOW() - INTERVAL '10 minutes',
  NOW() - INTERVAL '10 minutes'
),

('550e8400-e29b-41d4-a716-446655440012', 'PAN', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'PAN',
    'confidence', 0.88,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:40:45Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Sunil Verma',
    'user_email', 'sunil.verma@example.com'
  ),
  NOW() - INTERVAL '20 minutes',
  NOW() - INTERVAL '20 minutes'
),

('550e8400-e29b-41d4-a716-446655440013', 'Passport', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'Passport',
    'confidence', 0.91,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T10:25:15Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Fatima Al-Rashid',
    'user_email', 'fatima.rashid@example.com'
  ),
  NOW() - INTERVAL '35 minutes',
  NOW() - INTERVAL '35 minutes'
),

-- More verified for good visual balance
('550e8400-e29b-41d4-a716-446655440014', 'PAN', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'PAN',
    'confidence', 0.97,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:50:20Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Deepak Gupta',
    'user_email', 'deepak.gupta@example.com'
  ),
  NOW() - INTERVAL '50 minutes',
  NOW() - INTERVAL '50 minutes'
),

('550e8400-e29b-41d4-a716-446655440015', 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.93,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:35:40Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Nisha Kapoor',
    'user_email', 'nisha.kapoor@example.com'
  ),
  NOW() - INTERVAL '1 hour 5 minutes',
  NOW() - INTERVAL '1 hour 5 minutes'
),

('550e8400-e29b-41d4-a716-446655440016', 'Driving License', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Driving License',
    'confidence', 0.96,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T09:15:50Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Rohan Bhat',
    'user_email', 'rohan.bhat@example.com'
  ),
  NOW() - INTERVAL '1 hour 15 minutes',
  NOW() - INTERVAL '1 hour 15 minutes'
),

-- One more flagged for visual variety
('550e8400-e29b-41d4-a716-446655440017', 'Driving License', 
  jsonb_build_object(
    'status', 'flagged',
    'document_type', 'Driving License',
    'confidence', 0.65,
    'risk_score', 'High',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:30:25Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Carlos Rodriguez',
    'user_email', 'carlos.rodriguez@example.com',
    'flag_reason', 'Expired document'
  ),
  NOW() - INTERVAL '2 hours 10 minutes',
  NOW() - INTERVAL '2 hours 10 minutes'
),

('550e8400-e29b-41d4-a716-446655440018', 'Passport', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Passport',
    'confidence', 0.98,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T08:00:10Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Sophie Laurent',
    'user_email', 'sophie.laurent@example.com'
  ),
  NOW() - INTERVAL '2 hours 40 minutes',
  NOW() - INTERVAL '2 hours 40 minutes'
),

('550e8400-e29b-41d4-a716-446655440019', 'PAN', 
  jsonb_build_object(
    'status', 'pending',
    'document_type', 'PAN',
    'confidence', 0.89,
    'risk_score', 'Medium',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T11:10:00Z',
    'value_type', 'alphanumeric',
    'method', 'OCR',
    'user_name', 'Aditya Puri',
    'user_email', 'aditya.puri@example.com'
  ),
  NOW() - INTERVAL '1 minute',
  NOW() - INTERVAL '1 minute'
),

('550e8400-e29b-41d4-a716-446655440020', 'Aadhaar', 
  jsonb_build_object(
    'status', 'verified',
    'document_type', 'Aadhaar',
    'confidence', 0.99,
    'risk_score', 'Low',
    'scanner_version', '2.1.0',
    'scan_time', '2026-05-01T07:45:35Z',
    'value_type', 'numeric',
    'method', 'OCR',
    'user_name', 'Divya Nair',
    'user_email', 'divya.nair@example.com'
  ),
  NOW() - INTERVAL '3 hours 15 minutes',
  NOW() - INTERVAL '3 hours 15 minutes'
);

-- Verify the data was inserted
SELECT COUNT(*) as total_logs,
       COUNT(CASE WHEN metadata->>'status' = 'verified' THEN 1 END) as verified,
       COUNT(CASE WHEN metadata->>'status' = 'flagged' THEN 1 END) as flagged,
       COUNT(CASE WHEN metadata->>'status' = 'pending' THEN 1 END) as pending
FROM verification_events;
