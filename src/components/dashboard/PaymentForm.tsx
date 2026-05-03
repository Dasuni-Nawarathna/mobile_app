'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2 } from 'lucide-react';

interface PaymentFormProps {
    bookingIdPrefill?: string;
}

export default function PaymentForm({ bookingIdPrefill }: PaymentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingSuggestions, setBookingSuggestions] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [searching, setSearching] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        type: 'PAYMENT',
        method: 'CASH',
        reference: '',
        paidAt: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const set = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

    useEffect(() => {
        if (bookingIdPrefill) {
            fetch(`/api/bookings/${bookingIdPrefill}`)
                .then(r => r.json())
                .then(data => {
                    if (data.booking) {
                        setSelectedBooking(data.booking);
                        setBookingSearch(data.booking.bookingNo);
                        // Pre-fill with remaining balance
                        if (data.booking.remainingBalance > 0) {
                            set('amount', String(data.booking.remainingBalance));
                        }
                    }
                })
                .catch(console.error);
        }
    }, [bookingIdPrefill]);

    const searchBookings = useCallback(async (q: string) => {
        if (!q || q.length < 2) { setBookingSuggestions([]); return; }
        setSearching(true);
        try {
            const res = await fetch(`/api/bookings?search=${encodeURIComponent(q)}&limit=8`);
            const data = await res.json();
            setBookingSuggestions(data.bookings || []);
        } catch { setBookingSuggestions([]); }
        finally { setSearching(false); }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => searchBookings(bookingSearch), 300);
        return () => clearTimeout(t);
    }, [bookingSearch, searchBookings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) { alert('Please select a booking.'); return; }
        if (!formData.amount || Number(formData.amount) <= 0) { alert('Please enter a valid payment amount.'); return; }

        setLoading(true);
        try {
            const payload = {
                bookingId: selectedBooking._id,
                amount: Number(formData.amount),
                type: formData.type,
                method: formData.method,
                reference: formData.reference || undefined,
                paidAt: formData.paidAt || undefined,
                notes: formData.notes || undefined,
            };

            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) { alert(`Error: ${data.error || 'Failed to record payment'}`); return; }

            router.push('/dashboard/finance/payments');
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Failed to record payment.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl';
    const labelCls = 'text-white/70 text-sm';

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
            {/* Booking Selection */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-white">Linked Booking</h2>
                    <p className="text-white/40 text-xs mt-0.5">Search by booking number or customer name.</p>
                </div>
                <div className="relative">
                    <Label className={labelCls}>Search Booking <span className="text-red-400">*</span></Label>
                    <div className="relative mt-1.5">
                        <Input
                            value={bookingSearch}
                            onChange={e => { setBookingSearch(e.target.value); setSelectedBooking(null); }}
                            placeholder="YC-01001 or customer name..."
                            className={inputCls}
                        />
                        {searching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-white/30" />
                        )}
                    </div>
                    {bookingSuggestions.length > 0 && !selectedBooking && (
                        <div className="absolute z-10 mt-1 w-full rounded-xl bg-[#0a1410] border border-white/[0.08] shadow-xl overflow-hidden">
                            {bookingSuggestions.map((b: any) => (
                                <button
                                    key={b._id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedBooking(b);
                                        setBookingSearch(b.bookingNo);
                                        setBookingSuggestions([]);
                                        if (b.remainingBalance > 0) set('amount', String(b.remainingBalance));
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-white/[0.06] transition-colors border-b border-white/[0.04] last:border-b-0"
                                >
                                    <p className="text-xs font-mono font-semibold text-white">{b.bookingNo}</p>
                                    <p className="text-[10px] text-white/40">
                                        {b.customerName} · {b.status}
                                        {b.remainingBalance > 0 ? ` · Balance: LKR ${b.remainingBalance.toLocaleString()}` : ''}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                    {selectedBooking && (
                        <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
                            <div className="flex-1">
                                <p className="text-xs font-mono font-semibold text-emerald-300">{selectedBooking.bookingNo}</p>
                                <p className="text-[10px] text-white/50 mt-0.5">
                                    {selectedBooking.customerName} · {selectedBooking.status}
                                    {selectedBooking.remainingBalance > 0 && (
                                        <span className="text-amber-400/80 ml-2">Balance: LKR {selectedBooking.remainingBalance?.toLocaleString()}</span>
                                    )}
                                </p>
                            </div>
                            <button type="button" onClick={() => { setSelectedBooking(null); setBookingSearch(''); }} className="text-white/30 hover:text-white/60 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Details */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-white">Payment Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Amount (LKR) <span className="text-red-400">*</span></Label>
                        <Input
                            type="number"
                            required
                            min={1}
                            value={formData.amount}
                            onChange={e => set('amount', e.target.value)}
                            placeholder="e.g. 50000"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Payment Type <span className="text-red-400">*</span></Label>
                        <Select value={formData.type} onValueChange={val => set('type', val)}>
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                <SelectItem value="PAYMENT" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Payment</SelectItem>
                                <SelectItem value="REFUND" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Refund</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Payment Method <span className="text-red-400">*</span></Label>
                        <Select value={formData.method} onValueChange={val => set('method', val)}>
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                <SelectItem value="CASH" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Cash</SelectItem>
                                <SelectItem value="BANK" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Bank Transfer</SelectItem>
                                <SelectItem value="CARD_OTHER" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Card</SelectItem>
                                <SelectItem value="ONLINE" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Online</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Payment Date</Label>
                        <Input
                            type="date"
                            value={formData.paidAt}
                            onChange={e => set('paidAt', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label className={labelCls}>Reference / Transaction ID</Label>
                        <Input
                            value={formData.reference}
                            onChange={e => set('reference', e.target.value)}
                            placeholder="e.g. TXN-123456 or bank slip number"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label className={labelCls}>Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={e => set('notes', e.target.value)}
                            placeholder="Any additional notes about this payment..."
                            className="min-h-[80px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="glass-outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" variant="glass" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Record Payment
                </Button>
            </div>
        </form>
    );
}
