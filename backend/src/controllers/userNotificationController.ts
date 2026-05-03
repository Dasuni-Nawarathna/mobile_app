import { Request, Response } from 'express';

// ═══════════════════════════════════════════════════════════
// USER CONTROLLER
// ═══════════════════════════════════════════════════════════

export async function listUsers(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20, role } = req.query;

    // TODO: Connect to User model
    const users = [
      { _id: '1', email: 'user@example.com', firstName: 'John', lastName: 'Doe', role: 'USER' },
    ];

    res.json({ data: users, pagination: { page, limit, total: users.length } });
  } catch (error) {
    console.error('❌ Error listing users:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to list users' } });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: { status: 400, message: 'Missing required fields' } });
    }

    // TODO: Create user in database
    const user = { _id: 'new-user', email, firstName, lastName, role: 'USER' };

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to create user' } });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Fetch user from database
    const user = { _id: id, email: 'user@example.com', firstName: 'John' };

    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to fetch user' } });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // TODO: Update user in database
    const user = { _id: id, ...updates };

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to update user' } });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Delete user from database
    res.json({ message: 'User deleted successfully', id });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to delete user' } });
  }
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION CONTROLLER
// ═══════════════════════════════════════════════════════════

export async function listNotifications(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const user = (req as any).user;

    // TODO: Fetch notifications for user from database
    const notifications = [
      { _id: '1', userId: user.userId, title: 'Booking Confirmed', message: 'Your booking is confirmed' },
    ];

    res.json({ data: notifications, pagination: { page, limit, total: notifications.length } });
  } catch (error) {
    console.error('❌ Error listing notifications:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to list notifications' } });
  }
}

export async function createNotification(req: Request, res: Response) {
  try {
    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ error: { status: 400, message: 'Missing required fields' } });
    }

    // TODO: Create notification in database
    const notification = { _id: 'new-notif', userId, title, message, type };

    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to create notification' } });
  }
}

export async function getNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Fetch notification from database
    const notification = { _id: id, title: 'Booking Confirmed', message: 'Your booking is confirmed' };

    res.json(notification);
  } catch (error) {
    console.error('❌ Error fetching notification:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to fetch notification' } });
  }
}

export async function updateNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    // TODO: Update notification in database
    const notification = { _id: id, isRead };

    res.json({ message: 'Notification updated', notification });
  } catch (error) {
    console.error('❌ Error updating notification:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to update notification' } });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // TODO: Delete notification from database
    res.json({ message: 'Notification deleted', id });
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    res.status(500).json({ error: { status: 500, message: 'Failed to delete notification' } });
  }
}
