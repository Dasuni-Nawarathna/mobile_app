'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteBookingButtonProps {
    bookingId: string;
    bookingNo: string;
}

export default function DeleteBookingButton({ bookingId, bookingNo }: DeleteBookingButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete booking ${bookingNo}? This action cannot be undone.`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to delete booking'}`);
                return;
            }
            router.push('/dashboard/bookings');
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Failed to delete booking.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            title={`Delete booking ${bookingNo}`}
        >
            {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
                <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
        </button>
    );
}
