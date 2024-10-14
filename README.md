# e-Appointment Frontend

![Alt text](/screenshots/12-e-appointment.png)

## Project Goal and Scope

* This project is an e-appointment system developed for a sample hospital. 
* By logging into the system, users can make an appointment for the department and doctor they want on the appropriate day and time.
* In addition, operations such as appointment status management, past appointment tracking, and user management can be performed through the system.

* You can try the live version of the project at the following address:
* Link: https://www.e.appointment.erengaygusuz.com.tr
  
* You can access the system with the sample user information below and experience the system with different roles.
  
    * Super Admin 
        * Username: ``` superadmin ```
        * Password: ``` 12345 ```

    * Admin 
        * Username: ``` admin ```
        * Password: ``` 12345 ```

    * Doctor 
        * Username: ``` doctor ```
        * Password: ``` 12345 ```

    * Patient 
        * Username: ``` patient ```
        * Password: ``` 12345 ```

## User Types of the Project and the Transactions They Can Perform

* There are 4 user types available in this application. These are:

  - Super Admin
  - Admin
  - Doctor
  - Patient

* You can see the transaction table of user types in the system at below.

|                                                 |Super Admin|Admin|Doctor|Patient|
|-------------------------------------------------|:---------:|:---:|:----:|:-----:|
|Log in to the system                             |     x     |  x  |  x   |   x   |
|Log out of the system                            |     x     |  x  |  x   |   x   |
|View their profile                               |     x     |  x  |  x   |   x   |
|Update their profile                             |           |  x  |  x   |   x   |
|Change the system’s theme color                  |     x     |  x  |  x   |   x   |
|Change the system’s language                     |     x     |  x  |  x   |   x   |
|View weekly appointments by department and doctor|           |     |      |   x   |
|Book appointments by department and doctor       |           |     |      |   x   |
|Cancel a booked appointment                      |           |     |      |   x   |
|List their appointments                          |           |     |  x   |   x   |
|Filter appointments                              |           |     |  x   |   x   |
|Search in the appointment list                   |           |     |  x   |   x   |
|Export the appointment list in different formats |           |     |  x   |   x   |
|Update the status of appointments                |     x     |     |  x   |       |
|List users with the admin role                   |     x     |     |      |       |
|Edit users with the admin role                   |     x     |     |      |       |
|Delete users with the admin role                 |     x     |     |      |       |
|List users with the doctor role                  |     x     |  x  |      |       |
|Edit users with the doctor role                  |     x     |  x  |      |       |
|Delete users with the doctor role                |     x     |  x  |      |       |
|List users with the patient role                 |     x     |  x  |      |       |
|Edit users with the patient role                 |     x     |  x  |      |       |
|Delete users with the patient role               |     x     |  x  |      |       |
|Filter listed users                              |     x     |  x  |      |       |
|Search in the user list                          |     x     |  x  |      |       |
|Export the user list in different formats        |     x     |  x  |      |       |
|View the system’s audit logs                     |     x     |     |      |       |
|View the system’s statistical graphs             |     x     |     |      |       |

## General Technical Features of the Project

* Layered Architecture in Backend with ASP.NET Core 8 WEB API
* Command Query Responsibility Segregation (CQRS) Pattern With MediatR
* Generic Repository and Unit of Work Pattern
* MS SQL Server Database
* Using Entity Framework Core 8 ORM
* Database Migrations with Code First Approach
* Advanced Role and Permission Based Authentication and Authorization with JWT
* JSON Based Multi-Language Support in Frontend with Ngx-Translate
* JSON Based Multi-Language Support in Backend
* Database Based Multi-Language Support for Some Project Components (Menu Items, Departments)
* Object to Object Mapping in Frontend with Dynamic Mapper
* Object to Object Mapping in Backend with Auto Mapper 
* Using Records as DTOs in data transfer in Backend
* Using PrimeNG as UI Library in Frontend
* Component Based Architecture in Frontend
* Some Custom Components like Advanced Table, Simple Table
* Logging Database Transactions with Audit Log
* Error Management with Global Error Handler in Frontend
* Error Management with Error Handler Middleware in Backend
* Request and Response Encryption Decryption with Encryption Decryption Middleware
* Logging API Operations with Serilog and Visualization with Seq
* Server Side Pagination, Searching and Filtering with PrimeNG Tables
* Multi-Format (PDF, XML, JSON, XLSX, CSV) Data Export for Tables
* Server Side Validation with Fluent Validation
* Client Side Validation with Fluent Validation TS
* Using Interceptors for Authorization, Encryption-Decryption and Spinner in Frontend
* Using Environments in Frontend for Deployment
* Using Environments in Backend with DotNetEnv for Deployment
* Docker and Docker Compose Support
* Using Eslint in Frontend for Code Consistency
* Response Compression in Backend
* <strike>Fake Data Generation with Bogus
* Using Indexes in Some Database Table Columns for Query Performance
* Health Check in Backend
* Response Caching with Redis in Backend
* Rate Limiting in Backend
* API Versioning in Backend
* State Management with NgRx in Frontend
* Theme Settings for Users in Frontend
* Using Nginx for Http Server
* Using SignalR for Real Time Data Communication
* Using Hangfire and Quartz Jobs for Timed E-Mail Sending
* Logging Frontend Errors with Serilog
* Unit Tests in Backend
* Using Charts in Frontend for Statistics
* Multi-Format Data Import in Frontend
* Viewing Appointments in PDF format with Ngx-Extented-Viewer
* Notifications with Rabbit MQ in Backend</strike>

