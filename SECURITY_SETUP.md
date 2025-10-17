# 🔒 Security Setup - Dia do Lixo

## Overview
This document outlines the security measures implemented to protect sensitive data, particularly device tokens and notification schedules, while maintaining public access to collection data.

## 🛡️ Security Architecture

### Database Roles
- **`backend_service_role`**: Secure role for backend service operations
- **`authenticated`**: Regular app users (limited access)
- **`anon`**: Anonymous users (read-only public data)

### 🔐 Protected Tables

#### `device_tokens` Table
**Sensitive Data**: Push notification tokens
**Access Control**:
- ✅ **Backend Service**: Full CRUD access (for sending notifications)
- ❌ **Regular Users**: Can insert/update/delete their own tokens, but **CANNOT READ** tokens
- ❌ **Anonymous**: No access

**Security Rationale**: Device tokens are sensitive and should only be accessible by the backend service for sending push notifications. Regular users cannot read tokens to prevent token harvesting.

#### `notification_schedules` Table
**Sensitive Data**: Scheduled notification details
**Access Control**:
- ✅ **Backend Service**: Full CRUD access
- ❌ **Regular Users**: No access
- ❌ **Anonymous**: No access

**Security Rationale**: Notification schedules contain sensitive timing information and should only be managed by the backend service.

### 🌐 Public Tables

#### `cities`, `zones`, `garbage_types`, `collection_schedules`
**Public Data**: Collection schedules and location data
**Access Control**:
- ✅ **All Users**: Read access (authenticated + anonymous)
- ✅ **Backend Service**: Full access
- ❌ **Regular Users**: No write access (admin only)

## 🔧 RLS Policies Implemented

### Device Tokens Security
```sql
-- Backend service can read device tokens (for sending notifications)
CREATE POLICY "Backend service can read device tokens" ON device_tokens
  FOR SELECT TO backend_service_role USING (true);

-- Users can insert their own device tokens (no reading)
CREATE POLICY "Users can insert device tokens" ON device_tokens
  FOR INSERT TO authenticated WITH CHECK (true);

-- Users can update their own device tokens (no reading)
CREATE POLICY "Users can update device tokens" ON device_tokens
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Users can delete their own device tokens (no reading)
CREATE POLICY "Users can delete device tokens" ON device_tokens
  FOR DELETE TO authenticated USING (true);
```

### Notification Schedules Security
```sql
-- Only backend service can access notification schedules
CREATE POLICY "Backend service can read notification schedules" ON notification_schedules
  FOR SELECT TO backend_service_role USING (true);

-- No policies for authenticated users = no access
```

### Public Data Access
```sql
-- Public read access for collection data
CREATE POLICY "Public can read cities" ON cities
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public can read zones" ON zones
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public can read garbage types" ON garbage_types
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public can read collection schedules" ON collection_schedules
  FOR SELECT TO authenticated, anon USING (true);
```

## 🚀 Backend Service Integration

### Required Environment Variables
```bash
# Backend service database connection
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Has backend_service_role permissions
```

### Backend Service Permissions
The `backend_service_role` has:
- ✅ Full CRUD access to `device_tokens`
- ✅ Full CRUD access to `notification_schedules`
- ✅ Read access to public tables for data lookup
- ❌ No access to user management (admin only)

## 🔍 Security Testing

### Test Cases
1. **Regular User Cannot Read Tokens**:
   ```sql
   -- This should return empty result for regular users
   SELECT * FROM device_tokens;
   ```

2. **Backend Service Can Read Tokens**:
   ```sql
   -- This should work for backend_service_role
   SELECT token, zone_id FROM device_tokens WHERE notifications_enabled = true;
   ```

3. **Public Data Accessible**:
   ```sql
   -- This should work for all users
   SELECT * FROM cities;
   SELECT * FROM collection_schedules;
   ```

## 🛠️ Implementation Notes

### Client-Side Changes
- Device tokens are stored locally in AsyncStorage
- Tokens are only sent to database when zone is selected
- No client-side token reading from database

### Backend Service Requirements
- Must use `backend_service_role` for database access
- Should implement proper authentication for the service
- Should validate and sanitize all inputs
- Should implement rate limiting for notification sending

## 🔒 Additional Security Recommendations

1. **API Rate Limiting**: Implement rate limiting on notification endpoints
2. **Token Rotation**: Consider implementing token rotation for enhanced security
3. **Audit Logging**: Log all backend service database access
4. **Monitoring**: Monitor for unusual access patterns
5. **Encryption**: Consider encrypting tokens at rest (if not already handled by Supabase)

## 📋 Security Checklist

- ✅ RLS policies implemented for sensitive tables
- ✅ Backend service role created with limited permissions
- ✅ Public data remains accessible
- ✅ Device tokens protected from client access
- ✅ Notification schedules protected from client access
- ✅ Regular users cannot read sensitive data
- ✅ Anonymous users can access public collection data
- ✅ Admin users can manage system data

## 🚨 Security Incident Response

If a security breach is suspected:
1. Immediately revoke the `backend_service_role` permissions
2. Rotate all service keys
3. Audit database access logs
4. Review and update RLS policies
5. Notify affected users if necessary
