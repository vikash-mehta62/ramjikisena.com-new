# Requirements Document - Helping System

## Introduction

Helping System is a community-driven platform where users can post help requests and offer assistance. This creates a supportive spiritual community for various needs.

## Glossary

- **Help_Request**: User post seeking assistance
- **Helper**: User offering help or responding to requests
- **Category**: Type of help needed (Pandit, Financial, Blood Donation, etc.)
- **Status**: State of help request (Open, In Progress, Resolved, Closed)
- **Response**: Reply or offer to help on a request

## Requirements

### Requirement 1: Help Request Listing

**User Story:** As a user, I want to browse help requests, so that I can offer assistance to others.

#### Acceptance Criteria

1. WHEN user views helping page, THE System SHALL display all active help requests
2. THE System SHALL show request title, category, location, and posted date
3. THE System SHALL display urgency level (Normal, Urgent, Critical)
4. WHEN user filters by category, THE System SHALL show only requests of that type
5. THE System SHALL show response count for each request

### Requirement 2: Create Help Request

**User Story:** As a user, I want to post a help request, so that community members can assist me.

#### Acceptance Criteria

1. WHEN logged-in user creates request, THE System SHALL require title, description, and category
2. THE System SHALL support categories: Pandit Needed, Financial Help, Blood Donation, Event Volunteer, Other
3. WHEN user submits request, THE System SHALL set status to "Open"
4. THE System SHALL allow user to add contact information (phone, email)
5. THE System SHALL allow user to set urgency level

### Requirement 3: Respond to Help Requests

**User Story:** As a user, I want to respond to help requests, so that I can offer assistance.

#### Acceptance Criteria

1. WHEN logged-in user views request detail, THE System SHALL display response form
2. WHEN user submits response, THE System SHALL notify request creator
3. THE System SHALL display all responses with responder name and timestamp
4. WHEN request creator replies, THE System SHALL create conversation thread
5. THE System SHALL allow users to mark helpful responses

### Requirement 4: Help Request Management

**User Story:** As a request creator, I want to manage my requests, so that I can update status and close when resolved.

#### Acceptance Criteria

1. WHEN user views their requests, THE System SHALL show all created help requests
2. WHEN user marks request as resolved, THE System SHALL update status and notify responders
3. WHEN user edits request, THE System SHALL update details and show edit timestamp
4. WHEN user deletes request, THE System SHALL remove it and notify responders
5. THE System SHALL allow user to thank helpers publicly

### Requirement 5: Search & Filter Help Requests

**User Story:** As a user, I want to search and filter help requests, so that I can find relevant needs.

#### Acceptance Criteria

1. WHEN user enters search query, THE System SHALL filter requests by title or description
2. WHEN user selects category filter, THE System SHALL show only requests in that category
3. WHEN user selects location filter, THE System SHALL show requests in that city/state
4. THE System SHALL support filtering by status (Open, Resolved)
5. WHEN user enables GPS, THE System SHALL show nearby requests first

### Requirement 6: Community Safety & Moderation

**User Story:** As an admin, I want to moderate help requests, so that the platform remains safe and appropriate.

#### Acceptance Criteria

1. WHEN user reports inappropriate request, THE System SHALL flag it for admin review
2. WHEN admin reviews flagged content, THE System SHALL allow approve or remove action
3. THE System SHALL block users who repeatedly post inappropriate content
4. THE System SHALL log all moderation actions with timestamp
5. THE System SHALL display community guidelines on help request creation page

## Future Enhancements

- Verification system for helpers (background checks)
- Rating system for helpers
- Direct messaging between users
- Help request matching algorithm
- Success stories showcase
- Donation integration for financial help
- Volunteer hour tracking
- Community impact dashboard
