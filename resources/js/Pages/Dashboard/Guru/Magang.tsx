import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, Eye, Check, X, Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Magang {
    id: number;
    siswa_id: number;
    dudi_id: number;
    judul_magang: string;
    tanggal_mulai: string;
    status: string;
    deskripsi?: string;
    siswa?: {
        nama: string;
        nis: string;
        id: number;
    };
    dudi?: {
        nama: string;
    };
}

interface GuruMagangProps {
    magangs: Magang[];
    siswas: any[];
    dudis: any[];
}

export default function GuruMagang({ magangs, siswas, dudis }: GuruMagangProps) {
    const [selectedMagang, setSelectedMagang] = useState<Magang | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: '',
        dudi_id: '',
        judul_magang: '',
        tanggal_mulai: '',
        deskripsi: '',
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/guru/magang', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleVerify = (id: number, status: string) => {
        router.post(`/dashboard/guru/magang/${id}/verify`, { status }, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Aktif':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>;
            case 'Selesai':
                return <Badge variant="secondary">Selesai</Badge>;
            case 'Pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">Pending</Badge>;
            default:
                return <Badge variant="destructive">{status}</Badge>;
        }
    };

    const filteredMagangs = magangs.filter(m => 
        m.siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dudi?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.judul_magang.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <Head title="Monitoring Magang" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Monitoring Magang</h1>
                    <p className="text-muted-foreground text-sm">Kelola penempatan siswa di mitra industri</p>
                </div>
                
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Penempatan
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Penempatan</CardTitle>
                            <CardDescription>Total {filteredMagangs.length} penempatan</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari siswa atau perusahaan..." 
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredMagangs.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>DUDI / Posisi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Tanggal Mulai</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMagangs.map((m: Magang) => (
                                    <TableRow key={m.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                    {m.siswa?.nama?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{m.siswa?.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{m.siswa?.nis}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{m.dudi?.nama || '-'}</p>
                                                <p className="text-xs text-muted-foreground">{m.judul_magang}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(m.status)}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {m.tanggal_mulai ? format(new Date(m.tanggal_mulai), 'dd MMM yyyy') : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {m.status === 'Pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" onClick={() => handleVerify(m.id, 'Setuju')}>
                                                        <Check className="w-3 h-3 mr-1" /> Terima
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleVerify(m.id, 'Tolak')}>
                                                        <X className="w-3 h-3 mr-1" /> Tolak
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedMagang(m)}>
                                                    <Eye className="w-4 h-4 mr-1" /> Detail
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">Belum Ada Penempatan</h3>
                            <p className="text-muted-foreground text-sm">
                                Tambahkan penempatan magang baru
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Penempatan Baru</DialogTitle>
                        <DialogDescription>
                            Tempatkan siswa ke mitra industri untuk magang.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Pilih Siswa</Label>
                            <Select onValueChange={val => setData('siswa_id', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Siswa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {siswas.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.nama} ({s.nis})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.siswa_id && <p className="text-destructive text-xs">{errors.siswa_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Mitra DUDI</Label>
                            <Select onValueChange={val => setData('dudi_id', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Perusahaan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dudis.map((d: any) => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.dudi_id && <p className="text-destructive text-xs">{errors.dudi_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Posisi</Label>
                                <Input 
                                    value={data.judul_magang} 
                                    onChange={e => setData('judul_magang', e.target.value)}
                                    placeholder="Web Developer"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input 
                                    type="date" 
                                    value={data.tanggal_mulai}
                                    onChange={e => setData('tanggal_mulai', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Deskripsi Tugas</Label>
                            <Textarea 
                                value={data.deskripsi}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('deskripsi', e.target.value)}
                                placeholder="Deskripsi tugas magang..."
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <Dialog open={!!selectedMagang} onOpenChange={() => setSelectedMagang(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail Penempatan</DialogTitle>
                    </DialogHeader>
                    
                    {selectedMagang && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground mb-1">Siswa</p>
                                    <p className="font-medium">{selectedMagang.siswa?.nama}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    {getStatusBadge(selectedMagang.status)}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">Mitra DUDI</p>
                                <p className="font-medium">{selectedMagang.dudi?.nama}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground mb-1">Tanggal Mulai</p>
                                    <p className="font-medium">
                                        {selectedMagang.tanggal_mulai ? format(new Date(selectedMagang.tanggal_mulai), 'dd MMM yyyy') : '-'}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground mb-1">Posisi</p>
                                    <Badge variant="secondary">{selectedMagang.judul_magang}</Badge>
                                </div>
                            </div>
                            {selectedMagang.deskripsi && (
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                                    <p className="text-sm">{selectedMagang.deskripsi}</p>
                                </div>
                            )}
                            <Button className="w-full" onClick={() => setSelectedMagang(null)}>
                                Tutup
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
