import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-outfit relative overflow-hidden">
            <Head title="Login - Magang" />
            
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[440px] relative z-10 transition-all duration-500 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-sm">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Rocket className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-800 tracking-tight text-lg">Magang</span>
                    </div>
                </div>

                <Card className="bg-white/70 backdrop-blur-xl border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Selamat Datang</h1>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">Silahkan masuk ke akun Anda untuk melanjutkan akses ke dashboard Magang.</p>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <div className="mb-8 p-4 bg-destructive/5 border border-destructive/10 text-destructive rounded-2xl text-[13px] font-semibold flex items-center gap-3 animate-in slide-in-from-top-2">
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                <p>{errors.email || 'Terjadi kesalahan sistem.'}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2.5">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Sekolah</Label>
                                <div className="relative group transition-all">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        type="email" 
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="bg-slate-50/50 border-slate-200/60 rounded-2xl h-14 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium text-sm" 
                                        placeholder="nama@sekolah.sch.id"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kata Sandi</Label>
                                </div>
                                <div className="relative group transition-all">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        type="password" 
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="bg-slate-50/50 border-slate-200/60 rounded-2xl h-14 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium text-sm" 
                                        placeholder="••••••••"
                                        required 
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </span>
                                ) : (
                                    <>
                                        Masuk Sekarang
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-3">
                            <p className="text-slate-400 text-[13px] font-medium tracking-tight">Belum memiliki akun?</p>
                            <Button variant="outline" asChild className="w-full h-12 rounded-2xl border-slate-200 text-slate-700 font-bold text-sm tracking-tight hover:bg-slate-50 transition-all">
                                <Link href="/register">Buat Akun Baru</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-slate-400 text-xs font-medium">
                    &copy; {new Date().getFullYear()} Sistem Manajemen Magang. All rights reserved.
                </p>
            </div>
        </div>
    );
}

