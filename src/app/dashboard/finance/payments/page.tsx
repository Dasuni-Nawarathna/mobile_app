import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { formatLKR } from '@/lib/currency';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { EmptyStateCard } from '@/components/dashboard/EmptyStateCard';
import { CreditCard, Plus, CheckCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Payments | Dashboard' };
export const revalidate = 0;

async function getPayments() {
    try {
        await connectDB();
        const payments = await Payment.find({ isDeleted: { $ne: true } })
            .populate('bookingId', 'bookingNo customerName')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(payments));
    } catch {
        return [];
    }
}

const STATUS_PILL: Record<string, string> = {
    SUCCESS: 'status-pill-success',
    PENDING: 'status-pill-warning',
    FAILED: 'status-pill-danger',
    VOIDED: 'status-pill-danger',
    INITIATED: 'status-pill-info',
};

const METHOD_LABEL: Record<string, string> = {
    CASH: 'Cash',
    BANK: 'Bank Transfer',
    CARD_OTHER: 'Card',
    ONLINE: 'Online',
};

export default async function PaymentsListPage() {
    const payments = await getPayments();

    const successPayments = payments.filter((p: any) => p.status === 'SUCCESS' && p.type === 'PAYMENT');
    const totalCollected = successPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const refunds = payments.filter((p: any) => p.type === 'REFUND');
    const totalRefunded = refunds.reduce((s: number, p: any) => s + (p.amount || 0), 0);

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Payments"
                subtitle={`${payments.length} total records · ${successPayments.length} successful`}
                action={
                    <Link
                        href="/dashboard/finance/payments/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-antique-gold/10 border border-antique-gold/20 text-antique-gold text-sm font-medium hover:bg-antique-gold/20 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Record Payment
                    </Link>
                }
            />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Collected"
                    value={formatLKR(totalCollected)}
                    icon={CreditCard}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title="Successful Payments"
                    value={String(successPayments.length)}
                    icon={CheckCircle}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Refunds Issued"
                    value={formatLKR(totalRefunded)}
                    icon={TrendingDown}
                    accentColor="text-red-400"
                />
            </div>

            {/* Table */}
            <GlassPanel noPadding>
                {payments.length === 0 ? (
                    <EmptyStateCard
                        icon={CreditCard}
                        title="No payments recorded"
                        description="Record your first manual payment or wait for online transactions to appear."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Order / Ref</th>
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Booking</th>
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden md:table-cell">Customer</th>
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden lg:table-cell">Method</th>
                                    <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Amount</th>
                                    <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Type</th>
                                    <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                                    <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden lg:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p: any) => (
                                    <tr key={p._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono text-[10px] text-white/50">{p.orderId || p.reference || '—'}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {(p.bookingId as any)?._id ? (
                                                <Link
                                                    href={`/dashboard/bookings/${(p.bookingId as any)._id}`}
                                                    className="font-mono text-xs text-antique-gold/80 hover:text-antique-gold transition-colors"
                                                >
                                                    {(p.bookingId as any).bookingNo}
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-white/30">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell">
                                            <span className="text-xs text-white/50">{(p.bookingId as any)?.customerName || '—'}</span>
                                        </td>
                                        <td className="px-5 py-3.5 hidden lg:table-cell">
                                            <span className="text-xs text-white/40">
                                                {METHOD_LABEL[p.method] || p.provider || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className={`text-xs font-bold ${p.type === 'REFUND' ? 'text-red-400' : 'text-white/85'}`}>
                                                {p.type === 'REFUND' ? '−' : ''}{formatLKR(p.amount || 0)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`status-pill ${p.type === 'REFUND' ? 'status-pill-danger' : 'status-pill-info'}`}>
                                                {p.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`status-pill ${STATUS_PILL[p.status] || 'status-pill-neutral'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center hidden lg:table-cell">
                                            <span className="text-[10px] text-white/35">
                                                {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
