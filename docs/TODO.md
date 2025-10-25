# TODOs:
### Enhanced Error Handling & User Experience

**Description:**  
Improve error handling throughout the application and enhance user experience with better loading states and feedback.  

**Tasks include:**  
- Implementing comprehensive error boundaries  
- Adding loading spinners during PDF processing  
- Creating user-friendly error messages  
- Adding retry mechanisms for failed operations  
- Implementing toast notifications for user feedback  
- Adding progress indicators for long-running tasks  


### Auth
Implement Better Auth for secure user authentication to replace session storage with persistent user sessions.

Steps:

- [ ] Install and configure Better Auth
- [ ] Create user authentication pages (login/register)
- [ ] Set up authentication middleware
- [ ] Update components to handle auth state

## Database Migration
Replace session storage with PostgreSQL database for persistent data storage and user management.

## Tasks
- [ ] Design database schema (users, quizzes, questions, results)
- [ ] Set up PostgreSQL connection and migrations
- [ ] Create database models and ORM setup
- [ ] Migrate from sessionStorage to database storage
- [ ] Add database seeding and backup mechanisms

## Acceptance Criteria
- All quiz data persists in PostgreSQL
- User quiz history is maintained
- Database migrations work properly
- Data integrity constraints in place

