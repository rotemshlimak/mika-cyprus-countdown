/**
 * Mika's Greece Pilion Vacation Countdown Chart
 * Hebrew RTL Interactive Calendar
 */

class MikaCountdown {
    constructor() {
        // Target vacation date - August 21, 2025
        this.vacationDate = new Date('2025-08-21');
        this.vacationEndDate = new Date('2025-08-28');
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
        
        // Hebrew month names
        this.hebrewMonths = [
            'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
            'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
        ];
        
        // Encouragement messages for Mika
        this.encouragementMessages = [
            'מיקה, עוד מעט תהיי ביוון פיליון עם הרי הקנטאורים הקסומים!',
            'הרי פיליון הירוקים והמים הכחולים מחכים למיקה המתוקה!',
            'עוד קצת סבלנות מיקה, החופשה היוונית שלך מתקרבת!',
            'מיקה הולכת ליהנות כל כך ביוון פיליון הקסום!',
            'החופשה של מיקה ביוון פיליון הולכת להיות מדהימה!',
            'הרי הקנטאורים והחופים הסמויים מחכים למיקה!',
            'עוד מעט מיקה תטייל ביערות הבוק העתיקים!',
            'מיקה, יוון פיליון הולכת להיות החופשה הכי יפה שלך!'
        ];
        
        // Load saved progress
        this.markedDays = this.loadProgress();
        
        this.initializeElements();
        this.generateCalendar();
        this.updateCountdown();
        this.updateProgress();
        this.updateEncouragement();
        
        // Update countdown every minute
        setInterval(() => this.updateCountdown(), 60000);
        
        // Change encouragement message every 10 seconds
        setInterval(() => this.updateEncouragement(), 10000);
    }

    initializeElements() {
        this.daysLeftElement = document.getElementById('daysLeft');
        this.progressFillElement = document.getElementById('progressFill');
        this.progressTextElement = document.getElementById('progressText');
        this.markedCountElement = document.getElementById('markedCount');
        this.calendarGridElement = document.getElementById('calendarGrid');
        this.encouragementTextElement = document.getElementById('encouragementText');
        this.celebrationModal = document.getElementById('celebrationModal');
        this.notificationArea = document.getElementById('notificationArea');
        
        // Initialize Greece facts click functionality
        this.initializeGreeceFactsClick();
    }

