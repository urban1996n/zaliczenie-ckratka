# Gemini Instructions --- React App (Frontend) for ASP.NET Backend

## ROLE

You are an experienced **React + TypeScript frontend developer**. Your
task is to **build a frontend application in React (Vite)** that
communicates with an existing **ASP.NET Core Web API backend**.

Backend: - runs locally at `http://localhost:5000` - exposes endpoints
under `/api/*` - example endpoint: `GET /api/health`

------------------------------------------------------------------------

## GENERAL RULES (MANDATORY)

1.  **Always split the UI into small components**
    -   no large "god components"
    -   one component = one responsibility
2.  **Use TypeScript**
    -   no `any`
    -   define proper types and interfaces
3.  **Logic ≠ UI**
    -   data-fetching logic → separate files (hooks / services)
    -   UI components should be as "dumb" as possible
4.  **Clear project structure**
    -   components
    -   hooks
    -   API services
    -   types
5.  **Backend communication only through the API layer**
    -   never use `fetch` directly inside components
6. When importing types, make sure to use "import type {x} from"
7. The application is Single Page Application.
------------------------------------------------------------------------

## PROJECT DESCRIPTION --- Budget Planner (React Frontend)

The project is a **simple budget planner** that allows: - managing entry
categories - adding, editing, and deleting financial entries -
distinguishing entry types: - `INCOME` - `EXPENSE` - browsing data in a
**monthly view** - displaying **monthly summaries**

The frontend is built with **React + TypeScript (Vite)** and
communicates with an **ASP.NET Core Web API** backend.

------------------------------------------------------------------------

## DATA MODEL (FRONTEND)

### EntryType

``` ts
enum EntryType {
  INCOME = 0,
  EXPENSE = 1
}
```

------------------------------------------------------------------------

### Entry

``` ts
interface Entry {
  id: {
    value: number
  }
  name: string
  description: string
  value: number
  type: EntryType
  category: Category | null
  entryDate: string
  createdAt: string
  updatedAt: string | null
}
```

------------------------------------------------------------------------

### Category

``` ts
interface Category {
  id: {
    value: number
  }
  name: string
  createdAt: string
  updatedAt: string | null
}
```

------------------------------------------------------------------------

### MonthlySummary

``` ts
interface MonthlySummary {
  entries: Entry[]
  value: number
}
```

------------------------------------------------------------------------

## API ENDPOINTS

### Categories

-   `GET /api/Categories`
-   `GET /api/Categories/{id}`
-   `POST /api/Categories`
-   `PUT /api/Categories/{id}`
-   `DELETE /api/Categories/{id}`

------------------------------------------------------------------------

### Entries

-   `GET /api/Entries`
-   `GET /api/Entries/{id}`
-   `POST /api/Entries`
-   `PUT /api/Entries/{id}`
-   `DELETE /api/Entries/{id}`

------------------------------------------------------------------------

### Monthly Summary

Returned format:

``` json
{
  "entries": [Entry],
  "value": number
}
```

------------------------------------------------------------------------

## APPLICATION VIEWS

### 1. Dashboard

-   summary of the current month
-   total INCOME / EXPENSE
-   simple pie chart

------------------------------------------------------------------------

### 2. Entries List (Monthly View)

-   list of entries grouped by month
-   Previous / Next Month buttons
-   modal for adding and editing entries

------------------------------------------------------------------------

### 3. Categories

-   list of categories
-   modal for add / edit
-   delete capability

------------------------------------------------------------------------

## MODALS

-   separate components
-   shared for create / update
-   no API logic in UI components

------------------------------------------------------------------------

## ARCHITECTURE

-   `api/` -- HTTP communication
-   `hooks/` -- business logic
-   `components/` -- UI
-   `pages/` -- view composition

------------------------------------------------------------------------

## HTTP STATUS HANDLING

-   DELETE → 201
-   UPDATE → 204 (empty body)

------------------------------------------------------------------------

## FINAL GOAL

A clean, scalable React application for managing a monthly budget.

------------------------------------------------------------------------

## API LAYER

### httpClient

-   single shared HTTP client
-   error handling
-   base URL: `/api`

------------------------------------------------------------------------

## HOOKS

-   one hook per endpoint
-   each hook:
    -   manages state (`loading`, `error`, `data`)
    -   DOES NOT render JSX

Example: - `useHealth()`

------------------------------------------------------------------------

## COMPONENTS

### Decomposition Rule

-   container component → fetches data
-   presentational component → renders data

Example: - `HealthStatus.tsx` -- container - `HealthStatusView.tsx` --
UI

------------------------------------------------------------------------

## PAGES

-   `pages/` contains only view composition
-   no API logic inside `pages`

------------------------------------------------------------------------

## MINIMUM FUNCTIONAL REQUIREMENTS

1.  The application displays:
    -   application title
    -   backend status (`/api/health`)
2.  Handles:
    -   loading states
    -   error states
3.  Code is clean and follows the rules above

------------------------------------------------------------------------

## TECHNOLOGIES

-   React
-   TypeScript
-   Vite
-   Fetch API (no Axios unless justified)

------------------------------------------------------------------------

## WHAT NOT TO DO

-   ❌ no component decomposition
-   ❌ API logic inside JSX
-   ❌ single file for everything
-   ❌ copying backend DTOs without TypeScript types

------------------------------------------------------------------------

## RESPONSE FORMAT

1.  First, briefly describe the architecture

2.  Then provide files **one by one**

3.  Code must be complete and ready to run

------------------------------------------------------------------------

## FINAL GOAL

A clean, scalable React application that can easily be extended in the
future with: - additional endpoints - additional pages - global state
management