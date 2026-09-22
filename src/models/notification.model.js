// src/models/notification.model.js

import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },

        // Who should see this notification
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Who triggered it (admin who assigned)
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        type: {
            type: String,
            enum: ['lead_assigned', 'task_assigned'],
            required: true,
        },

        title: { type: String, required: true },
        message: { type: String, default: '' },

        // Points to either a Lead or a Task
        refModel: {
            type: String,
            enum: ['Lead', 'LeadTask'],
            required: true,
        },

        refId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'refModel',
        },

        isRead: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