    calculateDaysUntilVacation() {
        const timeDiff = this.vacationDate.getTime() - this.today.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    calculateRemainingDaysFromDate(fromDate) {
        const timeDiff = this.vacationDate.getTime() - fromDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
    }

    generateCalendar() {
        // Calendar from today (July 13, 2025) to vacation start (August 21, 2025)
        this.calendarGridElement.innerHTML = '';
        
        // Start from today
        const startDate = new Date(this.today);
        const endDate = new Date(this.vacationDate);
        
        let currentMonth = -1;
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            // Add month header when month changes
            if (currentDate.getMonth() !== currentMonth) {
                currentMonth = currentDate.getMonth();
                this.addMonthHeader(currentDate);
            }
            
            this.createDayElement(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    addMonthHeader(date) {
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        monthHeader.textContent = `${this.hebrewMonths[date.getMonth()]} ${date.getFullYear()}`;
        this.calendarGridElement.appendChild(monthHeader);
    }

    createDayElement(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.dataset.date = date.toISOString().split('T')[0];
        
        const dayOfMonth = date.getDate();
        const monthNumber = date.getMonth() + 1;
        
        // Format date as DD.MM
        const formattedDate = `${dayOfMonth.toString().padStart(2, '0')}.${monthNumber.toString().padStart(2, '0')}`;

        // Hebrew day names
        const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        const dayName = `יום ${hebrewDays[date.getDay()]}`;

        // Check if this is the flight day (August 21st)
        const isFlightDay = (date.getTime() === this.vacationDate.getTime());
        
        // Check if this is a pre-flight day (August 19th and 20th)
        const isPreFlightDay = (date.getTime() === new Date('2025-08-19').getTime()) || 
                              (date.getTime() === new Date('2025-08-20').getTime());
        
        if (isFlightDay) {
            // Flight day with same format as today
            dayElement.classList.add('flight-day');
            const flightDayNameDiv = `<div class="calendar-dayname" style="text-align:center;background:#FFD700;color:#fff;font-weight:bold;padding:4px 0;border-radius:6px 6px 0 0;">${dayName}</div>`;
            const flightDateDiv = `<div class="calendar-date" style="text-align:center;background:#ffe0b2;color:#222;padding:4px 0;">תאריך: ${formattedDate}</div>`;
            const flightDestinationDiv = `<div class="calendar-remaining" style="text-align:center;background:#ffe082;color:#222;padding:4px 0;border-radius:0 0 6px 6px;">✈️ טסה ליוון! 🇬🇷</div>`;
            dayElement.innerHTML = `${flightDayNameDiv}${flightDateDiv}${flightDestinationDiv}`;
            dayElement.style.cursor = 'pointer';
            dayElement.addEventListener('click', () => {
                this.showFlightModal();
            });
            
            // Add hover sound effect
            dayElement.addEventListener('mouseenter', () => {
                this.playFlightSound();
                this.createFlightDayFloatingEffects(dayElement);
            });
            
        } else if (isPreFlightDay) {
            // Pre-flight preparation days
            dayElement.classList.add('pre-flight-day');
            const prepMessage = date.getDate() === 19 ? 'הכנות לטיסה' : 'ארזון מזוודות';
            dayElement.innerHTML = `
                <div class="calendar-dayname" style="text-align:center;background:#ff6b35;color:#fff;font-weight:bold;padding:4px 0;border-radius:6px 6px 0 0;">${dayName} 🧳</div>
                <div class="calendar-date" style="text-align:center;background:#ffe0b2;color:#222;padding:4px 0;">${formattedDate}</div>
                <div class="calendar-remaining" style="text-align:center;background:#ffd54f;color:#222;padding:4px 0;border-radius:0 0 6px 6px;">${prepMessage}</div>
            `;
            dayElement.style.cursor = 'pointer';
            dayElement.addEventListener('click', () => this.toggleDay(dayElement, date));
            
        } else {
            // Regular countdown days
            let remainingDays = this.calculateRemainingDaysFromDate(date);
            if (remainingDays < 0) remainingDays = 0;
            
            const dayNameDiv = `<div class="calendar-dayname" style="text-align:center;background:#ffe4e1;padding:2px 0;border-radius:6px 6px 0 0;">${dayName}</div>`;
            const dateDiv = `<div class="calendar-date" style="text-align:center;background:#e0f7fa;padding:2px 0;">תאריך: ${formattedDate}</div>`;
            const remainingDiv = `<div class="calendar-remaining" style="text-align:center;background:#fff9c4;padding:2px 0;border-radius:0 0 6px 6px;">נותרו: ${remainingDays} ימים</div>`;
            
            if (date.getTime() === this.today.getTime()) {
                // Today
                dayElement.classList.add('today');
                const todayDayNameDiv = `<div class="calendar-dayname" style="text-align:center;background:#0083b0;color:#fff;font-weight:bold;padding:4px 0;border-radius:6px 6px 0 0;">${dayName}</div>`;
                const todayDateDiv = `<div class="calendar-date" style="text-align:center;background:#b2ebf2;color:#222;padding:4px 0;">תאריך: ${formattedDate}</div>`;
                const todayRemainingDiv = `<div class="calendar-remaining" style="text-align:center;background:#ffe082;color:#222;padding:4px 0;border-radius:0 0 6px 6px;">נותרו: ${remainingDays} ימים</div>`;
                dayElement.innerHTML = `${todayDayNameDiv}${todayDateDiv}${todayRemainingDiv}`;
                dayElement.style.cursor = 'pointer';
                dayElement.addEventListener('click', () => this.toggleDay(dayElement, date));
            } else if (date.getTime() < this.today.getTime()) {
                // Past days (shouldn't happen since we start from today)
                dayElement.classList.add('past');
                dayElement.innerHTML = `${dayNameDiv}${dateDiv}${remainingDiv}`;
                dayElement.style.cursor = 'pointer';
                dayElement.addEventListener('click', () => this.toggleDay(dayElement, date));
            } else {
                // Future days before vacation - not clickable
                dayElement.innerHTML = `${dayNameDiv}${dateDiv}${remainingDiv}`;
                dayElement.style.cursor = 'not-allowed';
                dayElement.addEventListener('click', () => {
                    this.showNotification('לא ניתן לסמן ימים עתידיים');
                });
            }
        }
        
        // Check if day is marked
        if (this.markedDays.includes(dayElement.dataset.date)) {
            dayElement.classList.add('marked');
        }
        
        this.calendarGridElement.appendChild(dayElement);
    }

    toggleDay(dayElement, date) {
        const dateString = dayElement.dataset.date;
        
        // Don't allow marking vacation days
        if (date >= this.vacationDate && date <= this.vacationEndDate) {
            this.showNotification('לא ניתן לסמן ימי חופשה');
            return;
        }
        
        if (dayElement.classList.contains('marked')) {
            // Unmark the day
            dayElement.classList.remove('marked');
            this.markedDays = this.markedDays.filter(d => d !== dateString);
            this.showNotification('הסימון הוסר מהיום הזה');
        } else {
            // Mark the day
            dayElement.classList.add('marked');
            this.markedDays.push(dateString);
            this.showCelebration();
            this.playClickSound();
        }
        
        this.saveProgress();
        this.updateProgress();
    }

    updateCountdown() {
        const daysLeft = this.calculateDaysUntilVacation();
        this.daysLeftElement.textContent = daysLeft;
        
        // Special messages based on days left
        if (daysLeft <= 7) {
            this.daysLeftElement.style.animation = 'counterPulse 1s ease-in-out infinite';
        } else if (daysLeft <= 30) {
            this.daysLeftElement.style.animation = 'counterPulse 2s ease-in-out infinite';
        }
    }

    updateProgress() {
        const totalDays = this.calculateDaysUntilVacation();
        const markedCount = this.markedDays.length;
        const progressPercentage = totalDays > 0 ? Math.round((markedCount / totalDays) * 100) : 0;
        
        this.progressFillElement.style.width = `${progressPercentage}%`;
        this.progressTextElement.textContent = `${progressPercentage}%`;
        this.markedCountElement.textContent = markedCount;
        
        // Special effects for high progress
        if (progressPercentage >= 75) {
            this.progressFillElement.style.animation = 'progressShine 1s infinite';
        } else if (progressPercentage >= 50) {
            this.progressFillElement.style.animation = 'progressShine 2s infinite';
        }
    }

    updateEncouragement() {
        const randomMessage = this.encouragementMessages[
            Math.floor(Math.random() * this.encouragementMessages.length)
        ];
        this.encouragementTextElement.textContent = randomMessage;
        
        // Add sparkle effect
        this.encouragementTextElement.style.animation = 'none';
        setTimeout(() => {
            this.encouragementTextElement.style.animation = 'iconBounce 0.5s ease';
        }, 10);
    }

    showCelebration() {
        // Random celebration messages
        const celebrationMessages = [
            'יופי מיקה! עוד יום קרוב יותר לחופשה ביוון פיליון!',
            'כל הכבוד מיקה! הרי הקנטאורים מחכים לך!',
            'מעולה מיקה! עוד קצת והחופשה היוונית תתחיל!',
            'נהדר מיקה! את הולכת ליהנות ביוון פיליון!',
            'איזה יופי מיקה! החופשה היוונית מתקרבת!'
        ];
        
        const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
        
        // Update modal content
        const modalTitle = this.celebrationModal.querySelector('h2');
        const modalText = this.celebrationModal.querySelector('p');
        
        modalTitle.textContent = 'יופי מיקה!';
        modalText.textContent = message;
        
        // Show modal
        this.celebrationModal.classList.add('show');
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.closeCelebration();
        }, 3000);
    }

    closeCelebration() {
        this.celebrationModal.classList.remove('show');
    }

    showNotification(message) {
        // Remove existing notifications
        const existingNotifications = this.notificationArea.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        this.notificationArea.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    playClickSound() {
        // Create audio context for click feedback
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Click sound played (audio not supported)');
        }
    }

    saveProgress() {
        try {
            // Set cookie to expire after vacation date (August 28, 2025)
            const expirationDate = new Date('2025-08-29'); // Day after vacation
            this.setCookie('mikaGreeceCountdownProgress', JSON.stringify(this.markedDays), expirationDate);
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    loadProgress() {
        try {
            const saved = this.getCookie('mikaGreeceCountdownProgress');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load progress:', error);
            return [];
        }
    }

    // Cookie helper functions
    setCookie(name, value, expirationDate) {
        const expires = expirationDate ? `; expires=${expirationDate.toUTCString()}` : '';
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
            }
        }
        return null;
    }

    // Helper method to format Hebrew dates
    formatHebrewDate(date) {
        const day = date.getDate();
        const month = this.hebrewMonths[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ב${month} ${year}`;
    }

    // Add special holiday effects
    addSpecialEffects() {
        // Create floating azure hearts occasionally
        if (Math.random() < 0.1) { // 10% chance
            this.createFloatingHeart();
        }
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.textContent = '💙';
        heart.style.position = 'fixed';
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        heart.style.animation = 'bubbleFloat 4s linear forwards';
        
        document.body.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 4000);
    }

    initializeGreeceFactsClick() {
        // Add click functionality to the Greece facts section
        const greeceFactsSection = document.querySelector('.cyprus-facts');
        const greeceFactsHeader = greeceFactsSection?.querySelector('h3');
        const factItems = greeceFactsSection?.querySelectorAll('.fact-item');
        
        if (greeceFactsSection) {
            // Make the header clickable
            if (greeceFactsHeader) {
                greeceFactsHeader.style.cursor = 'pointer';
                greeceFactsHeader.style.transition = 'all 0.3s ease';
                
                greeceFactsHeader.addEventListener('click', () => {
                    this.openGreeceFactsPage();
                });
                
                greeceFactsHeader.addEventListener('mouseenter', () => {
                    greeceFactsHeader.style.transform = 'scale(1.05)';
                    greeceFactsHeader.style.color = '#0083b0';
                });
                
                greeceFactsHeader.addEventListener('mouseleave', () => {
                    greeceFactsHeader.style.transform = 'scale(1)';
                    greeceFactsHeader.style.color = '';
                });
            }
            
            // Make each fact item clickable
            factItems.forEach(factItem => {
                factItem.style.cursor = 'pointer';
                factItem.style.transition = 'all 0.3s ease';
                
                factItem.addEventListener('click', () => {
                    this.openGreeceFactsPage();
                });
                
                factItem.addEventListener('mouseenter', () => {
                    factItem.style.transform = 'translateY(-3px)';
                    factItem.style.boxShadow = '0 8px 25px rgba(0, 131, 176, 0.3)';
                });
                
                factItem.addEventListener('mouseleave', () => {
                    factItem.style.transform = 'translateY(0)';
                    factItem.style.boxShadow = '';
                });
            });
        }
    }

    openGreeceFactsPage() {
        // Show notification
        this.showNotification('פותח דף עובדות על יוון פיליון מלא בתמונות ומידע מרתק!');
        
        // Play click sound
        this.playClickSound();
        
        // Open the Greece facts page in a new tab
        window.open('greece-facts.html', '_blank');
    }

    // Enhanced Flight Day Methods
    showFlightModal() {
        // Create flight modal if it doesn't exist
        if (!document.getElementById('flightModal')) {
            this.createFlightModal();
        }
        
        const flightModal = document.getElementById('flightModal');
        flightModal.classList.add('show');
        
        // Play takeoff sound
        this.playTakeoffSound();
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            this.closeFlightModal();
        }, 5000);
    }

    createFlightModal() {
        const modal = document.createElement('div');
        modal.id = 'flightModal';
        modal.className = 'flight-modal';
        modal.innerHTML = `
            <div class="flight-modal-content">
                <div class="flight-modal-header">
                    <div class="takeoff-animation">
                        <div class="airplane-takeoff">✈️</div>
                    </div>
                    <h2>🎉 יום הטיסה הגדול של מיקה! 🎉</h2>
                </div>
                <div class="flight-details">
                    <div class="flight-info">
                        <div class="flight-route">
                            <span class="departure">🏠 ישראל</span>
                            <span class="flight-arrow">✈️ ➡️</span>
                            <span class="arrival">🇬🇷 יוון פיליון</span>
                        </div>
                        <div class="flight-time">🕐 טיסה: 14:30</div>
                        <div class="flight-duration">⏱️ משך טיסה: 3 שעות</div>
                        <div class="flight-excitement">🌟 החופשה מתחילה!</div>
                    </div>
                    <div class="flight-wishes">
                        <p>🎊 מיקה, זהו היום שחיכית לו!</p>
                        <p>🏔️ הרי הקנטאורים מחכים לך!</p>
                        <p>🌊 המים הכחולים של יוון פיליון!</p>
                        <p>✨ טיסה נעימה ובטוחה!</p>
                    </div>
                </div>
                <div class="flight-confetti">
                    <div class="confetti">🎊</div>
                    <div class="confetti">🎉</div>
                    <div class="confetti">⭐</div>
                    <div class="confetti">✨</div>
                    <div class="confetti">🎊</div>
                    <div class="confetti">🎉</div>
                </div>
                <button class="close-flight-modal" onclick="window.mikaCountdown.closeFlightModal()">
                    סגור ✈️
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    closeFlightModal() {
        const flightModal = document.getElementById('flightModal');
        if (flightModal) {
            flightModal.classList.remove('show');
        }
    }

    playFlightSound() {
        // Create flight hover sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Airplane engine sound simulation
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Flight sound played (audio not supported)');
        }
    }

    playTakeoffSound() {
        // Create takeoff sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Takeoff sound simulation
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log('Takeoff sound played (audio not supported)');
        }
    }

    // Create floating effects around flight day
    createFlightDayFloatingEffects(dayElement) {
        const rect = dayElement.getBoundingClientRect();
        const emojis = ['🎈', '🎊', '✨', '⭐', '🌟', '💫', '🎉', '🔥'];
        
        // Create 6 floating elements around the flight day
        for (let i = 0; i < 6; i++) {
            const floatingElement = document.createElement('div');
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            floatingElement.textContent = emoji;
            floatingElement.style.position = 'fixed';
            floatingElement.style.fontSize = '1.5rem';
            floatingElement.style.pointerEvents = 'none';
            floatingElement.style.zIndex = '1000';
            
            // Random position around the flight day
            const angle = (360 / 6) * i + Math.random() * 60;
            const distance = 80 + Math.random() * 40;
            const x = rect.left + rect.width/2 + Math.cos(angle * Math.PI/180) * distance;
            const y = rect.top + rect.height/2 + Math.sin(angle * Math.PI/180) * distance;
            
            floatingElement.style.left = x + 'px';
            floatingElement.style.top = y + 'px';
            floatingElement.style.animation = `flightDayFloat 3s ease-out forwards`;
            
            document.body.appendChild(floatingElement);
            
            // Remove after animation
            setTimeout(() => {
                if (floatingElement.parentNode) {
                    floatingElement.remove();
                }
            }, 3000);
        }
    }
}

// Global function for modal close button
function closeCelebration() {
    if (window.mikaCountdown) {
        window.mikaCountdown.closeCelebration();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add some initial floating effects
    setTimeout(() => {
        window.mikaCountdown = new MikaCountdown();
        
        // Add periodic special effects
        setInterval(() => {
            window.mikaCountdown.addSpecialEffects();
        }, 5000);
        
    }, 300);
});

// Add some extra CSS animations, calendar hover style, and X mark overlay via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes floatingHeart {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    .calendar-day:hover .calendar-dayname,
    .calendar-day:hover .calendar-date,
    .calendar-day:hover .calendar-remaining {
        color: unset !important;
    }
    .calendar-day.marked {
        position: relative;
        background: #ffeaea !important;
    }
    .calendar-day.marked::after {
        content: "✗";
        color: #d32f2f;
        font-size: 3em;
        font-weight: bold;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0.85;
        z-index: 2;
    }
    .calendar-day.marked > * {
        opacity: 0.25;
    }
`;
document.head.appendChild(style);

// Console messages for Mika
console.log('💙 לוח הספירה של מיקה לחופשה ביוון פיליון נטען בהצלחה! 💙');
console.log('🇬🇷 מיקה, החופשה שלך ביוון פיליון הולכת להיות מדהימה! 🇬🇷');
console.log('🏔️ הרי הקנטאורים מחכים לך! 🏔️');
