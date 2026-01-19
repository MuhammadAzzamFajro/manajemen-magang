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
            
            <div className="mb-12">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Sistem Pencarian Global</h4>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                    Hasil <span className="text-blue-600">Pencarian</span>
                </h1>
                <p className="text-slate-500 font-medium text-lg italic">
                    Menampilkan hasil untuk kata kunci: <span className="font-black text-slate-900 uppercase">"{query}"</span>
                </p>
            </div>

            {isEmpty ? (
                <div className="bg-white border-4 border-dashed border-slate-100 rounded-[5rem] p-32 text-center shadow-2xl shadow-slate-100/50 flex flex-col items-center">
                    <div className="mb-10 w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 shadow-inner border border-slate-100">
                        <SearchIcon className="h-10 w-10 opacity-50" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">Pencarian Nihil</h2>
                    <p className="text-slate-400 max-w-sm mx-auto leading-relaxed font-medium text-lg italic truncate">"Tidak ada hasil yang cocok dengan parameter '{query}' yang Anda masukkan."</p>
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
                                <Card key={log.id} className="bg-white border-transparent p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 group font-outfit">
                                    <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-50">
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span> Entry Ref #{log.id}
                                            </p>
                                            <h3 className="text-lg font-black text-slate-900 leading-[1.2] truncate group-hover:text-amber-600 transition uppercase tracking-tight">{log.kegiatan}</h3>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        {log.siswa && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-black">{log.siswa.nama.charAt(0)}</div>
                                                <span className="text-xs font-bold text-slate-900 uppercase truncate">
                                                    {log.siswa.nama} <span className="text-slate-300 mx-1">•</span> <span className="text-slate-400">{log.siswa.kelas?.nama || log.siswa.kelas?.kelas || 'N/A'}</span>
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {log.tanggal ? format(new Date(log.tanggal), 'dd MMMM yyyy') : '-'}
                                        </p>
                                    </div>
                                    {log.deskripsi && (
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">"{log.deskripsi}"</p>
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
                                <Card key={mg.id} className="bg-white border-transparent p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 group font-outfit">
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block"></span> Intern Pos #{mg.id}
                                            </p>
                                            <h3 className="text-lg font-black text-slate-900 leading-[1.2] truncate group-hover:text-blue-600 transition uppercase tracking-tight">{mg.judul_magang}</h3>
                                        </div>
                                        <Badge className="shrink-0 bg-emerald-50 text-emerald-600 border-transparent text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                            {mg.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        {mg.siswa && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black">{mg.siswa.nama.charAt(0)}</div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-slate-900 uppercase truncate leading-none mb-1">{mg.siswa.nama}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{mg.siswa.kelas?.nama || mg.siswa.kelas?.kelas || 'N/A'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {mg.dudi && (
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter flex items-center gap-2">
                                                <Building className="h-3.5 w-3.5" /> {mg.dudi.nama}
                                            </p>
                                        )}
                                    </div>
                                    {mg.deskripsi && (
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">"{mg.deskripsi}"</p>
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
                                <Card key={dudi.id} className="bg-white border-transparent p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group font-outfit overflow-hidden relative">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-12 -translate-y-12 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                    
                                    <div className="relative z-10">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1.5 ml-1">Enterprise Partner</p>
                                        <p className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-emerald-700 transition uppercase tracking-tighter leading-none">{dudi.nama}</p>
                                        
                                        {dudi.bidang_usaha && (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-transparent text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                                                {dudi.bidang_usaha}
                                            </Badge>
                                        )}
                                        
                                        {dudi.alamat && (
                                            <div className="flex items-start gap-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                                                <MapPin className="h-4 w-4 text-slate-300 mt-0.5" />
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{dudi.alamat}</p>
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
