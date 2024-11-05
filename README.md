# Project Updates

## Features Implemented

1. **JWT Registration Guard**: Secure user authentication using JSON Web Tokens.
2. **Throttler Guard for Rate Limiting**: Prevent abuse by limiting login attempts.
3. **Unit Tests for Controller**: Added unit tests for the `AuthController` to ensure functionality.
4. **Husky Integration**: Configured Husky for pre-commit actions to enforce code quality.
5. **GitHub Actions Workflows**: Set up CI/CD workflows using GitHub Actions.
6. **Model Switching Logic**:
    - Implemented functionality for switching AI models.
    - Requires `modelId` input to update the selected model in the database.
    - **Endpoint Example**:
   ```json
   {
     "modelId": 1
   }

6. **Restricted JWT Validation for Endpoints**:
    - Implemented JWT validation for secure access control on specific endpoints.
    - Includes endpoints for logout and ai-model/switch.

## Useful Links
- [API Documentation](https://bothubtech-production.up.railway.app/api)

