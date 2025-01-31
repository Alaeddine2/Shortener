
# URL Shortener



This repository contains both the backend and frontend components of a fully featured URL shortening service. The backend is built with Node.js, while the frontend is developed using Next.js.  

The service allows users to generate shortened URLs efficiently and includes advanced features such as:  
- **QR Code Generation** – Create scannable QR codes for shortened links.  
- **Link Analytics & Tracking** – Monitor usage metrics, including click counts and visitor insights.  
- **Custom Short Links** – Enable users to personalize their shortened URLs.  
- **Expiration & Security Controls** – Set expiration dates and manage access permissions.  

Designed to be secure, easy to use and useful.


## Setup Instructions
As a first step you need to clone the project using this command:

```bash
git clone https://github.com/Alaeddine2/Shortener.git
```

### Backend Setup


After cloning the application navigate to the urlshortener-backend directory using

```bash
cd urlshortener-backend
```

Install dependencies using npm:

```bash
npm install
```

Start the backend server
```bash
npm start
```

### Frontend Setup

Navigate to the url-shortener-frontend directory:
```bash
cd url-shortener-frontend
```
Install dependencies:
```bash
npm install
```
Start the frontend development server:

```bash
npm run dev
```

## How This Repository is Structured
The repository is divided into two main projects:

1- **urlshortener-backend**: The backend application built with Node.js.

2- **urlshortener-frontend**: The frontend application built with Next.js.

### Backend (urlshortener-backend)
The backend is responsible for handling the logic of shortening URLs, storing them, and redirecting users to the original URLs. 

Directory Structure


```python
urlshortener-backend/
    node_modules/        # Node.js dependencies
    src/                # Source code (where the main file are locate)
        controllers/    # Logic to handle requests and it contains two files
            logController.js  # A controller contains the logic for retrieving URL logs (logs are a collection of user visits to shortened URLs).
            urlController.js  # A controller contains the CRUS of an Url and the redirect function
        models/         # Data models
            Log.js  # Log schema 
            Url.js  # URL schema
            User.js # User shema (he will be define by his fingerprint to detect if it is a new logged device or not)
        routes/         # API route definitions
            logRoutes.js    # Log Endpoint
            mainRoutes.js   # Contains a v1 of apis endpoins
            urlRoutes.js    # Url Endpoint
        tests/       # Contains the Unite and E2E tests
        utils/          # Utility functions
        app.js          # Entry point for the application
        server.js       # A separate server to run Express
    .env                # Environment variables
    .gitignore          # Specifies files to ignore in Git
    jest.setup.js       # Setup file for Jest testing
    package-lock.json   # Automatically generated file for dependencies
    package.json        # Project metadata and dependencies
```

Key Files:
- src/app.js: The main entry point for the backend application.

- src/routes/: Contains the API route definitions.

- src/controllers/: Handles the logic for each route.

- src/models/: Defines the data models (e.g., URL schema).

- src/utils/: Utility functions used across the application.

### Frontend (url-shortener-frontend)

The frontend is a Next.js application that provides a user interface for shortening URLs and viewing logs.
```python
url-shortener-frontend/
url-shortener/
    node_modules/       # Node.js dependencies
    public/             # Static assets (images, fonts, etc.)
        assets/         # Project Images
    src/                # Source code
        app/            # the core of the application
            log-visitors    # log page
            url-list        # ulr list interface
            layout.tsx      # project layout
        components/     # Reusable UI components
            footer
            header
            link        # A custom rpouting way of the header based on mouseover PrefetchListener
            ui          # ui.shadcn componenets
        constants/      # Project constant values
        hooks/          # Allows you to use state to functional components
        interfaces/     # ts interfaces contains Visitors, urls ...
        services/       # Call Backend Apis
    .env                # Environment variables contains the deployed backend basic URL
    .gitignore          # Specifies files to ignore in Git
    components.json     # Configuration for components
    eslint.config.mjs   # ESLint configuration
    next-env.d.ts       # TypeScript environment declarations
    next.config.ts      # Next.js configuration
    package-lock.json   # Automatically generated file for dependencies
    package.json        # Project metadata and dependencies
    postcss.config.mjs  # PostCSS configuration
    README.md           # Project documentation
    tailwind.config.ts  # Tailwind CSS configuration
    tsconfig.json       # TypeScript configuration
```

