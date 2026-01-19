import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Search, Users, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface GuruSiswaProps {
    siswas: any[];
    kelases: any[];
}

export default function GuruSiswa({ siswas, kelases }: GuruSiswaProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        nama: '',
        email: '',
        nis: '',
        kelas_id: '',
        alamat: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/guru/siswa', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus siswa ini?')) {
            destroy(`/dashboard/guru/siswa/${id}`);
        }
    };

    const filteredSiswas = siswas.filter(s => 
        s.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.nis?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <Head title="Data Siswa" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Data Siswa</h1>
                    <p className="text-muted-foreground text-sm">Kelola data siswa program magang</p>
                </div>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Siswa Baru</DialogTitle>
                            <DialogDescription>
                                Sistem akan otomatis membuat akun login untuk siswa.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nama Lengkap</Label>
                                    <Input 
                                        value={data.nama} 
                                        onChange={e => setData('nama', e.target.value)} 
                                        placeholder="Nama siswa"
                                        required 
                                    />
                                    {errors.nama && <p className="text-destructive text-xs">{errors.nama}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>NIS</Label>
                                    <Input 
                                        value={data.nis} 
                                        onChange={e => setData('nis', e.target.value)} 
                                        placeholder="Nomor Induk Siswa"
                                        required 
                                    />
                                    {errors.nis && <p className="text-destructive text-xs">{errors.nis}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input 
                                        type="email" 
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)} 
                                        placeholder="email@siswa.sch.id"
                                        required 
                                    />
                                    {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Select onValueChange={value => setData('kelas_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelases.map((k: any) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_id && <p className="text-destructive text-xs">{errors.kelas_id}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Alamat</Label>
                                <Textarea 
                                    value={data.alamat}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat', e.target.value)}
                                    placeholder="Alamat lengkap siswa"
                                    rows={2}
                                />
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
                        <p className="text-sm text-muted-foreground">Total Siswa</p>
                        <p className="text-2xl font-bold">{siswas.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Aktif Magang</p>
                        <p className="text-2xl font-bold text-green-600">
                            {siswas.filter(s => s.magangs?.some((m: any) => m.status === 'Aktif')).length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Kelas</p>
                        <p className="text-2xl font-bold">{kelases.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Belum Magang</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {siswas.filter(s => !s.magangs?.length).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Siswa</CardTitle>
                            <CardDescription>Total {filteredSiswas.length} siswa ditemukan</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari siswa..." 
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredSiswas.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead className="hidden md:table-cell">Email</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSiswas.map((s: any) => (
                                    <TableRow key={s.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                    {s.nama?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{s.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{s.alamat || '-'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{s.nis}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{s.kelas?.nama || '-'}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {s.user?.email || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem 
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(s.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">Tidak Ada Data</h3>
                            <p className="text-muted-foreground text-sm">
                                Belum ada siswa yang terdaftar atau sesuai pencarian
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
