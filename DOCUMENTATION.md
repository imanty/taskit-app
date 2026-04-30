# TaskIt Todo App — Technical Documentation

---

## 1. REST API Endpoints

**Base URL:** `http://localhost:3000`

All endpoints communicate using JSON. No authentication is currently required.

---

### GET `/get/example`

**Purpose:** Health check / smoke test to confirm the backend is running.

**Authentication:** None

**Request Parameters:** None

**Request Format:**
```
GET http://localhost:3000/get/example
```

**Response Format:**
```
200 OK
"Hello! I am a message from the backend"
```

**Example (cURL):**
```bash
curl http://localhost:3000/get/example
```

---

### GET `/api/tasks`

**Purpose:** Retrieve all tasks from the database. Optionally sort results.

**Authentication:** None

**Query Parameters:**

| Parameter | Type   | Required | Values                        | Description            |
|-----------|--------|----------|-------------------------------|------------------------|
| sortBy    | string | No       | `dueDate` \| `dateCreated`    | Sort order for results |

**Request Format:**
```
GET http://localhost:3000/api/tasks
GET http://localhost:3000/api/tasks?sortBy=dueDate
GET http://localhost:3000/api/tasks?sortBy=dateCreated
```

**Response Format:**
```json
[
  {
    "_id": "664a1234abcd5678ef901234",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "dueDate": "2026-05-01T00:00:00.000Z",
    "completed": false,
    "dateCreated": "28/04/2026"
  }
]
```

**Example (cURL):**
```bash
curl "http://localhost:3000/api/tasks?sortBy=dueDate"
```

---

### POST `/api/tasks/todo`

**Purpose:** Create a new task.

**Authentication:** None

**Request Body (JSON):**

| Field       | Type   | Required | Description                  |
|-------------|--------|----------|------------------------------|
| title       | string | Yes      | Task title                   |
| description | string | Yes      | Task description             |
| dueDate     | date   | Yes      | Due date (ISO 8601 format)   |

**Request Format:**
```
POST http://localhost:3000/api/tasks/todo
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "dueDate": "2026-05-01"
}
```

**Response Format:**
```json
{
  "task": {
    "_id": "664a1234abcd5678ef901234",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "dueDate": "2026-05-01T00:00:00.000Z",
    "completed": false,
    "dateCreated": "28/04/2026"
  },
  "message": "Task created successfully"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/tasks/todo \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, bread, eggs","dueDate":"2026-05-01"}'
```

---

### PUT `/api/tasks/update/:id`

**Purpose:** Update the title, description, and/or due date of an existing task.

**Authentication:** None

**URL Parameters:**

| Parameter | Type   | Required | Description         |
|-----------|--------|----------|---------------------|
| id        | string | Yes      | MongoDB task `_id`  |

**Request Body (JSON):**

| Field       | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| title       | string | Yes      | Updated task title         |
| description | string | Yes      | Updated task description   |
| dueDate     | date   | Yes      | Updated due date           |

**Request Format:**
```
PUT http://localhost:3000/api/tasks/update/664a1234abcd5678ef901234
Content-Type: application/json

{
  "title": "Buy groceries (updated)",
  "description": "Milk, bread, eggs, cheese",
  "dueDate": "2026-05-03"
}
```

**Response Format:**
```json
{
  "task": {
    "_id": "664a1234abcd5678ef901234",
    "title": "Buy groceries (updated)",
    "description": "Milk, bread, eggs, cheese",
    "dueDate": "2026-05-03T00:00:00.000Z",
    "completed": false,
    "dateCreated": "28/04/2026"
  },
  "message": "Task updated successfully"
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:3000/api/tasks/update/664a1234abcd5678ef901234 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description","dueDate":"2026-05-03"}'
```

---

### PATCH `/api/tasks/complete/:id`

**Purpose:** Mark a task as completed.

**Authentication:** None

**URL Parameters:**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| id        | string | Yes      | MongoDB task `_id` |

**Request Body:** None required (completion state is set by the endpoint).

**Request Format:**
```
PATCH http://localhost:3000/api/tasks/complete/664a1234abcd5678ef901234
```

**Response Format:**
```json
{
  "task": {
    "_id": "664a1234abcd5678ef901234",
    "title": "Buy groceries",
    "completed": true,
    ...
  },
  "message": "Task completed"
}
```

**Example (cURL):**
```bash
curl -X PATCH http://localhost:3000/api/tasks/complete/664a1234abcd5678ef901234
```

---

### PATCH `/api/tasks/notComplete/:id`

**Purpose:** Mark a task as incomplete (reverse a completion).

**Authentication:** None

