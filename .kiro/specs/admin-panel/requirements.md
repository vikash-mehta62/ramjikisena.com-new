# Requirements Document - Admin Panel

## Introduction

Admin Panel for Ramji Ki Sena platform to manage users, blogs, and system content. This provides centralized control for administrators to moderate content, manage users, and monitor platform activity.

## Glossary

- **Admin**: User with administrative privileges who can manage platform content
- **System**: The Ramji Ki Sena web application
- **Blog_Post**: User-generated spiritual content requiring approval
- **User**: Registered platform member
- **Approval_Status**: State of content (pending, approved, rejected)

## Requirements

### Requirement 1: Admin Authentication

**User Story:** As an admin, I want secure access to the admin panel, so that only authorized personnel can manage the platform.

#### Acceptance Criteria

1. WHEN an admin logs in with admin credentials, THE System SHALL redirect to admin dashboard
2. WHEN a non-admin user attempts to access admin routes, THE System SHALL deny access and redirect to user dashboard
3. THE System SHALL verify admin role on every admin API request
4. WHEN admin session expires, THE System SHALL redirect to login page

### Requirement 2: Blog Management

**User Story:** As an admin, I want to review and approve user-submitted blogs, so that only quality content appears on the platform.

#### Acceptance Criteria

1. WHEN admin views pending blogs, THE System SHALL display all unapproved blog posts with author information
2. WHEN admin approves a blog, THE System SHALL set approved status to true and make it visible to all users
3. WHEN admin rejects a blog, THE System SHALL set approved status to false and hide it from public view
4. THE System SHALL display blog title, author, category, creation date, and content preview
5. WHEN admin clicks on a blog, THE System SHALL show full blog content for review

### Requirement 3: User Management

**User Story:** As an admin, I want to view and manage users, so that I can monitor platform activity and handle user issues.

#### Acceptance Criteria

1. WHEN admin views user list, THE System SHALL display all registered users with key statistics
2. THE System SHALL show username, name, city, total count, rank, and join date for each user
3. WHEN admin searches for a user, THE System SHALL filter results by name or username
4. THE System SHALL sort users by registration date, total count, or rank
5. WHEN admin views user details, THE System SHALL display complete user profile and activity history

### Requirement 4: Dashboard Analytics

**User Story:** As an admin, I want to see platform statistics, so that I can monitor growth and engagement.

#### Acceptance Criteria

1. WHEN admin accesses dashboard, THE System SHALL display total user count
2. THE System SHALL display total blog count (approved and pending separately)
3. THE System SHALL display total Ram Naam count across all users
4. THE System SHALL display recent activity feed (new users, new blogs, milestones)
5. THE System SHALL display growth charts for users and content over time

### Requirement 5: Content Moderation

**User Story:** As an admin, I want to moderate user content, so that inappropriate content can be removed.

#### Acceptance Criteria

1. WHEN admin flags a blog as inappropriate, THE System SHALL hide it from public view
2. WHEN admin deletes a blog, THE System SHALL permanently remove it from database
3. THE System SHALL log all moderation actions with timestamp and admin username
4. WHEN admin views moderation history, THE System SHALL display all past actions

### Requirement 6: Announcement Management

**User Story:** As an admin, I want to create announcements, so that important messages reach all users.

#### Acceptance Criteria

1. WHEN admin creates an announcement, THE System SHALL display it on home page and dashboard
2. THE System SHALL support announcement types (info, warning, success)
3. WHEN admin sets announcement expiry, THE System SHALL auto-hide after expiry date
4. THE System SHALL allow admin to edit or delete active announcements
5. WHEN announcement is active, THE System SHALL show it in marquee on all pages

## Future Enhancements

- Email notifications to users on blog approval/rejection
- Bulk user operations (export, bulk email)
- Advanced analytics with charts
- Role-based permissions (super admin, moderator)
- Activity logs and audit trail
