# Supabase Security Setup for Dia do Lixo

## Overview
This document outlines the security configuration for the Dia do Lixo app, implementing read-only access for regular users and admin-only write access, while allowing users to manage their own notification preferences.

## Security Model

### 1. Admin System
- **Admin Role**: Users with `is_admin = true` in the `users` table
- **Admin Functions**: Can read, create, update, and delete all data
- **User Management**: Admins can manage all users and their admin status

### 2. Regular Users
- **Read Access**: Can view all public data (cities, zones, garbage types, collection schedules)
- **Notification Management**: Can manage their own device tokens and notification preferences
- **No Write Access**: Cannot modify core data (cities, zones, garbage types, schedules)

### 3. Device Token Management
- **User Control**: Users can register, update, and delete their own device tokens
- **Notification Preferences**: Users can opt in/out of notifications
- **Zone Selection**: Users can choose which zones they want notifications for

## Database Tables & Policies

### Core Data Tables (Read-Only for Users)
- `cities` - City information
- `zones` - Collection zones within cities  
- `garbage_types` - Types of garbage (paper, plastic, etc.)
- `collection_schedules` - When garbage is collected in each zone

**Policies**: Everyone can read, only admins can write

### User Data Tables (User-Controlled)
- `device_tokens` - User device registration and notification preferences
- `notification_schedules` - Scheduled notifications for users
- `users` - User profiles and admin status

**Policies**: Users can manage their own data, admins can manage all data

## Helper Functions

### `register_device_token(token, zone_id, device_id?, notifications_enabled?)`
Registers or updates a device token for push notifications.

### `update_notification_preferences(token, notifications_enabled)`
Updates notification preferences for a specific device token.

### `get_user_notification_preferences()`
Retrieves all notification preferences for the current user.

### `make_user_admin(email)`
Makes a user an admin (admin-only function).

## Usage Examples

### For Regular Users (Mobile App)

```typescript
// Register device for notifications
const deviceTokenId = await supabase.rpc('register_device_token', {
  p_token: 'expo-push-token-123',
  p_zone_id: 'zone-uuid-here',
  p_device_id: 'device-id-123',
  p_notifications_enabled: true
});

// Update notification preferences
await supabase.rpc('update_notification_preferences', {
  p_token: 'expo-push-token-123',
  p_notifications_enabled: false
});

// Get user's notification preferences
const preferences = await supabase.rpc('get_user_notification_preferences');
```

### For Admins (Admin Panel)

```typescript
// Make a user admin
await supabase.rpc('make_user_admin', {
  user_email: 'new-admin@example.com'
});

// Update collection schedules (admin only)
await supabase.from('collection_schedules').update({
  is_active: false
}).eq('id', 'schedule-id');

// Add new garbage type (admin only)
await supabase.from('garbage_types').insert({
  code: 'organic',
  name_pt: 'Orgânico',
  name_en: 'Organic',
  name_es: 'Orgánico',
  color_hex: '#8B4513',
  icon: 'leaf'
});
```

## Security Features

1. **Row Level Security (RLS)**: Enabled on all tables
2. **JWT-based Authentication**: Uses Supabase auth tokens
3. **Function Security**: Helper functions use `SECURITY DEFINER`
4. **Admin Verification**: All admin operations check `is_current_user_admin()`
5. **User Isolation**: Users can only access their own notification data

## Initial Setup

1. **Create Admin User**: Use the `make_user_admin()` function to create your first admin
2. **Test Policies**: Verify that regular users can read data but not write
3. **Test Notifications**: Ensure users can register devices and manage preferences

## Monitoring

- Monitor failed authentication attempts
- Track admin actions for audit purposes
- Monitor notification opt-out rates
- Review user registration patterns

## Best Practices

1. **Regular Security Audits**: Review RLS policies periodically
2. **Admin Access Control**: Limit admin user creation
3. **Token Management**: Implement token expiration and refresh
4. **Data Validation**: Validate all inputs in helper functions
5. **Error Handling**: Don't expose sensitive information in error messages

