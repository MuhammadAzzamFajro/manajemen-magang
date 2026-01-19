import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, CheckCircle2, Clock, XCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Logbook {
    id: number;
    tanggal: string;
    kegiatan: string;
    deskripsi: string;
    status: string;
}

interface SiswaLogbookProps {
    logbooks: Logbook[];
}

export default function SiswaLogbook({ logbooks = [] }: SiswaLogbookProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        tanggal: format(new Date(), 'yyyy-MM-dd'),
        kegiatan: '',
        deskripsi: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/siswa/logbook', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Setuju':
                return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" />Disetujui</Badge>;
            case 'Tolak':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
            default:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>;
        }
    };

    const totalApproved = logbooks.filter(l => l.status === 'Setuju').length;
    const totalPending = logbooks.filter(l => l.status !== 'Setuju' && l.status !== 'Tolak').length;
    const totalRejected = logbooks.filter(l => l.status === 'Tolak').length;

    return (
        <DashboardLayout>
            <Head title="Jurnal Harian" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Jurnal Harian</h1>
                    <p className="text-muted-foreground text-sm">Dokumentasikan aktivitas magang harian Anda</p>
                </div>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Buat Jurnal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Buat Jurnal Baru</DialogTitle>
                            <DialogDescription>
                                Isi detail kegiatan yang Anda lakukan hari ini.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal</Label>
                                    <Input 
                                        id="tanggal"
                                        type="date" 
                                        value={data.tanggal} 
                                        onChange={e => setData('tanggal', e.target.value)}
                                    />
                                    {errors.tanggal && <p className="text-destructive text-xs">{errors.tanggal}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kegiatan">Judul Kegiatan</Label>
                                    <Input 
                                        id="kegiatan"
                                        value={data.kegiatan} 
                                        onChange={e => setData('kegiatan', e.target.value)}
                                        placeholder="Contoh: UI Design"
                                        required 
                                    />
                                    {errors.kegiatan && <p className="text-destructive text-xs">{errors.kegiatan}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea 
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('deskripsi', e.target.value)}
                                    placeholder="Jelaskan detail kegiatan yang Anda kerjakan..."
                                    rows={4}
                                    required 
                                />
                                {errors.deskripsi && <p className="text-destructive text-xs">{errors.deskripsi}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{logbooks.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Disetujui</p>
                        <p className="text-2xl font-bold text-green-600">{totalApproved}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Menunggu</p>
                        <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Ditolak</p>
                        <p className="text-2xl font-bold text-red-600">{totalRejected}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Jurnal</CardTitle>
                    <CardDescription>Riwayat semua jurnal yang telah Anda buat</CardDescription>
                </CardHeader>
                <CardContent>
                    {logbooks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Kegiatan</TableHead>
                                    <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logbooks.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {log.tanggal ? format(new Date(log.tanggal), 'dd MMM yyyy') : '-'}
                                        </TableCell>
                                        <TableCell>{log.kegiatan}</TableCell>
                                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                                            {log.deskripsi}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">Belum Ada Jurnal</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Mulai dokumentasikan kegiatan magang Anda
                            </p>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Buat Jurnal Pertama
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
