# 💊 CareAssist - Medication Reminder & Tracking System

CareAssist is a Spring Boot backend designed to help users manage medication schedules for themselves and their family members. It supports storing people, medications, dosage details, schedule times, and reminder logs so doses are less likely to be missed.

---

## 🚀 Key Features

- 👤 Manage multiple people such as self, child, mother, father, grandma, or grandpa
- 💊 Add and manage medications for each person
- ⏰ Store multiple medication times per day
- 🔔 Automated reminder generation using Spring Scheduler
- 📊 Track reminder status such as pending, sent, taken, or missed
- 🧾 RESTful API structure for easy frontend or mobile integration
- 🗃️ Relational database support with H2 for local development and PostgreSQL for production

---

## 🏗️ System Architecture

CareAssist follows a layered architecture:

`Controller -> Service -> Repository -> Database`

This keeps the application:

- Clean and easy to maintain
- Scalable as features grow
- Simple to test and extend

---

## 🧱 Tech Stack

- ☕ Java 21
- 🌱 Spring Boot
- 🗄️ Spring Data JPA
- 🐘 PostgreSQL
- 🧪 H2 for local development
- ⏰ Spring Scheduler
- 🧩 Lombok
- 📬 REST API with JSON

---

## 🗄️ Database Design

### Main Entities

- **AppUser**
  - id, name, email, password

- **Person**
  - id, name, relationshipType, user_id

- **Medication**
  - id, name, dosageAmount, dosageUnit, instructions, active, person_id

- **MedicationSchedule**
  - id, scheduledTime, active, medication_id

- **ReminderLog**
  - id, dueAt, status, sentAt, takenAt, note, medication_schedule_id

---

## 🔁 Entity Relationships

- A **User** can manage multiple **Persons**
- A **Person** can have multiple **Medications**
- A **Medication** can have multiple **Schedules**
- Each schedule can generate a **ReminderLog**

---

## ⏰ Reminder System

CareAssist uses Spring Scheduler to check due medication times every minute.

```java
@Scheduled(fixedRate = 60000)
public void generateReminderLogs() {
    reminderService.generateDueReminderLogs();
}
```

The reminder service checks schedules matching the current time and creates reminder entries automatically.

Future upgrades can include:

- 📧 Email notifications
- 📱 Push notifications with Firebase
- 📩 SMS reminders with Twilio

---

## 📡 API Endpoints

### 👤 Users

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/{userId}`

### 👤 Persons

- `POST /api/persons`
- `GET /api/persons`
- `GET /api/persons/{personId}`
- `GET /api/persons?userId={userId}`

### 💊 Medications

- `POST /api/medications`
- `GET /api/medications/{medicationId}`
- `GET /api/medications/person/{personId}`
- `GET /api/medications/{medicationId}/schedules`
- `POST /api/medications/{medicationId}/schedules`

### 🔔 Reminders

- `GET /api/reminders/today`
- `POST /api/reminders/{reminderId}/taken`

---

## 🧠 What I Learned

- REST API design
- Spring Boot layered architecture
- Scheduling background tasks
- Relational database modelling
- Real-world backend system design

---

## 📈 Future Improvements

- JWT authentication and role-based access
- React Native mobile app integration
- Cloud deployment on AWS, Render, or Railway
- Dashboard for medication adherence tracking
- Recurring schedules such as every 8 hours
- Smart reminder suggestions

---

## 🧑‍💻 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/careassist.git
```

### Configure database

The project currently uses `src/main/resources/application.properties`.

Local environment values are loaded from `backend/.env` when you run the app from the backend folder.
Use `backend/.env.example` as the template for your local file.

### Run the backend

```bash
mvn spring-boot:run
```

---

## 📌 Project Status

Backend core is in progress.

---

## 🏆 Why This Project Matters

This project demonstrates:

- Backend engineering skills
- API development
- Scheduling and automation
- Database design
- A practical health-tech use case
