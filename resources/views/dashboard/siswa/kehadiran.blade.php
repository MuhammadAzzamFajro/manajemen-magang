@extends('layouts.app')

@section('title', 'Kehadiran - Portal Siswa')

@section('content')
<div class="p-4 md:p-8 text-white">
    <div class="mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-2">Kehadiran</h1>
        <p class="text-gray-400 font-medium">Kelola kehadiran magang Anda</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-12">
        <div class="flex gap-2 bg-gray-950 p-2 rounded-2xl w-full sm:w-fit border border-gray-800 backdrop-blur-md shadow-2xl">
            <a href="{{ route('dashboard.siswa') }}"
               class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:bg-gray-800">
                <i class="fas fa-user-graduate"></i>
                Siswa
            </a>
            <button class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-cyan-600 text-white shadow-xl shadow-cyan-600/30">
                <i class="fas fa-calendar-check"></i>
                Kehadiran
            </button>
        </div>
    </div>

    <!-- Statistics Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2.5rem] shadow-2xl hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-percentage text-xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Persentase</span>
            </div>
            <h3 class="text-3xl font-black text-white mb-2">{{ $attendanceStats['percentage'] }}%</h3>
            <p class="text-gray-500 text-xs font-medium">{{ $attendanceStats['present_days'] }}/{{ $attendanceStats['working_days'] }} Hari Kerja</p>
        </div>

        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2.5rem] shadow-2xl hover:border-green-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-check-circle text-xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hadir</span>
            </div>
            <h3 class="text-3xl font-black text-white mb-2">{{ $attendanceStats['present_days'] }}</h3>
            <p class="text-gray-500 text-xs font-medium">Hari</p>
        </div>

        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2.5rem] shadow-2xl hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-yellow-600/20 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-clock text-xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Izin</span>
            </div>
            <h3 class="text-3xl font-black text-white mb-2">{{ $attendanceStats['permission_days'] }}</h3>
            <p class="text-gray-500 text-xs font-medium">Hari</p>
        </div>

        <div class="group bg-gray-900 border border-gray-800 p-6 rounded-[2.5rem] shadow-2xl hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02]">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                    <i class="fas fa-times-circle text-xl"></i>
                </div>
                <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tidak Hadir</span>
            </div>
            <h3 class="text-3xl font-black text-white mb-2">{{ $attendanceStats['absent_days'] }}</h3>
            <p class="text-gray-500 text-xs font-medium">Hari</p>
        </div>
    </div>

    <!-- Attendance Form -->
    <div class="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl mb-10">
        <h2 class="text-2xl font-black text-white mb-6">Tandai Kehadiran Hari Ini</h2>

        <form id="attendanceForm" class="space-y-6">
            @csrf
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Status Kehadiran</label>
                    <select name="status" id="status" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300">
                        <option value="">Pilih Status</option>
                        <option value="Hadir">Hadir</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Izin">Izin</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Catatan (Opsional)</label>
                    <textarea name="catatan" id="catatan" rows="3" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" placeholder="Tambahkan catatan jika diperlukan..."></textarea>
                </div>
            </div>

            <button type="submit" class="w-full md:w-auto px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50">
                <i class="fas fa-save mr-2"></i>
                Simpan Kehadiran
            </button>
        </form>
    </div>

    <!-- Recent Attendance History -->
    <div class="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
        <h2 class="text-2xl font-black text-white mb-6">Riwayat Kehadiran Terbaru</h2>

        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Tanggal</th>
                        <th class="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                        <th class="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Catatan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                    @forelse($recentAttendances as $attendance)
                    <tr class="hover:bg-gray-800/50 transition-all duration-300">
                        <td class="px-4 py-4 text-white font-medium">{{ $attendance->tanggal->format('d M Y') }}</td>
                        <td class="px-4 py-4">
                            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                                @if($attendance->status == 'Hadir') bg-green-600/20 text-green-400
                                @elseif($attendance->status == 'Sakit') bg-yellow-600/20 text-yellow-400
                                @elseif($attendance->status == 'Izin') bg-blue-600/20 text-blue-400
                                @else bg-red-600/20 text-red-400 @endif">
                                {{ $attendance->status }}
                            </span>
                        </td>
                        <td class="px-4 py-4 text-gray-400">{{ $attendance->catatan ?: '-' }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                            <i class="fas fa-calendar-times text-3xl mb-2 block"></i>
                            Belum ada data kehadiran
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
document.getElementById('attendanceForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Disable button and show loading immediately
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';

    // Optimized fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    fetch('{{ route("siswa.kehadiran.store") }}', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            
            // Capture values BEFORE reset
            const statusSelect = document.getElementById('status');
            const selectedStatusText = statusSelect.options[statusSelect.selectedIndex].text;
            const selectedStatusValue = statusSelect.value;
            const notes = document.getElementById('catatan').value;

            this.reset();
            
            // Pass captured values
            updateAttendanceStats(selectedStatusText, notes);
            updateStatsCards(selectedStatusValue);
        } else {
            showNotification(data.message || 'Terjadi kesalahan', 'error');
        }
    })
    // ...
    // ... code ...
    // ...

// Function to update statistics cards dynamically
function updateStatsCards(selectedStatus) {
    if (!selectedStatus) return;

    // Update the stats cards with animation
    const statsCards = document.querySelectorAll('.group');
    statsCards.forEach(card => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    });

    // Refresh the page after a short delay to get updated stats
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Function to update attendance stats without full page reload
function updateAttendanceStats(selectedStatusText, notes) {
    // Add the new attendance to the history table
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    // Create new table row
    const tbody = document.querySelector('tbody');
    if (tbody) {
        const newRow = document.createElement('tr');
        newRow.className = 'hover:bg-gray-800/50 transition-all duration-300';
        newRow.innerHTML = `
            <td class="px-4 py-4 text-white font-medium">${formattedDate}</td>
            <td class="px-4 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                    ${getStatusClass(selectedStatusText)}">
                    ${selectedStatusText}
                </span>
            </td>
            <td class="px-4 py-4 text-gray-400">${notes || '-'}</td>
        `;

        // Insert at the beginning of the table
        tbody.insertBefore(newRow, tbody.firstChild);

        // Remove the "no data" row if it exists
        const noDataRow = tbody.querySelector('tr td[colspan="3"]');
        if (noDataRow) {
            noDataRow.parentElement.remove();
        }
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'Hadir': return 'bg-green-600/20 text-green-400';
        case 'Sakit': return 'bg-yellow-600/20 text-yellow-400';
        case 'Izin': return 'bg-blue-600/20 text-blue-400';
        default: return 'bg-red-600/20 text-red-400';
    }
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-xl font-bold shadow-2xl z-50 ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
        ${message}
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
</script>
@endsection
