# Notification System Documentation

## Overview

The Dia do Lixo app includes a comprehensive push notification system that allows users to receive reminders about upcoming garbage collection in their selected zone.

## Database Schema

### `device_tokens` Table
Stores Expo push notification tokens for each device:
- `id`: UUID primary key
- `token`: Expo push notification token (unique)
- `device_id`: Device identifier for tracking
- `user_id`: For future user authentication (currently null)
- `zone_id`: Associated zone ID for notifications
- `notifications_enabled`: Boolean flag for notification status
- `created_at` / `updated_at`: Timestamps

### `notification_schedules` Table
Tracks scheduled notifications:
- `id`: UUID primary key
- `device_token_id`: Reference to device_tokens table
- `garbage_type_id`: Reference to garbage_types table
- `scheduled_date`: Date of actual garbage collection
- `notification_date`: When the notification should be sent (day before)
- `expo_notification_id`: Expo's local notification ID
- `status`: scheduled/sent/cancelled/failed
- `created_at` / `updated_at`: Timestamps

## Notification Flow

### 1. User Enables Notifications
1. User toggles notifications in Settings
2. App requests notification permissions
3. Expo push token is generated and stored locally
4. Token is stored in Supabase `device_tokens` table
5. Notifications are scheduled for the user's zone

### 2. User Changes Zone
1. User selects new zone in Settings
2. `device_tokens` table is updated with new `zone_id`
3. Old notifications are cancelled
4. New notifications are scheduled for the new zone

### 3. Notification Scheduling
- Notifications are scheduled for the next 4 weeks
- Each notification is sent the day before collection at 6 PM
- Only active collection schedules are considered
- Week intervals are respected (e.g., bi-weekly collections)

### 4. Notification Content
- **Title**: "Dia do Lixo - Recolha Amanhã"
- **Body**: "Amanhã será recolhido: [Garbage Type]"
- **Data**: Includes garbage type, collection date, and zone ID

## Implementation Details

### NotificationService Class
Located in `src/services/notificationService.ts`, provides:

- `registerForPushNotifications()`: Request permissions and get Expo token
- `storeDeviceToken(token, zoneId)`: Store/update token in database
- `updateDeviceTokenZone(token, newZoneId)`: Update zone for existing token
- `scheduleCollectionNotifications()`: Schedule notifications for a zone
- `cancelAllNotifications()`: Cancel all scheduled notifications
- `enableNotifications(token)` / `disableNotifications(token)`: Toggle notifications

### Settings Store Integration
The Zustand store (`src/store/useSettingsStore.ts`) handles:
- Automatic token registration when notifications are enabled
- Zone change handling with notification updates
- Local storage synchronization

### App Lifecycle
- Notifications are initialized when the app starts
- Token is registered automatically if notifications are enabled
- Notifications are rescheduled when zone changes
- Settings changes trigger immediate notification updates

## Usage Examples

### Enable Notifications
```typescript
const { setNotificationsEnabled } = useSettingsStore();
await setNotificationsEnabled(true);
```

### Change Zone (with notifications)
```typescript
const { setZoneId } = useSettingsStore();
await setZoneId('new-zone-id'); // Automatically updates notifications
```

### Manual Notification Scheduling
```typescript
import { notificationService } from '../services/notificationService';

await notificationService.scheduleCollectionNotifications(
  zoneId,
  schedules,
  garbageTypes
);
```

## Testing

### Debug Component
Use `NotificationDebug` component to:
- Check token registration status
- Test notification functionality
- Debug notification settings

### Manual Testing
1. Enable notifications in Settings
2. Select a zone
3. Check that notifications are scheduled
4. Change zones and verify old notifications are cancelled
5. Disable notifications and verify all are cancelled

## Future Enhancements

### Server-Side Notifications
- Implement server-side notification sending
- Use Expo Push API for remote notifications
- Add notification analytics and delivery tracking

### Advanced Features
- Custom notification times
- Multiple notification types (reminders, updates)
- Notification history
- Smart notifications based on user behavior

### User Management
- User authentication integration
- Multiple devices per user
- Notification preferences per user

## Troubleshooting

### Common Issues
1. **Notifications not working**: Check device permissions
2. **Token not registered**: Verify Expo configuration
3. **Wrong zone notifications**: Check zone selection in settings
4. **Notifications not scheduled**: Verify collection schedules exist

### Debug Steps
1. Check device token in AsyncStorage
2. Verify database records in `device_tokens` table
3. Check scheduled notifications in `notification_schedules` table
4. Test with `NotificationDebug` component

