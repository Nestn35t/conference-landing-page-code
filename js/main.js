/* ==========================================================================
   AIBP Summit 2025 — Main JavaScript
   Handles: Navigation, Countdown, Agenda Tabs, FAQ Accordion,
            Google Sheets data loading
   ========================================================================== */

(function () {
    'use strict';

    // ---- Configuration ----
    // Replace with your published Google Sheet Web App URL
    const SHEET_API_URL = '';  // Will be set when Google Apps Script is deployed

    // ---- Mobile Navigation ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
            });
        });
    }

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(58, 42, 26, 0.98)';
        } else {
            navbar.style.background = 'rgba(58, 42, 26, 0.95)';
        }
    });

    // ---- Countdown Timer ----
    function startCountdown(targetDateStr) {
        var targetDate = new Date(targetDateStr).getTime();

        function update() {
            var now = Date.now();
            var diff = targetDate - now;

            if (diff <= 0) {
                document.getElementById('countDays').textContent = '0';
                document.getElementById('countHours').textContent = '0';
                document.getElementById('countMins').textContent = '0';
                document.getElementById('countSecs').textContent = '0';
                return;
            }

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var secs = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('countDays').textContent = days;
            document.getElementById('countHours').textContent = hours;
            document.getElementById('countMins').textContent = mins;
            document.getElementById('countSecs').textContent = secs;
        }

        update();
        setInterval(update, 1000);
    }

    // Default countdown — will be overridden by sheet data
    startCountdown('2026-07-08T09:00:00+08:00');

    // ---- Agenda Day Tabs ----
    var agendaTabs = document.querySelectorAll('.agenda-tab');
    agendaTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            agendaTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            var day = tab.getAttribute('data-day');
            document.getElementById('agendaDay1').classList.toggle('hidden', day !== '1');
            document.getElementById('agendaDay2').classList.toggle('hidden', day !== '2');
        });
    });

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.parentElement;
            var isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(function (faq) {
                faq.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Load Data from Google Sheets ----
    function loadSheetData() {
        if (!SHEET_API_URL) {
            console.log('No Google Sheets API URL configured. Using default content.');
            return;
        }

        fetch(SHEET_API_URL)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.settings) applySettings(data.settings);
                if (data.speakers) renderSpeakers(data.speakers);
                if (data.agenda) renderAgenda(data.agenda);
                if (data.sponsors) renderSponsors(data.sponsors);
                if (data.testimonials) renderTestimonials(data.testimonials);
                if (data.faq) renderFAQ(data.faq);
                if (data.gallery) renderGallery(data.gallery);
            })
            .catch(function (err) {
                console.error('Failed to load sheet data:', err);
            });
    }

    // ---- Apply General Settings ----
    function applySettings(s) {
        if (s.eventName) document.getElementById('heroTitle').textContent = s.eventName;
        if (s.edition) document.getElementById('heroEdition').textContent = s.edition;
        if (s.headline) document.getElementById('heroHeadline').textContent = s.headline;
        if (s.date) document.getElementById('heroDate').textContent = s.date;
        if (s.city) document.getElementById('heroCity').textContent = s.city;
        if (s.venue) {
            document.getElementById('heroVenue').textContent = s.venue;
            document.getElementById('venueName').textContent = s.venue;
        }
        if (s.venueAddress) document.getElementById('venueAddress').textContent = s.venueAddress;
        if (s.eventDateTime) startCountdown(s.eventDateTime);
        if (s.aboutDescription) document.getElementById('aboutDescription').textContent = s.aboutDescription;
        if (s.aboutAudience) document.getElementById('aboutAudience').textContent = s.aboutAudience;
        if (s.statAttendees) document.getElementById('statAttendees').textContent = s.statAttendees;
        if (s.statCountries) document.getElementById('statCountries').textContent = s.statCountries;
        if (s.statEditions) document.getElementById('statEditions').textContent = s.statEditions;
        if (s.statSpeakers) document.getElementById('statSpeakers').textContent = s.statSpeakers;
        if (s.agendaPdfUrl) document.getElementById('agendaPdfLink').href = s.agendaPdfUrl;
        if (s.agendaDay1Date) document.getElementById('agendaDay1Date').textContent = s.agendaDay1Date;
        if (s.agendaDay2Date) document.getElementById('agendaDay2Date').textContent = s.agendaDay2Date;
        if (s.priceEarlyBird) document.getElementById('priceEarlyBird').textContent = s.priceEarlyBird;
        if (s.priceStandard) document.getElementById('priceStandard').textContent = s.priceStandard;
        if (s.priceOnsite) document.getElementById('priceOnsite').textContent = s.priceOnsite;
        if (s.visaInfo) document.getElementById('visaInfo').innerHTML = s.visaInfo;
        if (s.contactGeneral) document.getElementById('contactGeneral').textContent = s.contactGeneral;
        if (s.contactSponsor) document.getElementById('contactSponsor').textContent = s.contactSponsor;
        if (s.contactRegister) document.getElementById('contactRegister').textContent = s.contactRegister;
        if (s.contactVisa) document.getElementById('contactVisa').textContent = s.contactVisa;
        if (s.socialLinkedin) document.getElementById('socialLinkedin').href = s.socialLinkedin;
        if (s.socialTwitter) document.getElementById('socialTwitter').href = s.socialTwitter;
        if (s.socialFacebook) document.getElementById('socialFacebook').href = s.socialFacebook;
        if (s.zohoFormUrl) {
            var wrapper = document.getElementById('zohoFormWrapper');
            wrapper.innerHTML = '<iframe frameborder="0" style="height:600px;width:100%;border:none" src="' + s.zohoFormUrl + '"></iframe>';
        }
        if (s.heroBackgroundImage) {
            var heroBg = document.querySelector('.hero-bg-placeholder');
            heroBg.innerHTML = '';
            heroBg.style.backgroundImage = 'url(' + s.heroBackgroundImage + ')';
            heroBg.style.backgroundSize = 'cover';
            heroBg.style.backgroundPosition = 'center';
        }
        if (s.mapEmbed) {
            var mapEl = document.getElementById('venueMap');
            mapEl.outerHTML = s.mapEmbed;
        }
    }

    // ---- Render Speakers ----
    function renderSpeakers(speakers) {
        var grid = document.getElementById('speakersGrid');
        grid.innerHTML = '';
        speakers.forEach(function (sp) {
            var card = document.createElement('div');
            card.className = 'speaker-card';
            var photoHtml = sp.photo
                ? '<img class="speaker-photo" src="' + sp.photo + '" alt="' + sp.name + '">'
                : '<div class="speaker-photo-placeholder"></div>';
            var typeClass = (sp.type || 'panel').toLowerCase();
            card.innerHTML =
                photoHtml +
                '<h4 class="speaker-name">' + sp.name + '</h4>' +
                '<p class="speaker-title">' + sp.title + ', ' + sp.company + '</p>' +
                '<span class="speaker-type ' + typeClass + '">' + sp.type + '</span>' +
                (sp.linkedin ? '<a href="' + sp.linkedin + '" class="speaker-linkedin" target="_blank" rel="noopener">LinkedIn</a>' : '');
            grid.appendChild(card);
        });
    }

    // ---- Render Agenda ----
    function renderAgenda(agendaItems) {
        var day1Container = document.getElementById('agendaDay1');
        var day2Container = document.getElementById('agendaDay2');
        day1Container.innerHTML = '';
        day2Container.innerHTML = '';

        agendaItems.forEach(function (item) {
            var formatClass = (item.format || 'networking').toLowerCase();
            var html =
                '<div class="agenda-item">' +
                '  <div class="agenda-time">' + item.time + '</div>' +
                '  <div class="agenda-details">' +
                '    <span class="agenda-format ' + formatClass + '">' + item.format + '</span>' +
                '    <h4>' + item.title + '</h4>' +
                (item.speaker ? '<p>' + item.speaker + '</p>' : '') +
                '  </div>' +
                '</div>';

            if (String(item.day) === '2') {
                day2Container.innerHTML += html;
            } else {
                day1Container.innerHTML += html;
            }
        });
    }

    // ---- Render Sponsors ----
    function renderSponsors(sponsors) {
        var platinum = document.getElementById('platinumSponsors');
        var gold = document.getElementById('goldSponsors');
        var silver = document.getElementById('silverSponsors');
        platinum.innerHTML = '';
        gold.innerHTML = '';
        silver.innerHTML = '';

        sponsors.forEach(function (sp) {
            var img = '<img src="' + sp.logo + '" alt="' + sp.name + '" title="' + sp.name + '">';
            var tier = (sp.tier || 'silver').toLowerCase();
            if (tier === 'platinum') platinum.innerHTML += img;
            else if (tier === 'gold') gold.innerHTML += img;
            else silver.innerHTML += img;
        });
    }

    // ---- Render Testimonials ----
    function renderTestimonials(testimonials) {
        var grid = document.getElementById('testimonialsGrid');
        grid.innerHTML = '';
        testimonials.forEach(function (t) {
            var photoHtml = t.photo
                ? '<img src="' + t.photo + '" alt="' + t.name + '" style="width:44px;height:44px;border-radius:50%;object-fit:cover">'
                : '<div class="testimonial-photo-placeholder"></div>';
            var card =
                '<div class="testimonial-card">' +
                '  <p class="testimonial-quote">"' + t.quote + '"</p>' +
                '  <div class="testimonial-author">' +
                '    ' + photoHtml +
                '    <div><strong>' + t.name + '</strong><span>' + t.title + ', ' + t.company + '</span></div>' +
                '  </div>' +
                '</div>';
            grid.innerHTML += card;
        });
    }

    // ---- Render FAQ ----
    function renderFAQ(faqItems) {
        var list = document.getElementById('faqList');
        list.innerHTML = '';
        faqItems.forEach(function (f) {
            var item = document.createElement('div');
            item.className = 'faq-item';
            item.innerHTML =
                '<button class="faq-question">' + f.question + '</button>' +
                '<div class="faq-answer"><p>' + f.answer + '</p></div>';
            item.querySelector('.faq-question').addEventListener('click', function () {
                var isOpen = item.classList.contains('open');
                list.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
                if (!isOpen) item.classList.add('open');
            });
            list.appendChild(item);
        });
    }

    // ---- Render Gallery ----
    function renderGallery(galleryItems) {
        var grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        galleryItems.forEach(function (g) {
            grid.innerHTML += '<img src="' + g.image + '" alt="' + (g.caption || 'Event photo') + '">';
        });
    }

    // ---- Initialize ----
    loadSheetData();

})();
