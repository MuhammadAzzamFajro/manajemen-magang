import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Menu, Search, Home, User, Briefcase, FileText, BookOpen, GraduationCap, Building, LogOut, Shuffle, Bell, ChevronRight, Settings, LayoutDashboard, Rocket, ShieldCheck, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const SidebarLink = ({ href, active, icon: Icon, label }: { href: string, active: boolean, icon: any, label: string }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
            active 
            ? 'bg-primary/10 text-primary font-bold shadow-[0_4px_12px_rgba(37,99,235,0.1)]' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
        }`}
    >
        <Icon className={`w-4.5 h-4.5 transition-colors ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="text-sm tracking-tight">{label}</span>
        {active && (
            <div className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
        )}
    </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { auth, active_role, flash, errors } = usePage().props as any;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showSwitchModal, setShowSwitchModal] = useState(false);
    
    const { data, setData, post, processing: switchProcessing } = useForm({
        email: user?.email || '',
        role: active_role === 'Guru' ? 'Siswa' : 'Guru'
    });

    const handleSwitchRole = (e: React.FormEvent) => {
        e.preventDefault();
        post('/switch-role', {
            onSuccess: () => setShowSwitchModal(false)
        });
    };
    
    const isGuru = active_role === 'Guru';
    const activeName = (auth.user as any)?.name;

    const navItems = isGuru ? [
        { href: "/dashboard/guru", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/dashboard/guru/siswa", icon: User, label: "Data Siswa" },
        { href: "/dashboard/guru/dudis", icon: Building, label: "Mitra DUDI" },
        { href: "/dashboard/guru/magang", icon: Briefcase, label: "Monitoring Magang" },
        { href: "/dashboard/guru/logbook", icon: BookOpen, label: "Logbook Jurnal" },
    ] : [
        { href: "/dashboard/siswa", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/dashboard/siswa/dudi", icon: Building, label: "Cari DUDI" },
        { href: "/dashboard/siswa/magang", icon: Briefcase, label: "Status Magang" },
        { href: "/dashboard/siswa/logbook", icon: BookOpen, label: "Logbook Jurnal" },
        { href: "/dashboard/siswa/kehadiran", icon: CalendarCheck, label: "Kehadiran" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="h-20 flex items-center px-8 border-b border-slate-50">
                 <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                        <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none block">Pramagang</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Management v2</span>
                    </div>
                </Link>
            </div>
            
            <div className="flex-1 px-4 py-8 overflow-y-auto space-y-8 scrollbar-hide">
                <div className="space-y-2">
                    <h4 className="px-4 mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
                        Main Navigation
                    </h4>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const currentPath = window.location.pathname;
                            const isDashboardItem = item.href === '/dashboard/guru' || item.href === '/dashboard/siswa';
                            const isActive = isDashboardItem 
                                ? currentPath === item.href 
                                : currentPath === item.href || currentPath.startsWith(item.href + '/');
                            
                            return (
                                <SidebarLink 
                                    key={item.href}
                                    href={item.href} 
                                    active={isActive} 
                                    icon={item.icon} 
                                    label={item.label} 
                                />
                            );
                        })}
                    </nav>
                </div>

                <div className="space-y-2">
                    <h4 className="px-4 mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
                        Account Settings
                    </h4>
                    <nav className="space-y-1">
                        <button
                            onClick={() => setShowSwitchModal(true)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-sm font-medium w-full text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <Shuffle className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                            </div>
                            <span className="tracking-tight">Switch Dashboard</span>
                        </button>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-sm font-medium w-full text-red-500 hover:bg-red-50"
                        >
                           <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-4 h-4 text-red-400" />
                            </div>
                            <span className="tracking-tight">Sign Out</span>
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="p-6">
                <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center gap-3 group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                {activeName?.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-extrabold text-slate-900 truncate leading-tight uppercase tracking-tight">{activeName || user.name}</p>
                        <p className="text-[11px] text-slate-500 font-bold mt-0.5 tracking-wide flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-primary" />
                            {active_role}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-outfit selection:bg-primary/10">
            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 border-r-0 w-72">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            <div className="flex h-screen overflow-hidden">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 flex-shrink-0 relative z-20 overflow-y-auto bg-white border-r border-slate-100">
                     <SidebarContent />
                </aside>

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Header */}
                    <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-10 sticky top-0">
                        <div className="flex items-center gap-6">
                             <Button variant="ghost" size="icon" className="lg:hidden rounded-xl bg-slate-50 hover:bg-slate-100" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="w-5 h-5 text-slate-600" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group hidden sm:block">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    placeholder="Quick Search..." 
                                    className="h-10 w-48 lg:w-72 pl-10 bg-slate-50 border-transparent hover:bg-slate-100 focus-visible:bg-white focus-visible:border-slate-200 focus-visible:ring-primary/5 transition-all rounded-xl text-[13px] font-medium placeholder:text-slate-400" 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/search?q=${(e.currentTarget as HTMLInputElement).value}`;
                                        }
                                    }}
                                />
                            </div>

                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl relative border-slate-100 bg-white text-slate-400 hover:text-primary hover:border-primary/10 transition-all group overflow-hidden">
                                <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-white animate-pulse" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-10 w-10 rounded-xl relative group p-0 overflow-hidden border border-slate-100 shadow-sm">
                                        <Avatar className="h-full w-full rounded-none">
                                            <AvatarFallback className="bg-primary/5 text-primary font-bold text-[13px]">
                                                 {activeName?.substring(0, 1).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 mt-2 rounded-2xl border-slate-100 shadow-2xl p-2" align="end">
                                    <DropdownMenuLabel className="font-normal px-4 py-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-extrabold text-slate-900 tracking-tight leading-none uppercase">{activeName || user.name}</p>
                                            <p className="text-[11px] font-bold leading-none text-slate-400 mt-1 uppercase tracking-wider">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="mx-2 bg-slate-50" />
                                    <div className="p-1">
                                        <DropdownMenuItem className="cursor-pointer rounded-xl px-4 py-2.5 focus:bg-primary/5 focus:text-primary transition-colors" onClick={() => setShowSwitchModal(true)}>
                                            <Shuffle className="mr-3 h-4 w-4" />
                                            <span className="text-[13px] font-bold tracking-tight">Ganti Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer rounded-xl px-4 py-2.5 focus:bg-primary/5 focus:text-primary transition-colors">
                                            <Settings className="mr-3 h-4 w-4" />
                                            <span className="text-[13px] font-bold tracking-tight">Pengaturan Akun</span>
                                        </DropdownMenuItem>
                                    </div>
                                    <DropdownMenuSeparator className="mx-2 bg-slate-50" />
                                    <div className="p-1">
                                        <DropdownMenuItem className="cursor-pointer rounded-xl px-4 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors" asChild>
                                            <Link href="/logout" method="post" as="button" className="w-full flex items-center">
                                                <LogOut className="mr-3 h-4 w-4" />
                                                <span className="text-[13px] font-bold tracking-tight">Keluar Sistem</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 transition-all duration-300">
                        <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Switch Role Modal */}
            <Dialog open={showSwitchModal} onOpenChange={setShowSwitchModal}>
                <DialogContent className="sm:max-w-[440px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden font-outfit">
                    <div className="p-10">
                        <DialogHeader className="mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <Shuffle className="w-6 h-6" />
                            </div>
                            <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">Switch Role</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium leading-relaxed mt-2 text-sm">
                                Anda akan berpindah dashboard ke portal {active_role === 'Guru' ? 'Siswa' : 'Guru'}. Masukkan email untuk konfirmasi.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSwitchRole} className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Konfirmasi Email</Label>
                                <Input 
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="h-14 bg-slate-50 border-slate-100 focus-visible:bg-white focus-visible:ring-primary/10 focus-visible:border-primary transition-all rounded-2xl text-[13px] font-bold px-5" 
                                    placeholder="Masukkan email terdaftar"
                                    required 
                                />
                                {errors.email && <p className="text-red-500 text-[11px] font-bold px-1 uppercase tracking-tight">{errors.email}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Pilih Portal Tujuan</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'Siswa')}
                                        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300 relative group overflow-hidden ${data.role === 'Siswa' ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-xl'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${data.role === 'Siswa' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-400 shadow-sm group-hover:text-primary'}`}>
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${data.role === 'Siswa' ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>SIM SISWA</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'Guru')}
                                        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300 relative group overflow-hidden ${data.role === 'Guru' ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-xl'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${data.role === 'Guru' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-400 shadow-sm group-hover:text-primary'}`}>
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${data.role === 'Guru' ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>SIM GURU</span>
                                    </button>
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full h-14 rounded-2xl font-extrabold uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={switchProcessing}>
                                    {switchProcessing ? 'BERALIH PORTAL...' : 'KONFIRMASI PERUBAHAN'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}




