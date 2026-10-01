
import mongoose from 'mongoose';

const ReminderCenterSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },

        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: [
                'task_reminder',
                'meeting_reminder',
                'overdue_task',
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            default: '',
            trim: true,
        },

        refModel: {
            type: String,
            enum: ['LeadTask', 'Meeting'],
            required: true,
        },

        refId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'refModel',
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        dismissedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

ReminderCenterSchema.index(
    {
        companyId: 1,
        recipient: 1,
        type: 1,
        refModel: 1,
        refId: 1,
    },
    { unique: true }
);

ReminderCenterSchema.index({
    companyId: 1,
    recipient: 1,
    dismissedAt: 1,
    createdAt: -1,
});

export default mongoose.models.ReminderCenter ||
    mongoose.model('ReminderCenter', ReminderCenterSchema);
