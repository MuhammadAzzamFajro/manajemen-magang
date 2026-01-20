import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Calendar, User, Clock, Building2, ArrowRight, Rocket } from 'lucide-react';
import { format } from 'date-fns';

interface Magang {
    id: number;
    status: string;
    tanggal_mulai?: string;
    judul_magang?: string;
    deskripsi?: string;
    dudi?: {
        nama: string;
    };
    guruPembimbing?: {
        name: string;
    };
}

interface SiswaMagangProps {
    magangs: Magang[];
}

export default function SiswaMagang({ magangs }: SiswaMagangProps) {
    const [isAjukanModalOpen, setIsAjukanModalOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Aktif':
                return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>;
            case 'Selesai':
                return <Badge variant="default">Selesai</Badge>;
            case 'Pending':
                return <Badge variant="secondary">Menunggu</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Status Magang" />
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Status Magang</h1>
                <p className="text-muted-foreground text-sm">Pantau perkembangan program magang Anda</p>
            </div>

            {/* Magang Cards */}
            {magangs.length > 0 ? (
                <div className="space-y-4">
                    {magangs.map((magang) => (
                        <Card key={magang.id}>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{magang.dudi?.nama || 'TBA'}</CardTitle>
                                            <CardDescription>{magang.judul_magang}</CardDescription>
                                        </div>
                                    </div>
                                    {getStatusBadge(magang.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Tanggal Mulai</p>
                                            <p className="text-sm font-medium">
                                                {magang.tanggal_mulai ? format(new Date(magang.tanggal_mulai), 'dd MMM yyyy') : 'Belum ditentukan'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Durasi</p>
                                            <p className="text-sm font-medium">6 Bulan</p>
                                        </div>
                                    </div>
                                </div>
                                {magang.deskripsi && (
                                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                                        <p className="text-sm">{magang.deskripsi}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                {magang.status === 'Aktif' && (
                                    <Button variant="outline" asChild>
                                        <Link href="/dashboard/siswa/logbook">
                                            Buka Jurnal <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Rocket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-1">Belum Ada Penempatan</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Anda belum memiliki penempatan magang aktif.
                        </p>
                        <div className="flex justify-center">
                            <Button asChild>
                                <Link href="/dashboard/siswa/dudi">
                                    Jelajahi Mitra DUDI
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </DashboardLayout>
    );
}

