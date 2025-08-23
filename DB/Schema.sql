USE bo0qdeicu7wycnbnek7j;


CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hashed password
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
);

CREATE TABLE vacancies (
    vacancy_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    salary DECIMAL(10,2),
    status ENUM('open','closed','paused') DEFAULT 'closed',
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30),
    date_of_birth DATE,
    occupation VARCHAR(100),
    summary TEXT,
    experience JSON,
    skills JSON,
    languages JSON,
    education JSON
);

CREATE TABLE applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','interview','offered','accepted','rejected') DEFAULT 'rejected',
    ai_reason TEXT,
    candidate_id INT,
    vacancy_id INT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE SET NULL,
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(vacancy_id) ON DELETE SET NULL,
    UNIQUE (candidate_id, vacancy_id)
);