// src/models/call.model.js

import mongoose from 'mongoose';

const CallSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },

        // ---- WHAT was called (polymorphic)
        // Lead is the primary target today, but this scales to Contact, Customer etc.
        refModel: {
            type: String,
            enum: ['Lead', 'Contact'],
            default: 'Lead',
            required: true,
        },

        refId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'refModel',
            index: true,
        },

        // ---- WHO called (the logged-in user)
        callerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Snapshot the caller's role at time of call,
        // so history stays accurate even if role changes later
        callerRole: {
            type: String,
            default: '',
        },

        // ---- Phone number dialled (from the lead)
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },

        // ---- WHEN
        calledAt: {
            type: Date,
            default: Date.now,
            index: true,
        },

        // ---- STATUS
        // 'initiated' when the tel: link is clicked
        // 'completed' / 'missed' / 'busy' / 'no_answer' when updated
        status: {
            type: String,
            enum: ['initiated', 'completed', 'missed', 'busy', 'no_answer', 'failed'],
            default: 'initiated',
            index: true,
        },

        // ---- OUTCOME / DISPOSITION (updated after the call)
        outcome: {
            type: String,
            enum: [
                '',
                'connected',
                'not_connected',
                'interested',
                'not_interested',
                'callback',
                'wrong_number',
                'converted',
            ],
            default: '',
        },

        // ---- DURATION (seconds) — filled by user after call
        durationSeconds: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ---- NOTES / REMARKS
        notes: {
            type: String,
            trim: true,
            default: '',
        },

        // ---- FOLLOW-UP
        followUpAt: {
            type: Date,
            default: null,
        },

        // ---- META (device / source)
        source: {
            type: String,
            enum: ['mobile_card', 'desktop_table', 'lead_detail', 'manual'],
            default: 'mobile_card',
        },
    },
    { timestamps: true }
);

// ---- Indexes for fast lookups
CallSchema.index({ companyId: 1, refId: 1, calledAt: -1 });
CallSchema.index({ companyId: 1, callerId: 1, calledAt: -1 });
CallSchema.index({ refId: 1, calledAt: -1 });

export default mongoose.models.Call || mongoose.model('Call', CallSchema);