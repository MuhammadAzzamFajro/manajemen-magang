import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Briefcase, Building, Search as SearchIcon, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Siswa {
    nama: string;
    kelas?: {
        nama?: string;
        kelas?: string;
    };
}

interface Logbook {
    id: number;
    kegiatan: string;
    tanggal: string;
    deskripsi?: string;
    siswa?: Siswa;
}

interface Magang {
    id: number;
    judul_magang: string;
    status: string;
    deskripsi?: string;
    siswa?: Siswa;
    dudi?: {
        nama: string;
    };
}

interface Dudi {
    id: number;
    nama: string;
    bidang_usaha?: string;
    alamat?: string;
}

interface SearchResultsProps {
    query: string;
    logbooks?: Logbook[];
    magangs?: Magang[];
    dudis?: Dudi[];
}

export default function SearchResults({ query, logbooks = [], magangs = [], dudis = [] }: SearchResultsProps) {
    const isEmpty = logbooks.length === 0 && magangs.length === 0 && dudis.length === 0;

    return (
        <DashboardLayout>
            <Head title={`Hasil Pencarian: ${query}`} />
            
            <div className="mb-8">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Pencarian Global</h4>
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        Hasil Pencarian
                    </h1>
                    <span className="text-slate-400 text-lg">for</span>
                    <span className="text-xl md:text-2xl font-bold text-primary italic">"{query}"</span>
                </div>
            </div>

            {isEmpty ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center max-w-2xl mx-auto">
                    <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <SearchIcon className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Tidak Ditemukan</h2>
                    <p className="text-slate-500">
                        Kami tidak menemukan hasil untuk kata kunci <span className="font-semibold text-slate-700">"{query}"</span>. 
                        Coba gunakan kata kunci lain atau periksa ejaan Anda.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Logbook Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                <Book className="h-4 w-4 text-amber-500" /> Logbook <span className="text-slate-200">/</span> {logbooks.length} Item
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {logbooks.length > 0 ? logbooks.map((log) => (

                                <Card key={log.id} className="bg-white border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-slate-50">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                                                Logbook #{log.id}
                                            </p>
                                            <h3 className="text-base font-bold text-slate-900 leading-tight truncate">{log.kegiatan}</h3>
                                        </div>
                                    </div>
                                    <div className="mb-3 space-y-2">
                                        {log.siswa && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[9px] text-slate-600 font-bold">{log.siswa.nama.charAt(0)}</div>
                                                <p className="text-xs font-semibold text-slate-700 truncate">
                                                    {log.siswa.nama} <span className="text-slate-300">•</span> {log.siswa.kelas?.nama || 'N/A'}
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {log.tanggal ? format(new Date(log.tanggal), 'dd MMM yyyyy') : '-'}
                                        </p>
                                    </div>
                                    {log.deskripsi && (
                                        <div className="bg-slate-50 p-3 rounded-xl">
                                            <p className="text-xs text-slate-600 line-clamp-2">"{log.deskripsi}"</p>
                                        </div>
                                    )}
                                </Card>
                            )) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center">
                                    <Book className="h-8 w-8 text-slate-200 mb-4 opacity-50" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Data Logbook <br/>Tidak Tersedia</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Magang Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-blue-600" /> Magang <span className="text-slate-200">/</span> {magangs.length} Item
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {magangs.length > 0 ? magangs.map((mg) => (

                                <Card key={mg.id} className="bg-white border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                                                Magang #{mg.id}
                                            </p>
                                            <h3 className="text-base font-bold text-slate-900 leading-tight truncate">{mg.judul_magang}</h3>
                                        </div>
                                        <Badge variant={mg.status === 'Aktif' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                                            {mg.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-3 mb-4">
                                        {mg.siswa && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[9px] text-slate-600 font-bold">{mg.siswa.nama.charAt(0)}</div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-700 truncate">{mg.siswa.nama}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{mg.siswa.kelas?.nama || 'N/A'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {mg.dudi && (
                                            <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                                                <Building className="h-3 w-3" /> {mg.dudi.nama}
                                            </p>
                                        )}
                                    </div>
                                    {mg.deskripsi && (
                                        <div className="bg-slate-50 p-3 rounded-xl">
                                            <p className="text-xs text-slate-600 line-clamp-2">"{mg.deskripsi}"</p>
                                        </div>
                                    )}
                                </Card>
                            )) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center">
                                    <Briefcase className="h-8 w-8 text-slate-200 mb-4 opacity-50" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Data Magang <br/>Tidak Tersedia</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DUDI Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                <Building className="h-4 w-4 text-emerald-600" /> Mitra DUDI <span className="text-slate-200">/</span> {dudis.length} Item
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {dudis.length > 0 ? dudis.map((dudi) => (

                                <Card key={dudi.id} className="bg-white border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                                     <div className="relative z-10">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Mitra DUDI</p>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{dudi.nama}</h3>
                                        
                                        {dudi.bidang_usaha && (
                                            <Badge variant="outline" className="text-[10px] mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
                                                {dudi.bidang_usaha}
                                            </Badge>
                                        )}
                                        
                                        {dudi.alamat && (
                                            <div className="flex items-start gap-2 text-slate-500">
                                                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                                <p className="text-xs line-clamp-2">{dudi.alamat}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center">
                                    <Building className="h-8 w-8 text-slate-200 mb-4 opacity-50" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Partner DUDI <br/>Tidak Tersedia</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
