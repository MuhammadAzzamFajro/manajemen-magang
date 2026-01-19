import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
    CalendarDays,
    FileText, 
    Briefcase, 
    AlertCircle, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    MapPin,
    BookOpen,
    Building2,
    TrendingUp
} from 'lucide-react';

interface InternshipProgress {
    days_passed: number;
    total_days: number;
    percentage: number;
}

interface SiswaDashboardProps {
    namaSiswa: string;
    logbookCount: number;
    approvedLogbook: number;
    pendingLogbook: number;
    presentRate: number | null;
    internshipStatus: string | null;
    internshipCompany: string | null;
    internshipProgress: InternshipProgress | null;
    internshipStartDate: string | null;
    hasMagang: boolean;
}

export default function SiswaDashboard({ 
    namaSiswa, 
    logbookCount, 
    approvedLogbook, 
    pendingLogbook, 
    presentRate, 
    internshipStatus, 
    internshipCompany, 
    internshipProgress, 
    internshipStartDate,
    hasMagang,
}: SiswaDashboardProps) {

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard Siswa" />
            
            {/* Header */}
            <div className="flex flex-col gap-1 mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Selamat Datang, {namaSiswa}
                </h1>
                <p className="text-muted-foreground text-sm">
                    Pantau progres magang dan aktivitas jurnal harian Anda.
                </p>
            </div>

            {/* Alert - No Placement */}
            {!hasMagang && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                    <CardContent className="p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="font-medium text-orange-900 text-sm">Penempatan Belum Tersedia</p>
                            <p className="text-orange-700 text-sm mt-0.5">
                                Anda belum mendapatkan lokasi penempatan magang. Silakan jelajahi mitra industri yang tersedia.
                            </p>
                            <Button asChild size="sm" variant="outline" className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100">
                                <Link href="/dashboard/siswa/dudi">
                                    Jelajahi Mitra DUDI <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {/* Kehadiran */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Kehadiran</CardTitle>
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{presentRate ?? 0}%</div>
                        <Progress value={presentRate ?? 0} className="mt-2 h-1" />
                        <p className="text-xs text-muted-foreground mt-2">Rate kehadiran selama magang</p>
                    </CardContent>
                </Card>

                {/* Logbook Total */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Jurnal Harian</CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{logbookCount}</div>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-muted-foreground">{approvedLogbook} Disetujui</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span className="text-xs text-muted-foreground">{pendingLogbook} Pending</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Magang */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status Magang</CardTitle>
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold truncate">
                            {internshipCompany || 'Belum Ada'}
                        </div>
                        <Badge variant={hasMagang ? "default" : "secondary"} className="mt-2">
                            {internshipStatus || 'Menunggu'}
                        </Badge>
                        {internshipStartDate && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" /> Mulai: {formatDate(internshipStartDate)}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Progress Magang */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Progres Waktu</CardTitle>
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {internshipProgress ? (
                            <>
                                <div className="text-2xl font-bold">{internshipProgress.percentage}%</div>
                                <Progress value={internshipProgress.percentage} className="mt-2 h-1" />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {internshipProgress.days_passed} dari {internshipProgress.total_days} hari
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground mt-2">Belum dimulai</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Announcement */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Aksi Cepat</CardTitle>
                        <CardDescription>Akses fitur yang sering digunakan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                                <Link href="/dashboard/siswa/logbook">
                                    <BookOpen className="w-5 h-5" />
                                    <span className="text-xs">Buat Jurnal</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                                <Link href="/dashboard/siswa/kehadiran">
                                    <CalendarDays className="w-5 h-5" />
                                    <span className="text-xs">Presensi</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                                <Link href="/dashboard/siswa/dudi">
                                    <Building2 className="w-5 h-5" />
                                    <span className="text-xs">Cari DUDI</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                                <Link href="/dashboard/siswa/magang">
                                    <Briefcase className="w-5 h-5" />
                                    <span className="text-xs">Status Magang</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <CardTitle className="text-base">Tips Magang</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>• Isi jurnal harian setiap hari kerja</p>
                            <p>• Jangan lupa presensi kehadiran</p>
                            <p>• Hubungi pembimbing jika ada kendala</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
