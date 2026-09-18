// src/models/role.model.js

import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema(
    {
        module: {
            type: String,
            required: true,
        },

        actions: {
            type: [String],
            default: [],
        },

        scope: {
            type: String,
            enum: ['own', 'team', 'all'],
            default: 'own',
        },
    },
    { _id: false }
);

const RoleSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: '',
        },

        permissions: {
            type: [PermissionSchema],
            default: [],
        },

        isSystemRole: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

RoleSchema.index({ companyId: 1, name: 1 }, { unique: true });
export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
