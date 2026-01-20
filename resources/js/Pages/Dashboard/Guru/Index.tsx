import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Building, Briefcase, BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface GuruDashboardProps {
    stats: any;
    magangs: any[];
    latestSiswas: any[];
    pendingMagangs: any[];
    pendingLogbooks: any[];
}

export default function GuruDashboard({ stats, magangs, latestSiswas, pendingMagangs, pendingLogbooks }: GuruDashboardProps) {
    
    const handleVerify = (id: number, type: 'logbook' | 'magang', status: string) => {
        router.post(`/dashboard/guru/${type}/${id}/verify`, { status }, {
            preserveScroll: true
        });
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard Guru" />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalSiswa || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa terdaftar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Mitra DUDI</CardTitle>
                        <Building className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalDudi || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Unit industri aktif</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Penempatan</CardTitle>
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalMagang || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa magang aktif</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Jurnal</CardTitle>
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalLogbook || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Entri logbook</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Tasks */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
                {/* Pending Magang */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Verifikasi Magang</CardTitle>
                            <CardDescription>Pengajuan menunggu persetujuan</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/guru/magang">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {pendingMagangs.length > 0 ? (
                            <div className="space-y-3">
                                {pendingMagangs.slice(0, 3).map((pm: any) => (
                                    <div key={pm.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                {pm.siswa?.nama?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{pm.siswa?.nama}</p>
                                                <p className="text-xs text-muted-foreground">{pm.dudi?.nama}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleVerify(pm.id, 'magang', 'Setuju')}>
                                                Setuju
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleVerify(pm.id, 'magang', 'Tolak')}>
                                                Tolak
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Tidak ada pengajuan pending</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Logbook */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Koreksi Logbook</CardTitle>
                            <CardDescription>Jurnal menunggu review</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/guru/logbook">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {pendingLogbooks.length > 0 ? (
                            <div className="space-y-3">
                                {pendingLogbooks.slice(0, 3).map((pl: any) => (
                                    <div key={pl.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-sm">
                                                {pl.siswa?.nama?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{pl.siswa?.nama}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{pl.kegiatan || pl.tanggal}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleVerify(pl.id, 'logbook', 'Setuju')}>
                                                Setuju
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleVerify(pl.id, 'logbook', 'Tolak')}>
                                                Tolak
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Semua jurnal sudah diverifikasi</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Placements Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Penempatan Terbaru</CardTitle>
                        <CardDescription>Daftar siswa yang sedang magang</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/guru/magang">
                            Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {magangs.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Mitra DUDI</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {magangs.slice(0, 5).map((m: any) => (
                                    <TableRow key={m.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                                    {m.siswa?.nama?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{m.siswa?.nama}</p>
                                                    <p className="text-xs text-muted-foreground">NIS: {m.siswa?.nis || '-'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{m.dudi?.nama || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={m.status === 'Aktif' ? 'default' : 'secondary'}>
                                                {m.status || 'Aktif'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Belum ada data penempatan</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