## API Documentation
This is a brief documentation of the backend APIs. For more details, you can visit the [Postman Documentation](https://documenter.getpostman.com/view/10001185/2sAYX2PQBw), where you can find API test cases and their responses.

### Base URL
The base URL for the API is http://localhost:5000/v1 in local or https://urlshortener-i1ad.onrender.com/v1/ for the deployed version.

### Endpoints

Shorten URL

-   **URL**: /shorten
-   **Method**: POST
-   **Description**: API to generate a shortened URL from a user-provided long URL. Users can also specify an expiration date for the shortened link.
-   **Headers**: "X-Fingerprint" : "String"
-   **Body**:
```bash
{
  "longUrl": "https://ui.shadcn.com/docs/components/skeleton",
  "name": "skalton",
  "expiresAt": "2025-01-31T23:00:00.000Z" # can be null
}
```
-   **Response**:
```bash
{
    "code": "API.SHORTURL.CREATION.ACCEPT",
    "message": "new shortul created",
    "success": true,
    "data": {
        "longUrl": "https://ui.shadcn.com/docs/components/skeleton",
        "shortId": "Iyro3W",
        "expiresAt": "2025-01-31T23:00:00.000Z",
        "clicks": 0,
        "user": "679aad4910a0d47de0448756",
        "name": "skalton",
        "shortUrl": "https://urlshortener-i1ad.onrender.com/v1/Iyro3W",
        "_id": "679c965e6af856688417c699",
        "createdAt": "2025-01-31T09:22:38.911Z",
        "__v": 0
    }
}
```

Redirect to Original URL

-   **URL**: /:shortened_id
-   **Method**: GET
-   **Description**: Get the original URL from the short url Id
-   **Response**:
```bash
Redirect to URL
```
refer to Postman docs to see more details.


Fetch all user Urls

-   **URL**: /user/urls
-   **Method**: Get
-   **Description**: Retrieve all user stored Urls using his fingerprint
-   **Headers**: "X-Fingerprint" : "String"
-   **Parameters**:
```bash
    shortId (string): The short ID of the URL for which logs are being retrieved.
    page (integer): The page number for pagination (starting from 1).
    limit (integer): The number of logs to return per page.
```
-   **Exemple**: https://urlshortener-i1ad.onrender.com/v1/logs/MjDpjR?page=1&limit=2
-   **Response**:
```bash
{
    "code": "API.SHORTURL.LIST.ACCEPT",
    "message": "get utls list",
    "success": true,
    "data": [
        {
            "_id": "679c969a6af856688417c69c",
            "longUrl": "https://ui.shadcn.com/docs/components/skeleton",
            "shortId": "8EokxY",
            "clicks": 1,
            "user": {
                "_id": "679aad4910a0d47de0448756"
            },
            "name": "skalton",
            "shortUrl": "https://urlshortener-i1ad.onrender.com/v1/8EokxY",
            "createdAt": "2025-01-31T09:23:38.154Z",
            "__v": 0
        },
....
        {
            "_id": "679ab110a6693de87203e099",
            "longUrl": "https://www.freepik.com/free-vector/monster-404-error-concept-illustration_13247723.htm#fromView=keyword&page=2&position=40&uuid=f47c2fa3-1a17-4c9a-9723-efe07d595ebb&query=Not+Found",
            "shortId": "MjDpjR",
            "clicks": 4,
            "user": {
                "_id": "679aad4910a0d47de0448756"
            },
            "name": "skalton",
            "shortUrl": "http://localhost:5000/v1/MjDpjR",
            "createdAt": "2025-01-29T22:52:00.964Z",
            "__v": 0
        }
    ]
}
```

Update URL

-   **URL**: /user/urls/:shortId
-   **Method**: PUT
-   **Description**: Update URL
-   **Headers**: "X-Fingerprint" : "String"
-   **body**:
```bash
{
  "longUrl": "https://www.freepik.com/free-vector/monster-404-error-concept-illustration_13247723.htm#fromView=keyword&page=2&position=40&uuid=f47c2fa3-1a17-4c9a-9723-efe07d595ebb&query=Not+Found",
  "name": "skalton",
  "expiresAt": "2025-01-31T23:00:00.000Z"
}
```
-   **Response**:
```bash
{
    "code": "API.SHORTURL.UPDATE.ACCEPT",
    "message": "URL updated",
    "success": true,
    "data": {
        "_id": "679ab110a6693de87203e099",
        "longUrl": "https://www.freepik.com/free-vector/monster-404-error-concept-illustration_13247723.htm#fromView=keyword&page=2&position=40&uuid=f47c2fa3-1a17-4c9a-9723-efe07d595ebb&query=Not+Found",
        "shortId": "MjDpjR",
        "clicks": 4,
        "user": "679aad4910a0d47de0448756",
        "name": "skalton",
        "shortUrl": "http://localhost:5000/v1/MjDpjR",
        "createdAt": "2025-01-29T22:52:00.964Z",
        "__v": 0,
        "expiresAt": "2025-01-31T23:00:00.000Z"
    }
}
```

Update URL

-   **URL**: /user/urls/:shortId
-   **Method**: Delete
-   **Description**: Delete URL
-   **Headers**: "X-Fingerprint" : "String"
-   **Response**:
```bash
{
    "code": "API.SHORTURL.DELETE.ACCEPT",
    "message": "URL DELETED",
    "success": true,
    "data": "Accept"
}
```

Get Logs for a Shortened URL

-   **URL**: /logs/:shortId
-   **Method**: Get
-   **Description**: Retrieve logs for a specific shortened URL. logs contains all access to the original URL. This endpoint supports pagination.
-   **Headers**: "X-Fingerprint" : "String"
-   **Parameters**:
```bash
    shortId (string): The short ID of the URL for which logs are being retrieved.
    page (integer): The page number for pagination (starting from 1).
    limit (integer): The number of logs to return per page.
```
-   **Exemple**: https://urlshortener-i1ad.onrender.com/v1/logs/MjDpjR?page=1&limit=2
-   **Response**:
```bash
{
    "code": "API.LOG.LIST.ACCEPT",
    "message": "accepted",
    "success": true,
    "data": [
        {
            "_id": "679ac1802003ab2299d2bcc2",
            "Status": true,
            "visitorIP": "::1",
            "browser": "Chrome",
            "url": "679ab110a6693de87203e099",
            "createdAt": "2025-01-30T00:02:08.642Z",
            "__v": 0
        },
        {
            "_id": "679ab564a9d91723e91edb67",
            "Status": true,
            "visitorIP": "::1",
            "browser": "Chrome",
            "url": "679ab110a6693de87203e099",
            "createdAt": "2025-01-29T23:10:28.090Z",
            "__v": 0
        }
    ],
    "pagination": {
        "total": 4,
        "page": 1,
        "limit": 2,
        "totalPages": 2
    }
}
```

