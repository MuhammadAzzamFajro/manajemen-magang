import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, XCircle, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceStats {
    percentage: number;
    present_days: number;
    working_days: number;
    permission_days: number;
    absent_days: number;
}

interface Attendance {
    id: number;
    tanggal: string;
    status: string;
    catatan?: string;
}

interface SiswaKehadiranProps {
    attendanceStats: AttendanceStats;
    recentAttendances: Attendance[];
}

export default function SiswaKehadiran({ attendanceStats, recentAttendances }: SiswaKehadiranProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        status: '',
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/siswa/kehadiran', {
            onSuccess: () => reset(),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Hadir':
                return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Hadir</Badge>;
            case 'Sakit':
                return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Sakit</Badge>;
            case 'Izin':
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Izin</Badge>;
            default:
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Alfa</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Kehadiran" />
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Kehadiran</h1>
                <p className="text-muted-foreground text-sm">Pantau dan catat kehadiran harian Anda</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Persentase Kehadiran</p>
                        <p className="text-2xl font-bold">{attendanceStats.percentage}%</p>
                        <Progress value={attendanceStats.percentage} className="mt-2 h-1" />
                        <p className="text-xs text-muted-foreground mt-1">dari {attendanceStats.working_days} hari kerja</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Hadir</p>
                        <p className="text-2xl font-bold text-green-600">{attendanceStats.present_days}</p>
                        <p className="text-xs text-muted-foreground mt-1">hari kerja</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Izin / Sakit</p>
                        <p className="text-2xl font-bold text-yellow-600">{attendanceStats.permission_days}</p>
                        <p className="text-xs text-muted-foreground mt-1">hari</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Alfa (Tanpa Keterangan)</p>
                        <p className="text-2xl font-bold text-red-600">{attendanceStats.absent_days}</p>
                        <p className="text-xs text-muted-foreground mt-1">hari</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Check-in Hari Ini</CardTitle>
                        <CardDescription>{format(new Date(), 'EEEE, dd MMMM yyyy')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status Kehadiran</Label>
                                <Select onValueChange={val => setData('status', val)} value={data.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hadir">Hadir</SelectItem>
                                        <SelectItem value="Sakit">Sakit</SelectItem>
                                        <SelectItem value="Izin">Izin</SelectItem>
                                        <SelectItem value="Tidak Hadir">Alfa</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-destructive text-xs">{errors.status}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Keterangan (opsional)</Label>
                                <Textarea 
                                    value={data.catatan}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('catatan', e.target.value)}
                                    placeholder="Tambahkan keterangan jika perlu..."
                                    rows={3}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing || !data.status}>
                                {processing ? 'Menyimpan...' : 'Simpan Kehadiran'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Riwayat Kehadiran</CardTitle>
                        <CardDescription>Daftar kehadiran terbaru</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentAttendances.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentAttendances.map((att) => (
                                        <TableRow key={att.id}>
                                            <TableCell className="font-medium">
                                                {att.tanggal ? format(new Date(att.tanggal), 'dd MMM yyyy') : '-'}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(att.status)}</TableCell>
                                            <TableCell className="text-muted-foreground">{att.catatan || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium mb-1">Belum Ada Data</h3>
                                <p className="text-muted-foreground text-sm">
                                    Riwayat kehadiran akan muncul di sini
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
