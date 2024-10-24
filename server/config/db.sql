-- Create the database
CREATE DATABASE cgpa_calculator;

-- Use the database
USE cgpa_calculator;

-- Create table Admin
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(10) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert values in Admin Table
INSERT INTO admins (admin_id, email, password)
VALUES ('123456', 'lathika@gmail.com', '$2b$04$gI2U9X3zTvyxhLVSFYpku.6l6v78tX.ZBTPcJ5yVr6r0XA.HfXXeW');


CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regulation VARCHAR(10) NOT NULL,
    department VARCHAR(10) NOT NULL,
    semester INT NOT NULL,
    total_subjects INT NOT NULL DEFAULT 0,
    total_credits INT NOT NULL DEFAULT 0,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL
);
ALTER TABLE subjects MODIFY credits DECIMAL(5, 2);

CREATE TABLE elective_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits DECIMAL(5, 2) NOT NULL
);


CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    register_no VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    class VARCHAR(50) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Ensure to hash passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE students MODIFY COLUMN year VARCHAR(20); 


CREATE TABLE student_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    subject_code VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    total_credits DECIMAL(5, 2) NOT NULL,        
    total_grade_points DECIMAL(7, 3) NOT NULL,  
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE cgpa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNIQUE, -- Make student_id unique
    cgpa DECIMAL(5, 3),
    FOREIGN KEY (student_id) REFERENCES students(id)
);


drop table cgpa;
























INSERT INTO students (name, roll_no, register_no, department, year, class, mobile_no, email, password)
VALUES
    ('Sivaramakrishnan D', 'R001', 'REG001', 'CSE', 4, 'A', '9876543210', 'siva@example.com', 'siva'),
    ('Anjali Sharma', 'R002', 'REG002', 'ECE', 3, 'B', '9876543211', 'anjali@example.com', 'siva'),
    ('Rahul Verma', 'R003', 'REG003', 'EEE', 2, 'A', '9876543212', 'rahul@example.com', 'siva'),
    ('Priya Gupta', 'R004', 'REG004', 'Mech', 1, 'C', '9876543213', 'priya@example.com', 'siva'),
    ('Kiran Rao', 'R005', 'REG005', 'Civil', 4, 'B', '9876543214', 'kiran@example.com', 'siva');


SELECT * FROM subjects WHERE regulation = '2021' AND department = 'CSE' AND semester = 1;
SELECT * FROM students;
drop table student_subjects;



truncate table elective_subjects;