**URL Parameters:**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| id        | string | Yes      | MongoDB task `_id` |

**Request Body:** None required.

**Request Format:**
```
PATCH http://localhost:3000/api/tasks/notComplete/664a1234abcd5678ef901234
```

**Response Format:**
```json
{
  "task": {
    "_id": "664a1234abcd5678ef901234",
    "title": "Buy groceries",
    "completed": false,
    ...
  },
  "message": "Task marked as incomplete"
}
```

**Example (cURL):**
```bash
curl -X PATCH http://localhost:3000/api/tasks/notComplete/664a1234abcd5678ef901234
```

---

### DELETE `/api/tasks/delete/:id`

**Purpose:** Permanently delete a task.

**Authentication:** None

**URL Parameters:**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| id        | string | Yes      | MongoDB task `_id` |

**Request Body:** None.

**Request Format:**
```
DELETE http://localhost:3000/api/tasks/delete/664a1234abcd5678ef901234
```

**Response Format:**
```json
{
  "task": { ... },
  "message": "Task deleted"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:3000/api/tasks/delete/664a1234abcd5678ef901234
```

---

## 2. Dependencies

### Backend Dependencies

**File:** [backend/package.json](backend/package.json)

| Package    | Version  | License    | Purpose                                      |
|------------|----------|------------|----------------------------------------------|
| express    | ^5.2.1   | MIT        | HTTP server and routing framework            |
| mongoose   | ^9.3.3   | MIT        | MongoDB object modelling (ODM)               |
| cors       | ^2.8.6   | MIT        | Cross-Origin Resource Sharing middleware     |
| dotenv     | ^17.4.0  | BSD-2      | Loads environment variables from `.env`      |

All packages are open-source with permissive licenses compatible with commercial use.

**Installation:**
```bash
cd backend
npm install
```

This installs all dependencies listed in `package.json` into the `node_modules/` directory (excluded from version control via `.gitignore`).

**Node.js requirement:** Node.js v18 or higher is recommended for compatibility with Express v5.

---

### Frontend Dependencies

The frontend uses no npm packages. Dependencies are loaded via CDN and require an internet connection.

| Library       | Version | Source                                              | Purpose                      |
|---------------|---------|-----------------------------------------------------|------------------------------|
| Bootstrap     | 5.3.3   | cdn.jsdelivr.net/npm/bootstrap@5.3.3                | UI components and layout     |
| Bootstrap JS  | 5.3.3   | cdn.jsdelivr.net/npm/bootstrap@5.3.3                | Modal and interactive widgets|

No installation required for the frontend — CDN links are embedded in HTML files.

---

### External Services

| Service        | Purpose                     | Integration Method       |
|----------------|-----------------------------|--------------------------|
| MongoDB Atlas  | Cloud-hosted database       | Mongoose connection URI  |

MongoDB Atlas is the sole external service dependency. It requires an active internet connection at runtime. The cluster is hosted on the free tier (Cluster0) under the project owner's MongoDB Atlas account.

---

## 3. Credentials

> **Security Notice:** Never commit credentials to version control. All sensitive values must be stored in environment files that are excluded via `.gitignore`.

---

### Environment Configuration

**File:** [backend/.env](backend/.env) — excluded from git, must be created manually on each deployment environment.

| Variable   | Description                          | Example Value                         |
|------------|--------------------------------------|---------------------------------------|
| `port`     | Port the Express server listens on   | `3000`                                |
| `MONGO_URI`| MongoDB Atlas connection string      | `mongodb+srv://user:pass@cluster/db`  |

**Setup instructions:**
1. Create `backend/.env` in the project root.
2. Copy the template below and fill in the values:

```env
port = 3000
MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<AppName>"
```

3. Obtain the MongoDB Atlas connection string from the Atlas dashboard under **Database > Connect > Drivers**.

---

### MongoDB Atlas

| Detail         | Value                                |
|----------------|--------------------------------------|
| Cluster        | Cluster0                             |
| Region         | As configured in Atlas account       |
| Access         | MongoDB Atlas web dashboard          |
| Dashboard URL  | https://cloud.mongodb.com            |
| DB User        | Managed under Atlas > Database Access|

To reset the database password: Atlas dashboard > Database Access > Edit user > Update password, then update `MONGO_URI` in `.env`.

---

### Administrative Access

| System             | Access Method                                 | Notes                                      |
|--------------------|-----------------------------------------------|--------------------------------------------|
| MongoDB Atlas      | Email + password at cloud.mongodb.com         | Owner account holds billing and cluster    |
| GitHub Repository  | GitHub account credentials                    | Source control and code review             |
| Local dev server   | `npm start` in `/backend`                     | No password required locally               |

