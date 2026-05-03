'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface LineItem {
    label: string;
    qty: number;
    unitPrice: number;
}

interface InvoiceFormProps {
    bookingIdPrefill?: string;
}

export default function InvoiceForm({ bookingIdPrefill }: InvoiceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingSuggestions, setBookingSuggestions] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [searching, setSearching] = useState(false);

    const [items, setItems] = useState<LineItem[]>([
        { label: '', qty: 1, unitPrice: 0 },
    ]);
    const [discount, setDiscount] = useState(0);
    const [advanceRequired, setAdvanceRequired] = useState('');
    const [notes, setNotes] = useState('');

    // Prefill booking if provided
    useEffect(() => {
        if (bookingIdPrefill) {
            fetch(`/api/bookings/${bookingIdPrefill}`)
                .then(r => r.json())
                .then(data => {
                    if (data.booking) {
                        setSelectedBooking(data.booking);
                        setBookingSearch(data.booking.bookingNo);
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

    const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const total = Math.max(0, subtotal - (discount || 0));

    const addItem = () => setItems(prev => [...prev, { label: '', qty: 1, unitPrice: 0 }]);
    const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: keyof LineItem, value: any) => {
        setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) { alert('Please select a booking first.'); return; }
        if (items.some(i => !i.label.trim())) { alert('All line items must have a description.'); return; }

        setLoading(true);
        try {
            const payload = {
                bookingId: selectedBooking._id,
                items: items.map(i => ({ label: i.label, qty: Number(i.qty), unitPrice: Number(i.unitPrice) })),
                discount: Number(discount) || 0,
                advanceRequired: advanceRequired ? Number(advanceRequired) : undefined,
                notes: notes || undefined,
            };

            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) { alert(`Error: ${data.error || 'Failed to create invoice'}`); return; }

            router.push(`/dashboard/finance/invoices/${data.invoice._id}`);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Failed to create invoice.');
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
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-white/[0.06] transition-colors border-b border-white/[0.04] last:border-b-0"
                                >
                                    <p className="text-xs font-mono font-semibold text-white">{b.bookingNo}</p>
                                    <p className="text-[10px] text-white/40">{b.customerName} · {b.status}</p>
                                </button>
                            ))}
                        </div>
                    )}
                    {selectedBooking && (
                        <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
                            <div className="flex-1">
                                <p className="text-xs font-mono font-semibold text-emerald-300">{selectedBooking.bookingNo}</p>
                                <p className="text-[10px] text-white/50 mt-0.5">{selectedBooking.customerName} · {selectedBooking.status}</p>
                            </div>
                            <button type="button" onClick={() => { setSelectedBooking(null); setBookingSearch(''); }} className="text-white/30 hover:text-white/60 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Line Items */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-white">Line Items</h2>
                        <p className="text-white/40 text-xs mt-0.5">Services or charges to bill the customer.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-antique-gold/10 border border-antique-gold/20 text-antique-gold hover:bg-antique-gold/20 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add Line
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] text-white/30 uppercase tracking-wide px-1">
                        <span className="col-span-6">Description</span>
                        <span className="col-span-2 text-center">Qty</span>
                        <span className="col-span-3 text-right">Unit Price (LKR)</span>
                        <span className="col-span-1" />
                    </div>
                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-6">
                                <Input
                                    required
                                    value={item.label}
                                    onChange={e => updateItem(idx, 'label', e.target.value)}
                                    placeholder="e.g. Accommodation · 3 nights"
                                    className={inputCls}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    min={1}
                                    required
                                    value={item.qty}
                                    onChange={e => updateItem(idx, 'qty', e.target.value)}
                                    className={inputCls + ' text-center'}
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    min={0}
                                    required
                                    value={item.unitPrice}
                                    onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                                    className={inputCls + ' text-right'}
                                />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                {items.length > 1 && (
                                    <button type="button" onClick={() => removeItem(idx)} className="text-red-400/60 hover:text-red-400 transition-colors p-1.5">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/50">Subtotal</span>
                        <span className="text-sm font-semibold text-white/80">LKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Label className={labelCls + ' whitespace-nowrap'}>Discount (LKR)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={discount}
                            onChange={e => setDiscount(Number(e.target.value))}
                            className="max-w-[160px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-9 rounded-xl text-right"
                        />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                        <span className="text-sm font-bold text-white">Total</span>
                        <span className="text-lg font-bold text-antique-gold">LKR {total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Extra fields */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-5">
                <h2 className="text-base font-semibold text-white">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Advance Required (LKR)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={advanceRequired}
                            onChange={e => setAdvanceRequired(e.target.value)}
                            placeholder="e.g. 50000"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label className={labelCls}>Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Additional terms, payment instructions, etc."
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
                    Create Invoice
                </Button>
            </div>
        </form>
    );
}
