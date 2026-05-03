'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface BookingFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function BookingForm({ initialData, isEdit = false }: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        customerName: initialData?.customerName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        type: initialData?.type || 'JOURNEY',
        packageId: initialData?.packageId?._id || initialData?.packageId || '',
        pax: initialData?.pax || 1,
        pickupLocation: initialData?.pickupLocation || '',
        dateFrom: initialData?.dates?.from ? new Date(initialData.dates.from).toISOString().split('T')[0] : '',
        dateTo: initialData?.dates?.to ? new Date(initialData.dates.to).toISOString().split('T')[0] : '',
        totalCost: initialData?.totalCost || 0,
        paidAmount: initialData?.paidAmount || 0,
        notes: initialData?.notes || '',
        specialRequests: initialData?.specialRequests || '',
    });

    useEffect(() => {
        fetch('/api/packages?limit=200')
            .then(r => r.json())
            .then(data => setPackages(data.packages || []))
            .catch(console.error);
    }, []);

    const set = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.dateFrom || !formData.dateTo) {
            alert('Please select both start and end dates.');
            return;
        }
        if (new Date(formData.dateTo) < new Date(formData.dateFrom)) {
            alert('End date cannot be before start date.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customerName: formData.customerName,
                phone: formData.phone,
                email: formData.email || undefined,
                type: formData.type,
                packageId: formData.packageId || undefined,
                pax: Number(formData.pax),
                pickupLocation: formData.pickupLocation || undefined,
                dates: { from: formData.dateFrom, to: formData.dateTo },
                totalCost: Number(formData.totalCost),
                paidAmount: Number(formData.paidAmount),
                notes: formData.notes || undefined,
                specialRequests: formData.specialRequests || undefined,
            };

            const url = isEdit ? `/api/bookings/${initialData._id}` : '/api/bookings';
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`Error: ${data.error || 'Something went wrong'}`);
                return;
            }

            if (data.warning) alert(`⚠️ ${data.warning}`);

            router.push(isEdit ? `/dashboard/bookings/${initialData._id}` : '/dashboard/bookings');
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Failed to submit booking.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl';
    const labelCls = 'text-white/70 text-sm';

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
            {/* Customer Details */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-white">Customer Details</h2>
                    <p className="text-white/40 text-xs mt-0.5">Contact and identity information for this booking.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Full Name <span className="text-red-400">*</span></Label>
                        <Input
                            required
                            value={formData.customerName}
                            onChange={e => set('customerName', e.target.value)}
                            placeholder="e.g. John Silva"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Phone <span className="text-red-400">*</span></Label>
                        <Input
                            required
                            value={formData.phone}
                            onChange={e => set('phone', e.target.value)}
                            placeholder="+94 77 123 4567"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Email</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={e => set('email', e.target.value)}
                            placeholder="customer@example.com"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Passengers (Pax) <span className="text-red-400">*</span></Label>
                        <Input
                            type="number"
                            required
                            min={1}
                            value={formData.pax}
                            onChange={e => set('pax', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-white">Trip Details</h2>
                    <p className="text-white/40 text-xs mt-0.5">Package, dates, and pickup information.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Booking Type <span className="text-red-400">*</span></Label>
                        <Select value={formData.type} onValueChange={val => set('type', val)}>
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                <SelectItem value="JOURNEY" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Journey</SelectItem>
                                <SelectItem value="TRANSFER" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Transfer</SelectItem>
                                <SelectItem value="CUSTOM" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Package</Label>
                        <Select value={formData.packageId} onValueChange={val => set('packageId', val)}>
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                <SelectValue placeholder="Select a package (optional)" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white max-h-60 overflow-y-auto">
                                <SelectItem value="" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer text-white/40">No package</SelectItem>
                                {packages.map((p: any) => (
                                    <SelectItem key={p._id} value={p._id} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">
                                        {p.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Start Date <span className="text-red-400">*</span></Label>
                        <Input
                            type="date"
                            required
                            value={formData.dateFrom}
                            onChange={e => set('dateFrom', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>End Date <span className="text-red-400">*</span></Label>
                        <Input
                            type="date"
                            required
                            value={formData.dateTo}
                            onChange={e => set('dateTo', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label className={labelCls}>Pickup Location</Label>
                        <Input
                            value={formData.pickupLocation}
                            onChange={e => set('pickupLocation', e.target.value)}
                            placeholder="e.g. Bandaranaike International Airport"
                            className={inputCls}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-white">Pricing</h2>
                    <p className="text-white/40 text-xs mt-0.5">Total cost and advance payment amount in LKR.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Total Cost (LKR)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={formData.totalCost}
                            onChange={e => set('totalCost', e.target.value)}
                            placeholder="0"
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Advance / Paid Amount (LKR)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={formData.paidAmount}
                            onChange={e => set('paidAmount', e.target.value)}
                            placeholder="0"
                            className={inputCls}
                        />
                    </div>
                    {Number(formData.totalCost) > 0 && (
                        <div className="md:col-span-2 px-4 py-3 rounded-xl bg-antique-gold/[0.06] border border-antique-gold/20">
                            <p className="text-xs text-white/50">
                                Remaining balance: <span className="font-bold text-amber-400">
                                    LKR {Math.max(0, Number(formData.totalCost) - Number(formData.paidAmount)).toLocaleString()}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="liquid-glass-stat-dark rounded-2xl border border-white/[0.08] p-6 space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-white">Notes & Requests</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Internal Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={e => set('notes', e.target.value)}
                            placeholder="Internal staff notes..."
                            className="min-h-[100px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Special Requests</Label>
                        <Textarea
                            value={formData.specialRequests}
                            onChange={e => set('specialRequests', e.target.value)}
                            placeholder="Customer's special requests..."
                            className="min-h-[100px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="glass-outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" variant="glass" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEdit ? 'Save Changes' : 'Create Booking'}
                </Button>
            </div>
        </form>
    );
}
