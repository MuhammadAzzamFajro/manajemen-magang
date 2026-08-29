import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Building, Plus, Edit, Trash2, Phone, MapPin, Search, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Dudi {
    id: number;
    nama: string;
    bidang_usaha?: string;
    telepon?: string;
    alamat?: string;
    email?: string;
    penanggung_jawab?: string;
}

interface GuruDudiProps {
    dudis: Dudi[];
}

export default function GuruDudi({ dudis }: GuruDudiProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDudi, setEditingDudi] = useState<Dudi | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        nama: '',
        bidang_usaha: '',
        telepon: '',
        alamat: '',
    });

    const openAddModal = () => {
        reset();
        setEditingDudi(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (dudi: Dudi) => {
        setEditingDudi(dudi);
        setData({
            nama: dudi.nama || '',
            bidang_usaha: dudi.bidang_usaha || '',
            telepon: dudi.telepon || '',
            alamat: dudi.alamat || '',
        });
        setIsAddModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDudi) {
            put(`/dashboard/guru/dudis/${editingDudi.id}`, {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    setEditingDudi(null);
                    reset();
                },
            });
        } else {
            post('/dashboard/guru/dudis', {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus DUDI ini?')) {
            destroy(`/dashboard/guru/dudis/${id}`);
        }
    };

    const filteredDudis = dudis.filter(d => 
        d.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.bidang_usaha?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <Head title="Mitra DUDI" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Mitra DUDI</h1>
                    <p className="text-muted-foreground text-sm">Kelola data mitra industri program magang</p>
                </div>
                
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah DUDI
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Mitra Industri</CardTitle>
                            <CardDescription>Total {filteredDudis.length} mitra terdaftar</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari mitra..." 
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredDudis.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Perusahaan</TableHead>
                                    <TableHead>Bidang</TableHead>
                                    <TableHead className="hidden md:table-cell">Telepon</TableHead>
                                    <TableHead className="hidden lg:table-cell">Alamat</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDudis.map((d: Dudi) => (
                                    <TableRow key={d.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Building className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{d.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{d.penanggung_jawab || '-'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{d.bidang_usaha || 'Lainnya'}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                {d.telepon || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center gap-1.5 text-muted-foreground max-w-[200px] truncate">
                                                <MapPin className="w-3 h-3 shrink-0" />
                                                {d.alamat || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditModal(d)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(d.id)}
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
                            <Building className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">Belum Ada Mitra</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Tambahkan mitra industri untuk program magang
                            </p>
                            <Button onClick={openAddModal}>
                                <Plus className="w-4 h-4 mr-2" /> Tambah DUDI
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDudi ? 'Edit Mitra DUDI' : 'Tambah Mitra Baru'}</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi lengkap mitra industri.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nama Perusahaan</Label>
                            <Input 
                                value={data.nama} 
                                onChange={e => setData('nama', e.target.value)} 
                                placeholder="PT. Contoh Indonesia" 
                                required 
                            />
                            {errors.nama && <p className="text-destructive text-xs">{errors.nama}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Bidang Usaha</Label>
                                <Input 
                                    value={data.bidang_usaha} 
                                    onChange={e => setData('bidang_usaha', e.target.value)} 
                                    placeholder="IT, Manufaktur, dll" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Telepon</Label>
                                <Input 
                                    value={data.telepon} 
                                    onChange={e => setData('telepon', e.target.value)} 
                                    placeholder="08123456789" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Alamat</Label>
                            <Textarea 
                                value={data.alamat}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat', e.target.value)}
                                placeholder="Alamat lengkap perusahaan"
                                rows={2}
                            />
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : (editingDudi ? 'Simpan' : 'Tambah')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
