import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CheckCircle2, XCircle, Clock, BookOpen, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Siswa {
    nama: string;
    nis: string;
}

interface Logbook {
    id: number;
    tanggal: string;
    kegiatan: string;
    deskripsi: string;
    status: string;
    siswa: Siswa;
}

interface GuruLogbookProps {
    logbooks: Logbook[];
}

export default function GuruLogbook({ logbooks }: GuruLogbookProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleVerify = (id: number, status: string) => {
        router.post(`/dashboard/guru/logbook/${id}/verify`, { status }, {
            preserveScroll: true
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Setuju':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" />Disetujui</Badge>;
            case 'Tolak':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
            default:
                return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>;
        }
    };

    const filteredLogbooks = logbooks.filter(log => 
        log.siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.kegiatan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <Head title="Logbook Jurnal" />
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Logbook Jurnal</h1>
                <p className="text-muted-foreground text-sm">Verifikasi jurnal harian siswa</p>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Logbook</CardTitle>
                            <CardDescription>Total {filteredLogbooks.length} jurnal</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari siswa atau kegiatan..." 
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredLogbooks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Kegiatan</TableHead>
                                    <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogbooks.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                    {log.siswa?.nama?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{log.siswa?.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{log.siswa?.nis}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{log.kegiatan}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{log.deskripsi}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {log.tanggal ? format(new Date(log.tanggal), 'dd MMM yyyy') : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                                        <TableCell className="text-right">
                                            {log.status === 'Menunggu' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" onClick={() => handleVerify(log.id, 'Setuju')}>
                                                        Setuju
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleVerify(log.id, 'Tolak')}>
                                                        Tolak
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Terverifikasi</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">Tidak Ada Logbook</h3>
                            <p className="text-muted-foreground text-sm">
                                Belum ada jurnal yang perlu diverifikasi
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