INSERT INTO elective_subjects (subject_code, subject_name, credits) VALUES
('GE3751', 'Principles of Management', 3),
('GE3752', 'Total Quality Management', 3),
('GE3753', 'Engineering Economics and Financial Accounting', 3),
('GE3754', 'Human Resource Management', 3),
('GE3755', 'Knowledge Management', 3),
('GE3792', 'Industrial Management', 3),
('MX3081', 'Introduction to Women and Gender Studies', 0),
('MX3082', 'Elements of Literature', 0),
('MX3083', 'Film Appreciation', 0),
('MX3084', 'Disaster Risk Reduction and Management', 0),
('MX3085', 'Well Being with Traditional Practices - Yoga, Ayurveda and Siddha', 0),
('MX3086', 'History of Science and Technology in India', 0),
('MX3087', 'Political and Economic Thought for a Humane Society', 0),
('MX3088', 'State, Nation Building and Politics in India', 0),
('MX3089', 'Industrial Safety', 0),
('CCS346', 'Exploratory Data Analysis', 3),
('CCS360', 'Recommender Systems', 3),
('CCS355', 'Neural Networks and Deep Learning', 3),
('CCS369', 'Text and Speech Analysis', 3),
('CCW331', 'Business Analytics', 3),
('CCS349', 'Image and Video Analytics', 3),
('CCS338', 'Computer Vision', 3),
('CCS334', 'Big Data Analytics', 3),
('CCS375', 'Web Technologies', 3),
('CCS332', 'App Development', 3),
('CCS336', 'Cloud Services Management', 3),
('CCS370', 'UI and UX Design', 3),
('CCS366', 'Software Testing and Automation', 3),
('CCS374', 'Web Application Security', 3),
('CCS342', 'DevOps', 3),
('CCS358', 'Principles of Programming Languages', 3),
('CCS335', 'Cloud Computing', 3),
('CCS372', 'Virtualization', 3),
('CCS341', 'Data Warehousing', 3),
('CCS367', 'Storage Technologies', 3),
('CCS365', 'Software Defined Networks', 3),
('CCS368', 'Stream Processing', 3),
('CCS362', 'Security and Privacy in Cloud', 3),
('CCS344', 'Ethical Hacking', 3),
('CCS343', 'Digital and Mobile Forensics', 3),
('CCS363', 'Social Network Security', 3),
('CCS351', 'Modern Cryptography', 3),
('CB3591', 'Engineering Secure Software Systems', 3),
('CCS339', 'Cryptocurrency and Blockchain Technologies', 3),
('CCS354', 'Network Security', 3),
('CCS333', 'Augmented Reality/Virtual Reality', 3),
('CCS352', 'Multimedia and Animation', 3),
('CCS371', 'Video Creation and Editing', 3),
('CCW332', 'Digital Marketing', 3),
('CCS373', 'Visual Effects', 3),
('CCS347', 'Game Development', 3),
('CCS353', 'Multimedia Data Compression and Storage', 3),
('CCS361', 'Robotic Process Automation', 3),
('CCS340', 'Cyber Security', 3),
('CCS359', 'Quantum Computing', 3),
('CCS331', '3D Printing and Design', 3),
('CCS350', 'Knowledge Engineering', 3),
('CCS364', 'Soft Computing', 3),
('CCS357', 'Optimization Techniques', 3),
('CCS348', 'Game Theory', 3),
('CCS337', 'Cognitive Science', 3),
('CCS345', 'Ethics and AI', 3),
('OAS351', 'Space Science', 3),
('OIE351', 'Introduction to Industrial Engineering', 3),
('OBT351', 'Food, Nutrition and Health', 3),
('OCE351', 'Environmental and Social Impact Assessment', 3),
('OEE351', 'Renewable Energy System', 3),
('OEI351', 'Introduction to Industrial Instrumentation and Control', 3),
('OMA351', 'Graph Theory', 3),
('OIE352', 'Resource Management Techniques', 3),
('OMG351', 'Fintech Regulation', 3),
('OFD351', 'Holistic Nutrition', 3),
('AI3021', 'IT in Agricultural System', 3),
('OEI352', 'Introduction to Control Engineering', 3),
('OPY351', 'Pharmaceutical Nanotechnology', 3),
('OAE351', 'Aviation Management', 3),
('OHS351', 'English for Competitive Examinations', 3),
('OMG352', 'NGOs and Sustainable Development', 3),
('OMG353', 'Democracy and Good Governance', 3),
('CME365', 'Renewable Energy Technologies', 3),
('OME354', 'Applied Design Thinking', 3),
('MF3003', 'Reverse Engineering', 3),
('OPR351', 'Sustainable Manufacturing', 3),
('AU3791', 'Electric and Hybrid Vehicles', 3),
('OAS352', 'Space Engineering', 3),
('OIM351', 'Industrial Management', 3),
('OIE354', 'Quality Engineering', 3),
('OSF351', 'Fire Safety Engineering', 3),
('OML351', 'Introduction to Non-destructive Testing', 3),
('OMR351', 'Mechatronics', 3),
('ORA351', 'Foundation of Robotics', 3),
('OAE352', 'Fundamentals of Aeronautical Engineering', 3),
('OGI351', 'Remote Sensing Concepts', 3),
('OAI351', 'Urban Agriculture', 3),
('OEN351', 'Drinking Water Supply and Treatment', 3),
('OEE352', 'Electric Vehicle Technology', 3),
('OEI353', 'Introduction to PLC Programming', 3),
('OCH351', 'Nano Technology', 3),
('OCH352', 'Functional Materials', 3),
('OFD352', 'Traditional Indian Foods', 3),
('OFD353', 'Introduction to Food Processing', 3),
('OPY352', 'IPR for Pharma Industry', 3),
('OTT351', 'Basics of Textile Finishing', 3),
('OTT352', 'Industrial Engineering for Garment Industry', 3),
('OTT353', 'Basics of Textile Manufacture', 3),
('OPE351', 'Introduction to Petroleum Refining and Petrochemicals', 3),
('CPE334', 'Energy Conservation and Management', 3),
('OPT351', 'Basics of Plastics Processing', 3),
('OEC351', 'Signals and Systems', 3),
('OEC352', 'Fundamentals of Electronic Devices and Circuits', 3),
('CBM348', 'Foundation Skills in Integrated Product Development', 3),
('CBM333', 'Assistive Technology', 3),
('OMA352', 'Operations Research', 3),
('OMA353', 'Algebra and Number Theory', 3),
('OMA354', 'Linear Algebra', 3),
('OCE353', 'Lean Concepts, Tools and Practices', 3),
('OBT352', 'Basics of Microbial Technology', 3),
('OBT353', 'Basics of Biomolecules', 3),
('OBT354', 'Fundamentals of Cell and Molecular Biology', 3),
('OHS352', 'Project Report Writing', 3),
('OMA355', 'Advanced Numerical Methods', 3),
('OMA356', 'Random Processes', 3),
('OMA357', 'Queuing and Reliability Modelling', 3),
('OMG354', 'Production and Operations Management for Entrepreneurs', 3),
('OMG355', 'Multivariate Data Analysis', 3),
('OME352', 'Additive Manufacturing', 3),
('CME343', 'New Product Development', 3),
('OME355', 'Industrial Design & Rapid Prototyping Techniques', 3),
('MF3010', 'Micro and Precision Engineering', 3),
('OMF354', 'Cost Management of Engineering Projects', 3),
('AU3002', 'Batteries and Management System', 3),
('AU3008', 'Sensors and Actuators', 3),
('AU3009', 'Advanced Manufacturing Processes', 3),
('OEI350', 'Deep Learning', 3),
('OA3024', 'Sustainable Building Materials', 3),
('OFD354', 'Nutraceuticals and Health Foods', 3),
('OHS353', 'Technical Communication Skills', 3);
