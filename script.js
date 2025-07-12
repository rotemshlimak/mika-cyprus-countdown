/**
 * Mika's Azure Cyprus Vacation Countdown Chart
 * Hebrew RTL Interactive Calendar
 */

class MikaCountdown {
    constructor() {
        // Target vacation date - July 22, 2025
        this.vacationDate = new Date('2025-07-22');
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
        
        // Hebrew month names
        this.hebrewMonths = [
            'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
            'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
        ];
        
        // Encouragement messages for Mika
        this.encouragementMessages = [
            'מיקה, עוד מעט תהיי בקפריסין עם המים הכחולים הכי יפים!',
            'המים הכחולים של קפריסין מחכים למיקה המתוקה!',
            'עוד קצת סבלנות מיקה, החופשה הכחולה שלך מתקרבת!',
            'מיקה הולכת ליהנות כל כך בחוף הים הכחול של קפריסין!',
            'החופשה של מיקה בקפריסין הולכת להיות מדהימה!',
            'המים הכחולים והחול הזהוב מחכים למיקה!',
            'עוד מעט מיקה תשחה במים הכי כחולים וצלולים!',
            'מיקה, קפריסין הולכת להיות החופשה הכי יפה שלך!'
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
        this.daysRemainingTableElement = document.getElementById('daysRemainingTable');
        this.progressFillElement = document.getElementById('progressFill');
        this.progressTextElement = document.getElementById('progressText');
        this.markedCountElement = document.getElementById('markedCount');
        this.calendarGridElement = document.getElementById('calendarGrid');
        this.encouragementTextElement = document.getElementById('encouragementText');
        this.celebrationModal = document.getElementById('celebrationModal');
        this.notificationArea = document.getElementById('notificationArea');
        
        // Initialize Cyprus facts click functionality
        this.initializeCyprusFactsClick();
    }

    calculateDaysUntilVacation() {
        const timeDiff = this.vacationDate.getTime() - this.today.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    calculateRemainingDaysFromDate(fromDate) {
        const timeDiff = this.vacationDate.getTime() - fromDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    generateCalendar() {
        // Static calendar: July 11–22, 2025
        this.calendarGridElement.innerHTML = '';
        let currentMonth = -1;
        const year = 2025;
        const month = 6; // July (0-based)
        for (let day = 11; day <= 22; day++) {
            const currentDate = new Date(year, month, day);
            if (currentDate.getMonth() !== currentMonth) {
                currentMonth = currentDate.getMonth();
                this.addMonthHeader(currentDate);
            }
            this.createDayElement(currentDate, day - 11);
        }
        // July 22 is now the last calendar day; no separate vacation message
    }

    addMonthHeader(date) {
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        monthHeader.textContent = `${this.hebrewMonths[date.getMonth()]} ${date.getFullYear()}`;
        this.calendarGridElement.appendChild(monthHeader);
    }

    createDayElement(date, dayIndex) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.dataset.date = date.toISOString().split('T')[0];
        
        // Calculate remaining days from this date to vacation (subtract 1 so 21/7 shows 1, 22/7 shows 0)
        let remainingDays = this.calculateRemainingDaysFromDate(date) - 1;
        if (remainingDays < 0) remainingDays = 0;
        const dayOfMonth = date.getDate();
        const monthNumber = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
        
        // Format date as DD.MM
        const formattedDate = `${dayOfMonth.toString().padStart(2, '0')}.${monthNumber.toString().padStart(2, '0')}`;

        // Hebrew day names
        const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        const dayName = `יום ${hebrewDays[date.getDay()]}`;

        // Show day name, date, and remaining days each in a new row with different background colors
        const isFlightDay = (date.getDate() === 22 && date.getMonth() === 6 && date.getFullYear() === 2025);
        const dayNameDiv = `<div class="calendar-dayname" style="text-align:center;background:#ffe4e1;padding:2px 0;border-radius:6px 6px 0 0;">${dayName}</div>`;
        const dateDiv = `<div class="calendar-date" style="text-align:center;background:#e0f7fa;padding:2px 0;">תאריך: ${formattedDate}</div>`;
        const remainingDiv = `<div class="calendar-remaining" style="text-align:center;background:#fff9c4;padding:2px 0;border-radius:0 0 6px 6px;">נותרו: ${remainingDays} ימים</div>`;
        // Special colors for current day
        if (isFlightDay) {
            dayElement.classList.add('flight-day');
            dayElement.innerHTML = `<div class="calendar-dayname" style="text-align:center;background:#ff9800;color:#fff;font-weight:bold;padding:4px 0;border-radius:6px 6px 0 0;">${dayName} ✈️</div>
<div class="calendar-date" style="text-align:center;background:#ffe0b2;color:#222;padding:4px 0;">${formattedDate} - מיקה טסה לקפריסין!</div>
<div class="calendar-remaining" style="text-align:center;background:#ffd54f;color:#222;padding:4px 0;border-radius:0 0 6px 6px;">יום הטיסה!</div>`;
            // Flight day is not clickable (future day)
            dayElement.style.cursor = 'not-allowed';
            dayElement.addEventListener('click', () => {
                this.showNotification('זהו יום הטיסה!');
            });
        } else if (date.getTime() === this.today.getTime()) {
            dayElement.classList.add('today');
            const todayDayNameDiv = `<div class="calendar-dayname" style="text-align:center;background:#0083b0;color:#fff;font-weight:bold;padding:4px 0;border-radius:6px 6px 0 0;">${dayName}</div>`;
            const todayDateDiv = `<div class="calendar-date" style="text-align:center;background:#b2ebf2;color:#222;padding:4px 0;">תאריך: ${formattedDate}</div>`;
            const todayRemainingDiv = `<div class="calendar-remaining" style="text-align:center;background:#ffe082;color:#222;padding:4px 0;border-radius:0 0 6px 6px;">נותרו: ${remainingDays} ימים</div>`;
            dayElement.innerHTML = `${todayDayNameDiv}
${todayDateDiv}
${todayRemainingDiv}`;
            // Today is also clickable
            dayElement.style.cursor = 'pointer';
            dayElement.addEventListener('click', () => this.toggleDay(dayElement, date));
        } else {
            dayElement.innerHTML = `${dayNameDiv}
${dateDiv}
${remainingDiv}`;
            if (date.getTime() < this.today.getTime()) {
                dayElement.classList.add('past');
                // Past days are clickable
                dayElement.style.cursor = 'pointer';
                dayElement.addEventListener('click', () => this.toggleDay(dayElement, date));
            } else {
                // Future day - not clickable, but show notification if clicked
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

    createVacationDay() {
        const vacationElement = document.createElement('div');
        vacationElement.className = 'calendar-day vacation-day';
        vacationElement.textContent = 'מיקה טסה לקפריסין ✈️';
        this.calendarGridElement.appendChild(vacationElement);
    }

    toggleDay(dayElement, date) {
        const dateString = dayElement.dataset.date;
        
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
        
        // Update the table element with static days from 10/7/2025
        if (this.daysRemainingTableElement) {
            const staticDate = new Date('2025-07-10');
            const staticDaysLeft = this.calculateRemainingDaysFromDate(staticDate);
            this.daysRemainingTableElement.textContent = staticDaysLeft;
        }
        
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
            'יופי מיקה! עוד יום קרוב יותר לחופשה בקפריסין!',
            'כל הכבוד מיקה! המים הכחולים מחכים לך!',
            'מעולה מיקה! עוד קצת והחופשה תתחיל!',
            'נהדר מיקה! אתך הולכת ליהנות בקפריסין!',
            'איזה יופי מיקה! החופשה מתקרבת!'
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
            // Set cookie to expire after vacation date (July 22, 2025)
            const expirationDate = new Date('2025-07-23'); // Day after vacation
            this.setCookie('mikaCountdownProgress', JSON.stringify(this.markedDays), expirationDate);
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    loadProgress() {
        try {
            const saved = this.getCookie('mikaCountdownProgress');
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

    initializeCyprusFactsClick() {
        // Add click functionality to the Cyprus facts section
        const cyprusFactsSection = document.querySelector('.cyprus-facts');
        const cyprusFactsHeader = cyprusFactsSection?.querySelector('h3');
        const factItems = cyprusFactsSection?.querySelectorAll('.fact-item');
        
        if (cyprusFactsSection) {
            // Make the header clickable
            if (cyprusFactsHeader) {
                cyprusFactsHeader.style.cursor = 'pointer';
                cyprusFactsHeader.style.transition = 'all 0.3s ease';
                
                cyprusFactsHeader.addEventListener('click', () => {
                    this.openCyprusFactsPage();
                });
                
                cyprusFactsHeader.addEventListener('mouseenter', () => {
                    cyprusFactsHeader.style.transform = 'scale(1.05)';
                    cyprusFactsHeader.style.color = '#0083b0';
                });
                
                cyprusFactsHeader.addEventListener('mouseleave', () => {
                    cyprusFactsHeader.style.transform = 'scale(1)';
                    cyprusFactsHeader.style.color = '';
                });
            }
            
            // Make each fact item clickable
            factItems.forEach(factItem => {
                factItem.style.cursor = 'pointer';
                factItem.style.transition = 'all 0.3s ease';
                
                factItem.addEventListener('click', () => {
                    this.openCyprusFactsPage();
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

    openCyprusFactsPage() {
        // Show notification
        this.showNotification('פותח דף עובדות על קפריסין מלא בתמונות ומידע מרתק!');
        
        // Play click sound
        this.playClickSound();
        
        // Open the Cyprus facts page in a new tab
        window.open('cyprus-facts.html', '_blank');
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
console.log('💙 לוח הספירה של מיקה לחופשה בקפריסין נטען בהצלחה! 💙');
console.log('🏖️ מיקה, החופשה שלך הולכת להיות מדהימה! 🏖️');
console.log('🌊 המים הכחולים של קפריסין מחכים לך! 🌊');
