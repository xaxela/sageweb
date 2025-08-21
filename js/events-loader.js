// Events Loader Module
const eventsLoader = (() => {
    'use strict';

    const config = {
        eventsEndpoint: 'UPDATES/updates.json',
        maxEvents: 6,
        cacheExpiry: 3600000 // 1 hour
    };

    const state = {
        events: [],
        lastFetch: null,
        isLoading: false
    };

    // Cache management
    const cache = {
        set: (key, data) => {
            const item = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(item));
        },

        get: (key) => {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            if (Date.now() - parsed.timestamp > config.cacheExpiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return parsed.data;
        }
    };

    // Fetch events data
    const fetchEvents = async () => {
        if (state.isLoading) return;
        
        state.isLoading = true;
        
        try {
            const cachedEvents = cache.get('sage-events');
            if (cachedEvents) {
                state.events = cachedEvents;
                renderEvents();
                state.isLoading = false;
                return;
            }

            const response = await fetch(config.eventsEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            state.events = data.events || [];
            
            cache.set('sage-events', state.events);
            renderEvents();
            
        } catch (error) {
            console.error('Error loading events:', error);
            showError();
        } finally {
            state.isLoading = false;
        }
    };

    // Render events
    const renderEvents = () => {
        const container = document.getElementById('events-container');
        if (!container) return;

        const eventsToShow = state.events.slice(0, config.maxEvents);
        
        if (eventsToShow.length === 0) {
            container.innerHTML = '<p class="no-events">No upcoming events at this time.</p>';
            return;
        }

        container.innerHTML = eventsToShow.map(event => createEventCard(event)).join('');
        
        // Add click handlers for event cards
        container.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => handleEventClick(card.dataset.eventId));
        });
    };

    // Create event card HTML
    const createEventCard = (event) => {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <article class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image || 'IMAGES/POSTERS/poster-placeholder.jpg'}" 
                         alt="${event.title}" 
                         loading="lazy">
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <time datetime="${event.date}" class="event-date">
                            <i class="fas fa-calendar" aria-hidden="true"></i>
                            ${formattedDate}
                        </time>
                        <time class="event-time">
                            <i class="fas fa-clock" aria-hidden="true"></i>
                            ${formattedTime}
                        </time>
                        <span class="event-location">
                            <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                            ${event.location}
                        </span>
                    </div>
                    <button class="event-cta" aria-label="Learn more about ${event.title}">
                        Learn More
                    </button>
                </div>
            </article>
        `;
    };

    // Handle event click
    const handleEventClick = (eventId) => {
        const event = state.events.find(e => e.id === eventId);
        if (event) {
            // Open event modal or navigate to event details
            showEventModal(event);
        }
    };

    // Show event modal
    const showEventModal = (event) => {
        const modal = createModal(event);
        document.body.appendChild(modal);
        modal.showModal();
    };

    // Create event modal
    const createModal = (event) => {
        const modal = document.createElement('dialog');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <h2>${event.title}</h2>
                <img src="${event.image || 'IMAGES/POSTERS/poster-placeholder.jpg'}" 
                     alt="${event.title}" 
                     class="modal-image">
                <p class="modal-description">${event.description}</p>
                <div class="modal-details">
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    ${event.registrationLink ? `
                        <a href="${event.registrationLink}" 
                           class="registration-link" 
                           target="_blank" 
                           rel="noopener">
                            Register for Event
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.close();
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
                modal.remove();
            }
        });
        
        return modal;
    };

    // Show error state
    const showError = () => {
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <p>Unable to load events. Please try again later.</p>
                    <button onclick="eventsLoader.refresh()" class="retry-btn">
                        Try Again
                    </button>
                </div>
            `;
        }
    };

    // Refresh events
    const refresh = () => {
        localStorage.removeItem('sage-events');
        fetchEvents();
    };

    // Initialize
    const init = () => {
        fetchEvents();
    };

    // Public API
    return {
        init,
        refresh,
        state
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', eventsLoader.init);
} else {
    eventsLoader.init();
}
