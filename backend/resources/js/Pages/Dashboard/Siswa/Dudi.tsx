import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, User, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Dudi {
    id: number;
    nama: string;
    bidang_usaha?: string;
    telepon?: string;
    alamat?: string;
    email?: string;
    penanggung_jawab?: string;
}

interface SiswaDudiProps {
    dudis: Dudi[];
    hasMagang: boolean;
}

export default function SiswaDudi({ dudis, hasMagang }: SiswaDudiProps) {
    const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = (id: number) => {
        setIsApplying(true);
        router.post('/dashboard/siswa/magang/apply', { dudi_id: id }, {
            onSuccess: () => setSelectedDudi(null),
            onFinish: () => setIsApplying(false),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Eksplorasi DUDI" />
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Eksplorasi Mitra DUDI</h1>
                <p className="text-muted-foreground text-sm">Temukan tempat magang yang sesuai dengan minat Anda</p>
                
                {hasMagang && (
                    <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-yellow-900">Anda Memiliki Magang Aktif</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Anda sudah terdaftar dalam program magang. Fitur pengajuan magang baru dinonaktifkan.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* DUDI Grid */}
            {dudis.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dudis.map((dudi) => (
                        <Card key={dudi.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <Badge variant="secondary">{dudi.bidang_usaha || 'Industri'}</Badge>
                                </div>
                                <CardTitle className="mt-3 text-lg">{dudi.nama}</CardTitle>
                                <CardDescription className="flex items-start gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">{dudi.alamat || 'Alamat belum tersedia'}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto pt-0">
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => setSelectedDudi(dudi)}
                                >
                                    Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-1">Belum Ada Mitra</h3>
                        <p className="text-muted-foreground text-sm">
                            Data mitra DUDI belum tersedia. Hubungi admin untuk informasi lebih lanjut.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Detail Modal */}
            <Dialog open={!!selectedDudi} onOpenChange={() => setSelectedDudi(null)}>
                <DialogContent className="max-w-lg">
                    {selectedDudi && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <DialogTitle>{selectedDudi.nama}</DialogTitle>
                                        <Badge variant="secondary" className="mt-1">{selectedDudi.bidang_usaha || 'Industri'}</Badge>
                                    </div>
                                </div>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Alamat</p>
                                            <p className="text-sm">{selectedDudi.alamat || 'Belum tersedia'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <User className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Penanggung Jawab</p>
                                            <p className="text-sm">{selectedDudi.penanggung_jawab || 'Belum tersedia'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <Phone className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Telepon</p>
                                            <p className="text-sm">{selectedDudi.telepon || 'Belum tersedia'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <Mail className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="text-sm">{selectedDudi.email || 'Belum tersedia'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {hasMagang && (
                                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Anda sudah memiliki magang aktif. Tidak dapat mengajukan baru.
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setSelectedDudi(null)}>
                                    Tutup
                                </Button>
                                <Button 
                                    onClick={() => handleApply(selectedDudi.id)} 
                                    disabled={isApplying || hasMagang}
                                >
                                    {isApplying ? 'Mengajukan...' : hasMagang ? 'Sudah Ada Magang' : 'Ajukan Magang'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
