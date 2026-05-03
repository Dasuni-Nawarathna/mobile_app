import InvoiceForm from '@/components/dashboard/InvoiceForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Invoice | Dashboard' };

type SearchParams = Promise<{ bookingId?: string }>;

export default async function NewInvoicePage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/finance/invoices">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white">New Invoice</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Create a draft invoice linked to a booking.</p>
                </div>
            </div>

            <InvoiceForm bookingIdPrefill={params.bookingId} />
        </div>
    );
}
