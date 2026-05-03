import BookingForm from '@/components/dashboard/BookingForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New Booking | Dashboard',
};

export default function NewBookingPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/bookings">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white">New Booking</h1>
                    <p className="text-sm text-white/50 font-light mt-1">Create a new booking or reservation for a customer.</p>
                </div>
            </div>

            <BookingForm />
        </div>
    );
}