## Frontend Layer Folder Structure

* There are lots of important folders and files in this layer. These are:

  - node_modules
  - src
    - app
        - components
            - advanced-table
            - edit-table
            - page-header
            - simple-table
        - enums
        - guards
        - handlers
        - interceptors
        - mapping
        - models
        - pages
        - pipes
        - services
        - template
        - validators
        - app.component.html
        - app.component.ts
        - app.config.ts
        - app.routes.ts
    - assets
    - environments
    - index.html
    - main.ts
    - styles.css
  - .eslintrc.json
  - .prettierrc.json
  - angular.json
  - package.json

## Tools and Technologies Used in the Frontend

The list of all packages and tools used in the frontend is provided below, along with their version.

* General Technologies
  
  - Angular 17
  - PrimeNG
  - TypeScript

* Npm Packages
  - angular/animations: 17.3.0,
  - angular/common: 17.3.0,
  - angular/compiler: 17.3.0,
  - angular/core: 17.3.0",
  - angular/forms: 17.3.0,
  - angular/platform-browser: 17.3.0,
  - angular/platform-browser-dynamic: 17.3.0,
  - angular/router: 17.3.0,
  - auth0/angular-jwt: 5.2.0,
  - dynamic-mapper/angular: 1.1.1,
  - dynamic-mapper/mapper: 1.10.4,
  - fullcalendar/angular: 6.1.14,
  - fullcalendar/core: 6.1.14",
  - fullcalendar/daygrid: 6.1.14,
  - fullcalendar/interaction: 6.1.14,
  - fullcalendar/timegrid: 6.1.14,
  - ng-icons/bootstrap-icons: 26.0.0,
  - ng-icons/core: 26.0.0,
  - ngrx/store: 17.2.0,
  - ngx-translate/core: 15.0.0,
  - ngx-translate/http-loader: 8.0.0,
  - chart.js: 4.4.4,
  - check-guid: 1.0.2,
  - class-enum: 0.1.1,
  - crypto-js: 4.2.0,
  - devextreme: 23.2.6,
  - devextreme-angular: 23.2.6,
  - devextreme-schematics: 1.6.8,
  - flag-icons: 7.2.3,
  - fluentvalidation-ts: 3.2.0,
  - form-validate-angular: 17.0.1,
  - jspdf: 2.5.1,
  - jspdf-autotable: 3.8.3,
  - jwt-decode: 4.0.0,
  - ngx-spinner: 17.0.0,
  - primeflex: 3.3.1,
  - primeicons: 7.0.0,
  - primeng: 17.17.0,
  - rxjs: 7.8.0,
  - tslib: 2.3.0,
  - xlsx: 0.18.5,
  - zone.js: 0.14.3

## License

The MIT License (MIT)

## Screenshots

![Alt text](/screenshots/01-e-appointment.png)

![Alt text](/screenshots/02-e-appointment.png)

![Alt text](/screenshots/03-e-appointment.png)

![Alt text](/screenshots/04-e-appointment.png)

![Alt text](/screenshots/05-e-appointment.png)

![Alt text](/screenshots/06-e-appointment.png)

![Alt text](/screenshots/07-e-appointment.png)

![Alt text](/screenshots/08-e-appointment.png)

![Alt text](/screenshots/09-e-appointment.png)

![Alt text](/screenshots/10-e-appointment.png)

![Alt text](/screenshots/11-e-appointment.png)

![Alt text](/screenshots/12-e-appointment.png)

![Alt text](/screenshots/13-e-appointment.png)

![Alt text](/screenshots/14-e-appointment.png)

![Alt text](/screenshots/15-e-appointment.png)

![Alt text](/screenshots/16-e-appointment.png)

![Alt text](/screenshots/17-e-appointment.png)

![Alt text](/screenshots/18-e-appointment.png)

![Alt text](/screenshots/19-e-appointment.png)

![Alt text](/screenshots/20-e-appointment.png)

![Alt text](/screenshots/21-e-appointment.png)

![Alt text](/screenshots/22-e-appointment.png)

![Alt text](/screenshots/23-e-appointment.png)

![Alt text](/screenshots/24-e-appointment.png)

![Alt text](/screenshots/25-e-appointment.png)

![Alt text](/screenshots/26-e-appointment.png)

![Alt text](/screenshots/27-e-appointment.png)

![Alt text](/screenshots/28-e-appointment.png)

![Alt text](/screenshots/29-e-appointment.png)

![Alt text](/screenshots/30-e-appointment.png)

![Alt text](/screenshots/31-e-appointment.png)