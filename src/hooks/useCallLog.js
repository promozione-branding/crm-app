'use client';

import { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Log a call when the user clicks "Call".
 * Automatically creates a history entry.
 */
export function useCallLog() {
    const logCall = useCallback(async ({ refId, phoneNumber, refModel = 'Lead', source = 'mobile_card' }) => {
        if (!refId || !phoneNumber) return null;

        try {
            const res = await axios.post(
                '/api/user/call',
                {
                    refId,
                    phoneNumber,
                    refModel,
                    source,
                    status: 'initiated',
                },
                { withCredentials: true }
            );

            return res.data?.data || null;
        } catch (err) {
            console.error('LOG CALL ERROR:', err);
            toast.error(err.response?.data?.message || 'Failed to log call.');
            return null;
        }
    }, []);

    return { logCall };
}