There is currently no admin interface or user authentication system within the application itself. All API endpoints are publicly accessible without a token or session.

---

## 4. Procedure for Feedback

### Feedback Policy

TaskIt welcomes feedback from users, testers, and stakeholders. Feedback should be constructive, specific, and focused on functionality, usability, or defects.

Feedback channels:
- **Bug reports:** Raise a GitHub Issue on the project repository with the label `bug`
- **Feature requests:** Raise a GitHub Issue with the label `enhancement`
- **General feedback:** Submit via the Support page (`/frontend/support.html`) or directly to the project maintainer

---

### Privacy and Acceptable Use

- Do not submit personal data belonging to others as part of feedback or test cases
- Feedback submitted via GitHub is subject to GitHub's Terms of Service and Privacy Policy
- The application does not currently collect user data or analytics; no privacy policy is applicable to end users at this stage of development

---

### Feedback Identification and Action Process

**Step 1 — Receive**
Feedback arrives via GitHub Issues or direct communication. All feedback is reviewed by the maintainer within 5 business days of submission.

**Step 2 — Triage**
The maintainer assigns one of the following labels:
- `bug` — confirmed defect
- `enhancement` — new feature or improvement
- `wontfix` — out of scope or intentionally excluded
- `duplicate` — already reported
- `needs-info` — insufficient detail to act on

**Step 3 — Prioritise**
Bugs blocking core functionality (task creation, completion, deletion) are prioritised over cosmetic or enhancement requests.

**Step 4 — Action**
- A feature branch is created from `develop` named `fix/issue-<number>` or `feature/issue-<number>`
- Changes are implemented, tested locally, and submitted via pull request
- The originating GitHub Issue is referenced in the PR description (e.g. `Closes #12`)

**Step 5 — Verify**
The maintainer reviews the PR. Where practical, the original feedback submitter is invited to test the fix before the PR is merged.

**Step 6 — Close**
Once merged, the GitHub Issue is closed with a comment summarising what was done and which version it was resolved in.

---

## 5. Procedure for Code Commit Changes

### Overview

All code changes follow a branching strategy with `master` as the production branch and `develop` as the integration branch.

```
master      ← stable, production-ready
develop     ← integration branch for tested features
feature/*   ← individual feature or fix branches
```

---

### Step-by-Step Process

**1. Create a feature branch from `develop`**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-task-priority`
- `fix/delete-endpoint-error`
- `chore/update-dependencies`

**2. Make and test changes locally**
- Start the backend: `cd backend && npm start`
- Open the frontend in a browser and test the affected functionality
- Confirm existing features are not broken

**3. Commit changes with descriptive messages**
```bash
git add <specific-files>
git commit -m "feat: add priority field to task model and API"
```

Commit message format:
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance (deps, config)
- `docs:` — documentation only

Commit frequently. Each commit should represent one logical change.

**4. Push the branch to the remote repository**
```bash
git push -u origin feature/your-feature-name
```

**5. Create a pull request**
- Open a pull request on GitHub targeting the `develop` branch
- Include a clear title and description explaining what changed and why
- Reference any related GitHub Issues (e.g. `Closes #7`)
- Assign a reviewer if applicable

**6. Address feedback**
- Respond to review comments in the PR thread
- Push additional commits to the same branch to address requested changes; do not force-push after a review has started
- Re-request review once changes are made

**7. Merge into `develop`**
- Once approved, merge the PR into `develop` using a merge commit or squash merge
- Delete the feature branch after merge

**8. Merge `develop` into `master`**
- After thorough testing on `develop`, raise a PR from `develop` → `master`
- This represents a release; ensure all features intended for the release are included
- Merge and tag the release: `git tag v1.x.x`

**9. Post-merge cleanup**
```bash
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

---

### Resolving Merge Conflicts

1. Pull the target branch locally and merge it into your feature branch:
   ```bash
   git fetch origin
   git merge origin/develop
   ```
2. Open conflicting files and resolve markers (`<<<<<<<`, `=======`, `>>>>>>>`) manually
3. Stage resolved files and commit:
   ```bash
   git add <resolved-files>
   git commit -m "chore: resolve merge conflict with develop"
   ```
4. Push and continue with the PR process

If you encounter access or permission issues with the remote repository, contact the repository admin (project owner) to verify your GitHub collaborator status.

---

### Best Practices Summary

- Commit small, focused changes rather than large batches
- Never commit directly to `master` or `develop`
- Never commit `.env` files or credentials
- Write tests for new functionality where applicable
- Update this documentation when endpoints, dependencies, or credentials change
- Use `npm audit` periodically to check for known dependency vulnerabilities
