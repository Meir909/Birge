// Dashboard JavaScript functionality
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadRecentTrips();
        this.loadStats();
    }

    async loadUserData() {
        try {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('biroad_token')}`
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                this.updateUserProfile(user);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/users/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('biroad_token')}`
                }
            });
            
            if (response.ok) {
                const stats = await response.json();
                this.updateStats(stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async loadRecentTrips() {
        try {
            const response = await fetch('/api/rides/recent', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('biroad_token')}`
                }
            });
            
            if (response.ok) {
                const trips = await response.json();
                this.updateTripsTable(trips);
            }
        } catch (error) {
            console.error('Error loading trips:', error);
        }
    }

    updateUserProfile(user) {
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.name || user.email || 'User';
        }
    }

    updateStats(stats) {
        const totalTripsEl = document.querySelector('[data-stats="trips"]');
        const co2SavedEl = document.querySelector('[data-stats="co2"]');
        const fuelSavingsEl = document.querySelector('[data-stats="fuel"]');
        const pointsEl = document.querySelector('[data-stats="points"]');

        if (totalTripsEl) totalTripsEl.textContent = stats.totalTrips || 0;
        if (co2SavedEl) co2SavedEl.textContent = stats.co2Saved || 0;
        if (fuelSavingsEl) fuelSavingsEl.textContent = `$${stats.fuelSavings || 0}`;
        if (pointsEl) pointsEl.textContent = stats.points || 0;
    }

    updateTripsTable(trips) {
        const tbody = document.querySelector('#trips-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        trips.forEach(trip => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4">${new Date(trip.date).toLocaleDateString()}</td>
                <td class="px-6 py-4">
                    <span class="material-symbols-outlined text-primary text-xl">${this.getTransportIcon(trip.method)}</span>
                    <span class="text-sm font-medium">${trip.method}</span>
                </td>
                <td class="px-6 py-4">${trip.distance} km</td>
                <td class="px-6 py-4">${trip.co2Saved} kg</td>
                <td class="px-6 py-4">
                    <span class="text-white font-bold text-xs bg-slate-800 px-2 py-1 rounded-full">${trip.status}</span>
                </td>
                <td class="px-6 py-4 text-right">${trip.points}</td>
            `;
            tbody.appendChild(row);
        });
    }

    getTransportIcon(method) {
        const icons = {
            'bicycle': 'directions_bike',
            'bus': 'directions_bus',
            'car': 'directions_car',
            'walk': 'directions_walk'
        };
        return icons[method] || 'directions_car';
    }

    setupEventListeners() {
        // Filter button
        const filterBtn = document.querySelector('[data-action="filter"]');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.showFilterModal());
        }

        // View all badges button
        const badgesBtn = document.querySelector('[data-action="view-badges"]');
        if (badgesBtn) {
            badgesBtn.addEventListener('click', () => this.showAllBadges());
        }

        // View history button
        const historyBtn = document.querySelector('[data-action="view-history"]');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showFullHistory());
        }
    }

    showFilterModal() {
        // Implement filter modal
        console.log('Show filter modal');
    }

    showAllBadges() {
        // Implement badges view
        console.log('Show all badges');
    }

    showFullHistory() {
        // Implement full history view
        console.log('Show full history');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
