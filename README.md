FAILFORWARD
------------------------------------------------------------ 
LIVE APPLICATION 
------------------------------------------------------------
https://failforward.onrender.com/
------------------------------------------------------------
**PROJECT OVERVIEW**
------------------------------------------------------------
FailForward is a production-ready full-stack web
application built using JavaScript, Node.js, Express, and MongoDB.

It helps users capture small daily failures, analyze behavioral patterns,
track streaks, visualize activity through charts and heatmaps, and build
self-improvement habits using reflection and behavioral insights.

Instead of focusing only on success, this application encourages continuous
growth by tracking mistakes and learning from them in a practical,
data-driven way.

The project evolved from a simple JSON-based tracker into a fully
authenticated cloud-based productivity platform.

------------------------------------------------------------
**PROBLEM THIS PROJECT SOLVES**
------------------------------------------------------------
People often repeat the same small mistakes:

Missing deadlines

Procrastinating

Avoiding difficult tasks

Poor time management

Excessive phone usage

Inconsistent reflection habits

These micro-failures gradually reduce productivity and confidence,
yet they are rarely tracked systematically.

FailForward provides a structured system to:

Log failures with multiple tags

Discover behavior patterns

Track streak consistency

Visualize progress through charts and heatmaps

Build awareness through daily reflection

------------------------------------------------------------
**KEY FEATURES**
------------------------------------------------------------
Secure user authentication (Email + Google OAuth)

Add and store daily failures

Multiple tag system (instead of single category)

View complete failure timeline

Edit and delete failures

Behavioral analytics dashboard

Streak tracking system

90-day GitHub-style activity heatmap

AI-style behavior insights

Dark / Light mode toggle

Daily reminder notifications

Installable PWA (Progressive Web App)

Fully deployed cloud application

------------------------------------------------------------
**TECHNOLOGIES USED**
------------------------------------------------------------
-Frontend

-HTML

-CSS

-Vanilla JavaScript

-Chart.js

-Backend

-Node.js

-Express.js

-Database

-MongoDB Atlas

-Mongoose

-Authentication

-Passport.js

-Google OAuth 2.0

-JWT

-Deployment

-Render (Cloud Hosting)

-PWA

-Service Worker

Web App Manifest

------------------------------------------------------------
**PROJECT STRUCTURE**
------------------------------------------------------------
micro_failure_tracker_web/

|

|-- public/

| |-- index.html

| |-- login.html

| |-- style.css

| |-- app.js

| |-- manifest.json

| |-- service-worker.js

|

|-- models/

| |-- User.js

| |-- Failure.js

|

|-- server.js

|-- package.json

|-- README.md

------------------------------------------------------------
**HOW THE SYSTEM WORKS**
------------------------------------------------------------
-User logs in using email/password or Google OAuth.

-Frontend sends authenticated requests using JWT tokens.

-Backend APIs store data securely in MongoDB Atlas.

-Failures are saved with tags and timestamps.

-Dashboard generates statistics and charts.

-Heatmap visualizes 90-day activity intensity.

-Streak logic tracks daily consistency.

Insights summarize behavioral patterns.

------------------------------------------------------------
**INSTALLATION**
------------------------------------------------------------
Install Node.js from https://nodejs.org

Clone the repository

Open terminal inside the project folder

Install dependencies:

npm install

HOW TO RUN LOCALLY

Start the application using:

npm start

Then open in browser:

http://localhost:3000

------------------------------------------------------------
**DEPLOYMENT**
------------------------------------------------------------
This project is deployed using Render.

------------------------------------------------------------
**USE CASES**
------------------------------------------------------------
Students improving study habits

Professionals tracking productivity patterns

Habit building & self-discipline tracking

Behavioral analytics experimentation

Resume and portfolio showcase

Interview-ready full-stack project

------------------------------------------------------------
**FUTURE IMPROVEMENTS**
------------------------------------------------------------
Custom reminder scheduling

Advanced filtering & search

Weekly exportable PDF reports

AI-powered behavioral recommendations

Shared progress tracking

Admin analytics dashboard

------------------------------------------------------------
**CONCLUSION**
------------------------------------------------------------
FailForward is a production-level full-stack application that combines
software engineering with behavioral psychology.

It demonstrates secure authentication, cloud database integration,
data visualization, PWA implementation, and real-world deployment.

The project reflects strong full-stack development skills along with
a product-oriented mindset focused on practical user value.
------------------------------------------------------------
**AUTHOR**
------------------------------------------------------------
Aditya Seswani
