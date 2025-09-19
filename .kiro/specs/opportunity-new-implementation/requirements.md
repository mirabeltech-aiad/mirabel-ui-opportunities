# Requirements Document

## Introduction

This specification outlines the requirements for building a new, clean implementation of the Add/Edit Opportunity functionality. The goal is to replicate all existing functionality from the current opportunity system but with better code organization, TypeScript implementation, and modern UI components. The new implementation will be built in the `features/opportunity-new` directory and will maintain the same user experience while providing cleaner, more maintainable code that follows global design standards.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to create a new TypeScript-based Edit Opportunity page that replicates all existing functionality, so that we have cleaner, more maintainable code.

#### Acceptance Criteria

1. WHEN creating the new Edit Opportunity page THEN the system SHALL implement the route `/edit-opportunity/:id` using TypeScript
2. WHEN building the page structure THEN the system SHALL use the same tabbed interface with Proposal, Tasks, Activities, Stage Progression, and Stats tabs
3. WHEN implementing form handling THEN the system SHALL maintain all existing validations and business logic
4. WHEN integrating APIs THEN the system SHALL use the same API endpoints and data structures as the existing implementation
5. WHEN designing the UI THEN the system SHALL use modern components like FloatingLabelInput, GradientTabBar, and the shared UI library

### Requirement 2

**User Story:** As a user, I want the new Edit Opportunity page to have the same functionality as the existing page, so that my workflow remains unchanged.

#### Acceptance Criteria

1. WHEN loading an opportunity THEN the system SHALL fetch and display all opportunity details including basic info, company details, and sales details
2. WHEN editing opportunity fields THEN the system SHALL apply the same validation rules including required fields, conditional validations, and business logic
3. WHEN changing opportunity status THEN the system SHALL show confirmation dialogs for Won/Lost status changes
4. WHEN updating stage or probability THEN the system SHALL auto-calculate forecast revenue and maintain stage-probability alignment
5. WHEN saving changes THEN the system SHALL use the same API endpoints and handle success/error responses appropriately

### Requirement 3

**User Story:** As a user, I want all tab functionalities to work exactly as they do in the current system, so that I can manage proposals, tasks, activities, stage progression, and view stats.

#### Acceptance Criteria

1. WHEN using the Proposal tab THEN the system SHALL allow linking/unlinking proposals with the same search and selection functionality
2. WHEN using the Tasks tab THEN the system SHALL support creating, viewing, and managing tasks with user assignment and priority settings
3. WHEN viewing the Activities tab THEN the system SHALL display timeline and audit trail information with complete change history
4. WHEN using Stage Progression THEN the system SHALL show stage timeline, progression rules, and allow stage updates with proper validations
5. WHEN viewing Stats THEN the system SHALL display communication stats, time analytics, stage metrics, and contact metrics

### Requirement 4

**User Story:** As a developer, I want the new implementation to use modern UI components and follow consistent design patterns, so that the code is maintainable and follows project standards.

#### Acceptance Criteria

1. WHEN implementing form inputs THEN the system SHALL use FloatingLabelInput, FloatingLabelSelect, and FloatingLabelSearchInput components
2. WHEN creating the tab interface THEN the system SHALL use GradientTabBar with TabItem components
3. WHEN building form controls THEN the system SHALL use the shared UI library components (Input, Textarea, Button, Checkbox, RadioGroup, Switch, SimpleFloatingSelect, SimpleSelect)
4. WHEN organizing code THEN the system SHALL follow TypeScript best practices with proper type definitions and interfaces
5. WHEN structuring components THEN the system SHALL create reusable, well-organized components that avoid code duplication

### Requirement 5

**User Story:** As a developer, I want the new implementation to maintain all existing business logic and validations, so that data integrity and business rules are preserved.

#### Acceptance Criteria

1. WHEN validating required fields THEN the system SHALL enforce the same validation rules for Opportunity Name, Company Name, Status, Stage, Amount, Probability, Projected Close Date, Opportunity Type, Created By, and Created Date
2. WHEN applying conditional validations THEN the system SHALL require Lost Reason and Notes for Lost status, align stage with probability, and handle proposal-linked field restrictions
3. WHEN implementing business logic THEN the system SHALL maintain stage-probability alignment, status change confirmations, stage restrictions, and forecast revenue calculations
4. WHEN handling API integration THEN the system SHALL use all existing API endpoints with the same request/response patterns
5. WHEN managing state THEN the system SHALL implement proper form state management with validation error handling and real-time updates