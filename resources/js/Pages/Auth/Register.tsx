import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Presentation, Rocket, User, Mail, Lock, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Siswa',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-outfit relative overflow-hidden">
            <Head title="Daftar Akun - Magang" />
            
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[580px] relative z-10 transition-all duration-500 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 group hover:scale-110 transition-transform duration-500">
                        <Rocket className="w-8 h-8 text-primary group-hover:animate-bounce" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Buat Akun Baru</h1>
                    <p className="text-slate-500 font-medium">Mulai perjalanan profesionalmu bersama kami</p>
                </div>

                <Card className="bg-white/70 backdrop-blur-xl border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <Input 
                                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            required 
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">{errors.name}</p>}
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat Email</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <Input 
                                            type="email"
                                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium" 
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="nama@contoh.com"
                                            required 
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">{errors.email}</p>}
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <Input 
                                            type="password"
                                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium" 
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required 
                                        />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <Input 
                                            type="password"
                                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium" 
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-center block w-full mb-4">Pilih Peran Pengguna</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'Siswa')}
                                            className={`py-6 px-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden group ${
                                                data.role === 'Siswa' 
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-primary/20 hover:text-slate-600'
                                            }`}
                                        >
                                            <div className={`p-3 rounded-2xl ${data.role === 'Siswa' ? 'bg-white/20' : 'bg-slate-50'}`}>
                                                <GraduationCap className="h-6 w-6" /> 
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Siswa</span>
                                            {data.role === 'Siswa' && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'Guru')}
                                            className={`py-6 px-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden group ${
                                                data.role === 'Guru' 
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-primary/20 hover:text-slate-600'
                                            }`}
                                        >
                                            <div className={`p-3 rounded-2xl ${data.role === 'Guru' ? 'bg-white/20' : 'bg-slate-50'}`}>
                                                <Presentation className="h-6 w-6" /> 
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Guru</span>
                                            {data.role === 'Guru' && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                    {errors.role && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase text-center">{errors.role}</p>}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] group"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Mendaftarkan...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Buat Akun Sekarang
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center animate-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-slate-500 font-medium mb-2">Sudah memiliki akun sebelumnya?</p>
                    <Button asChild variant="ghost" className="text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5 hover:text-primary rounded-xl">
                        <Link href="/login" className="flex items-center gap-2">
                            Masuk ke Portal
                            <UserPlus className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
