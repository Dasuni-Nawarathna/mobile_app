import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { formatLKR } from '@/lib/currency';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { EmptyStateCard } from '@/components/dashboard/EmptyStateCard';
import { FileText, Plus, CheckCircle, Clock, Ban } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Invoices | Dashboard' };
export const revalidate = 0;

async function getInvoices(status?: string) {
    try {
        await connectDB();
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (status) filter.status = status;
        const invoices = await Invoice.find(filter)
            .populate('bookingId', 'bookingNo customerName')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(invoices));
    } catch {
        return [];
    }
}

type SearchParams = Promise<{ status?: string }>;

export default async function InvoicesListPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const activeStatus = params.status || '';

    const allInvoices = await getInvoices();
    const filtered = activeStatus ? allInvoices.filter((i: any) => i.status === activeStatus) : allInvoices;

    const draftCount = allInvoices.filter((i: any) => i.status === 'DRAFT').length;
    const finalCount = allInvoices.filter((i: any) => i.status === 'FINAL').length;
    const voidCount = allInvoices.filter((i: any) => i.status === 'VOID').length;

    const statusPillMap: Record<string, string> = {
        DRAFT: 'status-pill-warning',
        FINAL: 'status-pill-success',
        VOID: 'status-pill-danger',
    };

    const STATUSES = ['', 'DRAFT', 'FINAL', 'VOID'];
    const LABELS: Record<string, string> = { '': 'All', DRAFT: 'Draft', FINAL: 'Final', VOID: 'Void' };

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Invoices"
                subtitle={`${allInvoices.length} total • ${draftCount} draft • ${finalCount} final`}
                action={
                    <Link
                        href="/dashboard/finance/invoices/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-antique-gold/10 border border-antique-gold/20 text-antique-gold text-sm font-medium hover:bg-antique-gold/20 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> New Invoice
                    </Link>
                }
            />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Draft" value={String(draftCount)} icon={Clock} accentColor="text-amber-400" />
                <StatCard title="Finalized" value={String(finalCount)} icon={CheckCircle} accentColor="text-emerald-400" />
                <StatCard title="Voided" value={String(voidCount)} icon={Ban} accentColor="text-red-400" />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1.5 flex-wrap">
                {STATUSES.map(s => (
                    <Link
                        key={s}
                        href={s ? `/dashboard/finance/invoices?status=${s}` : '/dashboard/finance/invoices'}
                        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
                            activeStatus === s
                                ? 'bg-antique-gold/10 border-antique-gold/30 text-antique-gold'
                                : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
                        }`}
                    >
                        {LABELS[s]}
                    </Link>
                ))}
            </div>

            {/* Table */}
            <GlassPanel noPadding>
                {filtered.length === 0 ? (
                    <EmptyStateCard
                        icon={FileText}
                        title="No invoices found"
                        description="Create your first invoice or adjust the status filter."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Invoice #</th>
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Booking</th>
                                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden md:table-cell">Customer</th>
                                    <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Total</th>
                                    <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                                    <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Date</th>
                                    <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((inv: any) => (
                                    <tr key={inv._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono font-semibold text-white/75 text-xs">{inv.invoiceNo}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-white/60 font-mono">
                                                {(inv.bookingId as any)?.bookingNo || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell">
                                            <span className="text-xs text-white/50">
                                                {(inv.bookingId as any)?.customerName || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="text-xs font-bold text-white/85">{formatLKR(inv.total || 0)}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`status-pill ${statusPillMap[inv.status] || 'status-pill-neutral'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="text-[10px] text-white/35">
                                                {new Date(inv.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <Link
                                                href={`/dashboard/finance/invoices/${inv._id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-antique-gold hover:border-antique-gold/30 hover:bg-antique-gold/[0.06] transition-colors"
                                            >
                                                View
                                            </Link>
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
