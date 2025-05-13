// Gestion du sélecteur de couleurs
const colorPickerToggle = document.querySelector('.color-picker-toggle');
const colorOptions = document.querySelector('.color-options');
const colorButtons = document.querySelectorAll('.color-option');

// Ouvrir/fermer le sélecteur de couleurs
colorPickerToggle.addEventListener('click', () => {
    colorOptions.classList.toggle('active');
});

// Fermer le sélecteur si on clique ailleurs
document.addEventListener('click', (e) => {
    if (!e.target.closest('.color-picker')) {
        colorOptions.classList.remove('active');
    }
});

// Changer la couleur du site et les icônes si nécessaire
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        document.documentElement.style.setProperty('--primary-color', color);
        colorOptions.classList.remove('active');

        // Sélectionner toutes les icônes à changer
        const standardIcons = document.querySelectorAll('[alt="Courses Classiques"], [alt="Courses Standard"]');
        const groupeIcons = document.querySelectorAll('[alt="Transport de Groupe"], [alt="Courses de groupe"]');
        const journeeIcons = document.querySelectorAll('[alt="Mise à Disposition"], [alt="Journée complète"]');
        const wheelchairIcons = document.querySelectorAll('.fa-wheelchair');

        if (color === '#27ae60') {
            // Changer les icônes pour la version verte
            standardIcons.forEach(icon => icon.src = 'images/SpBHJr.tifbnagba.png');
            groupeIcons.forEach(icon => icon.src = 'images/Fichier 5bnagba.png');
            journeeIcons.forEach(icon => icon.src = 'images/Fichier 4bnagba.png');
        } else if (color === '#f1c40f') {
            // Changer les icônes pour la version jaune
            standardIcons.forEach(icon => icon.src = 'images/SpBHJr.tif (5)bnagba.png');
            groupeIcons.forEach(icon => icon.src = 'images/Fichier 17bnagba.png');
            journeeIcons.forEach(icon => icon.src = 'images/Fichier 16bnagba.png');
        } else if (color === '#c0392b') {
            // Changer les icônes pour la version rouge
            standardIcons.forEach(icon => icon.src = 'images/SpBHJr.tif (2)bnagba.png');
            groupeIcons.forEach(icon => icon.src = 'images/Fichier 8bnagba.png');
            journeeIcons.forEach(icon => icon.src = 'images/Fichier 7bnagba.png');
        } else if (color === '#8e44ad') {
            // Changer les icônes pour la version violette
            standardIcons.forEach(icon => icon.src = 'images/SpBHJr.tif (4)bnagba.png');
            groupeIcons.forEach(icon => icon.src = 'images/Fichier 14bnagba.png');
            journeeIcons.forEach(icon => icon.src = 'images/Fichier 13bnagba.png');
        } else if (color === '#2c3e50') {
            // Changer les icônes pour la version bleu foncé
            standardIcons.forEach(icon => icon.src = 'images/SpBHJr.tif (3)bnagba.png');
            groupeIcons.forEach(icon => icon.src = 'images/Fichier 11bnagba.png');
            journeeIcons.forEach(icon => icon.src = 'images/Fichier 10bnagba.png');
        } else {
            // Remettre les icônes d'origine (pour le bleu clair)
            standardIcons.forEach(icon => icon.src = 'images/Fichier 1bnagba.png');
            groupeIcons.forEach(icon => icon.src = 'images/Fichier 3bnagba.png');
            journeeIcons.forEach(icon => icon.src = 'images/Fichier 2bnagba.png');
        }

        // Changer la couleur du fauteuil roulant selon la couleur sélectionnée
        wheelchairIcons.forEach(icon => icon.style.color = color);
    });
});

// Gestion du menu mobile
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fermer le menu mobile quand on clique sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Gestion des liens de navigation
const navLinksItems = document.querySelectorAll('.nav-links a');

// Scroll doux vers les sections et gestion des paramètres
navLinksItems.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Si le lien pointe vers une autre page (ne commence pas par #)
        if (!href.startsWith('#')) {
            return; // Laisser le comportement par défaut du navigateur
        }
        
        e.preventDefault(); // Empêcher la navigation par défaut uniquement pour les ancres
        const [targetId, params] = href.split('?');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Si c'est la section réservation avec un paramètre de service
            if (targetId === '#reservation' && params) {
                const serviceType = new URLSearchParams('?' + params).get('service');
                if (serviceType === 'medical') {
                    // Sélectionner la carte de service médical
                    setTimeout(() => {
                        const medicalCard = document.querySelector('.service-choice-card[data-service="medical"]');
                        if (medicalCard) {
                            medicalCard.click();
                        }
                    }, 500); // Petit délai pour assurer que le scroll est terminé
                }
            }
        }
    });
});

// Animation douce du scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialisation de Google Maps
let autocompletePickup;
let autocompleteDestination;

function initGoogleMaps() {
    // Restreindre les résultats à la France
    const options = {
        componentRestrictions: { country: 'fr' },
        types: ['address']
    };

    // Initialiser l'autocomplétion pour les champs d'adresse
    autocompletePickup = new google.maps.places.Autocomplete(
        document.getElementById('pickup'),
        options
    );

    autocompleteDestination = new google.maps.places.Autocomplete(
        document.getElementById('destination'),
        options
    );

    // Écouter les changements d'adresse
    autocompletePickup.addListener('place_changed', calculateDistance);
    autocompleteDestination.addListener('place_changed', calculateDistance);

    // Initialiser la carte des zones desservies
    const lyonCenter = { lat: 45.764043, lng: 4.835659 }; // Centre de Lyon
    const zonesMap = new google.maps.Map(document.getElementById('zonesMap'), {
        center: lyonCenter,
        zoom: 11,
        styles: [
            {
                featureType: 'all',
                elementType: 'all',
                stylers: [{ saturation: -20 }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false
    });

    // Ajouter un marqueur pour l'aéroport
    const airportLocation = { lat: 45.7234, lng: 5.0887 }; // Saint-Exupéry
    new google.maps.Marker({
        position: airportLocation,
        map: zonesMap,
        icon: {
            path: 'M482.192,124.418c-3.84-2.065-8.577-0.692-10.642,3.15l-54.973,102.3l-107.471-39.229l-11.162-56.091 c-0.843-4.234-4.965-6.982-9.198-6.139c-4.234,0.843-6.982,4.964-6.139,9.198l9.139,45.925L190.377,136.89L176.842,69.2 c-0.844-4.234-4.966-6.981-9.198-6.139c-4.234,0.843-6.982,4.964-6.139,9.198l11.162,56.091L65.196,167.579l-54.973-102.3 c-2.065-3.842-6.802-5.216-10.642-3.15c-3.842,2.065-5.215,6.801-3.15,10.642l61.768,114.967c1.397,2.6,4.088,4.173,6.961,4.173 c0.388,0,0.78-0.029,1.173-0.087l115.188-17.041l12.958,65.116c1.397,7.016,7.584,12.111,14.728,12.111 c0.388,0,0.78-0.029,1.173-0.087c8.135-1.618,13.426-9.766,11.808-17.901l-10.935-54.95l107.471,39.229l12.958,65.116 c1.397,7.016,7.584,12.111,14.728,12.111c0.388,0,0.78-0.029,1.173-0.087c8.135-1.618,13.426-9.766,11.808-17.901l-10.935-54.95 l115.188-17.041c4.234-0.843,6.982-4.964,6.139-9.198c-0.031-0.157-0.075-0.309-0.115-0.462l-61.768-114.967 C487.407,120.576,486.034,126.483,482.192,124.418z',
            fillColor: '#2176AE',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 0.05,
            anchor: new google.maps.Point(250, 250)
        },
        title: 'Aéroport Saint-Exupéry'
    });
}

// Initialisation de l'API Google Maps
function initMapsAPI() {
    // Initialiser l'autocomplétion pour les champs d'adresse
    const pickup = document.getElementById('pickup');
    const destination = document.getElementById('destination');

    const autocompletePickup = new google.maps.places.Autocomplete(pickup);
    const autocompleteDestination = new google.maps.places.Autocomplete(destination);

    autocompletePickup.addListener('place_changed', function() {
        calculateDistanceAndPrice();
    });

    autocompleteDestination.addListener('place_changed', function() {
        calculateDistanceAndPrice();
    });

    // Initialiser la carte des zones desservies
    const lyonCenter = { lat: 45.764043, lng: 4.835659 }; // Centre de Lyon
    const zonesMap = new google.maps.Map(document.getElementById('zonesMap'), {
        center: lyonCenter,
        zoom: 11,
        styles: [
            {
                featureType: 'all',
                elementType: 'all',
                stylers: [{ saturation: -20 }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false
    });

    // Ajouter un marqueur pour l'aéroport
    const airportLocation = { lat: 45.7234, lng: 5.0887 }; // Saint-Exupéry
    new google.maps.Marker({
        position: airportLocation,
        map: zonesMap,
        icon: {
            path: 'M482.192,124.418c-3.84-2.065-8.577-0.692-10.642,3.15l-54.973,102.3l-107.471-39.229l-11.162-56.091 c-0.843-4.234-4.965-6.982-9.198-6.139c-4.234,0.843-6.982,4.964-6.139,9.198l9.139,45.925L190.377,136.89L176.842,69.2 c-0.844-4.234-4.966-6.981-9.198-6.139c-4.234,0.843-6.982,4.964-6.139,9.198l11.162,56.091L65.196,167.579l-54.973-102.3 c-2.065-3.842-6.802-5.216-10.642-3.15c-3.842,2.065-5.215,6.801-3.15,10.642l61.768,114.967c1.397,2.6,4.088,4.173,6.961,4.173 c0.388,0,0.78-0.029,1.173-0.087l115.188-17.041l12.958,65.116c1.397,7.016,7.584,12.111,14.728,12.111 c0.388,0,0.78-0.029,1.173-0.087c8.135-1.618,13.426-9.766,11.808-17.901l-10.935-54.95l107.471,39.229l12.958,65.116 c1.397,7.016,7.584,12.111,14.728,12.111c0.388,0,0.78-0.029,1.173-0.087c8.135-1.618,13.426-9.766,11.808-17.901l-10.935-54.95 l115.188-17.041c4.234-0.843,6.982-4.964,6.139-9.198c-0.031-0.157-0.075-0.309-0.115-0.462l-61.768-114.967 C487.407,120.576,486.034,126.483,482.192,124.418z',
            fillColor: '#2176AE',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 0.05,
            anchor: new google.maps.Point(250, 250)
        },
        title: 'Aéroport Saint-Exupéry'
    });
}

// Variable pour stocker la dernière distance calculée
let lastCalculatedDistance = null;

// Calcul de la distance et du prix
function calculateDistance() {
    const pickup = document.getElementById('pickup').value;
    const destination = document.getElementById('destination').value;

    if (!pickup || !destination) return;

    const service = new google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix({
        origins: [pickup],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    }, (response, status) => {
        if (status === 'OK') {
            lastCalculatedDistance = response.rows[0].elements[0].distance.value / 1000; // Convertir en km
            updateDistanceAndPrice(lastCalculatedDistance);
        }
    });
}

// Vérifier si une heure donnée est en période de nuit (entre 19h et 7h)
function isNightTimeHour(hour) {
    return hour >= 19 || hour < 7;
}

// Vérifier si une date est un dimanche
function isSunday(date) {
    return date.getDay() === 0;
}

// Calcul du prix de la course
function calculateTaxiFare(distance, serviceType) {
    if (!distance) return null;

    // Récupérer l'heure et la date saisies dans le formulaire
    const timeInput = document.getElementById('time');
    const dateInput = document.getElementById('date');
    let isNightTime = false;
    let isSundayService = false;

    if (timeInput && timeInput.value && dateInput && dateInput.value) {
        const [hours] = timeInput.value.split(':').map(Number);
        isNightTime = isNightTimeHour(hours);
        
        // Vérifier si c'est un dimanche
        const selectedDate = new Date(dateInput.value);
        isSundayService = isSunday(selectedDate);
    }

    // Prix de base pour tous les services (hors médical et journée)
    const baseFare = 5; // 5€ de prise en charge

    // Déterminer si on applique le tarif de nuit/dimanche
    const isSpecialRate = isNightTime || isSundayService;
    
    // Prix selon le type de service
    let finalPrice = 0;
    switch(serviceType) {
        case 'medical':
            // Pour le transport médical, on retourne null pour afficher un message spécial
            return null;

        case 'journee':
            // Pour la journée complète, on retourne null pour afficher "Sur devis"
            return null;

        case 'standard':
        case 'groupe':
        default:
            // Application du tarif standard
            const kmFare = isSpecialRate ? 3 : 2; // 3€/km la nuit et dimanche, 2€/km en journée
            finalPrice = Math.ceil(baseFare + (distance * kmFare));
            break;
    }

    return finalPrice;
}

// Fonction pour mettre à jour l'affichage du simulateur de prix
function updatePriceSimulator() {
    const distancePrice = document.getElementById('distancePrice');
    const selectedService = document.getElementById('serviceType').value;

    if (selectedService === 'classique' || selectedService === 'groupe') {
        distancePrice.classList.remove('hidden');
        distancePrice.classList.add('visible');
        calculateDistanceAndPrice();
    } else {
        distancePrice.classList.remove('visible');
        distancePrice.classList.add('hidden');
    }
}

// Mise à jour de l'affichage
function updateDistanceAndPrice(distance) {
    const distanceInfo = document.getElementById('distancePrice');
    const distanceValue = document.getElementById('distanceValue');
    const priceValue = document.getElementById('priceValue');
    
    // Récupérer le service sélectionné
    const selectedService = document.querySelector('.service-choice-card.selected');
    const serviceType = selectedService ? selectedService.getAttribute('data-service') : 'standard';

    // Récupérer l'heure saisie dans le formulaire
    const timeInput = document.getElementById('time');
    let isNightTime = false;
    let timeMessage = '';

    const dateInput = document.getElementById('date');
    if (timeInput && timeInput.value && dateInput && dateInput.value) {
        const [hours] = timeInput.value.split(':').map(Number);
        isNightTime = isNightTimeHour(hours);
        const selectedDate = new Date(dateInput.value);
        const isSundayService = isSunday(selectedDate);
        
        let messages = [];
        if (isNightTime) {
            messages.push('Tarif de nuit 19h-7h');
        } else {
            messages.push('Tarif de jour 7h-19h');
        }
        if (isSundayService) {
            messages.push('Tarif dimanche appliqué');
        }
        timeMessage = ` (${messages.join(', ')})`;
    }

    // Afficher la distance et le prix
    if (distance) {
        distanceValue.textContent = `${distance.toFixed(1)} km`;
        const price = calculateTaxiFare(distance, serviceType);

        if (price === null) {
            if (serviceType === 'medical') {
                priceValue.textContent = 'Contactez-nous pour les tarifs conventionnés';
            } else {
                priceValue.textContent = 'Sur devis';
            }
        } else {
            priceValue.textContent = `${price}€${timeMessage}`;
        }

        distanceInfo.style.display = 'block';
    } else {
        distanceInfo.style.display = 'none';
    }
}

// Fonction pour sélectionner automatiquement le service conventionné
function selectMedicalService() {
    const medicalRadio = document.getElementById('service-medical');
    if (medicalRadio) {
        medicalRadio.checked = true;
        medicalRadio.dispatchEvent(new Event('change'));
    }
}

// La fonction initGoogleMaps sera appelée automatiquement par l'API Google Maps
window.initGoogleMaps = initGoogleMaps;
window.selectMedicalService = selectMedicalService;

// Fonction pour calculer la distance et mettre à jour le prix
function calculateDistanceAndPrice() {
    if (lastCalculatedDistance !== null) {
        updateDistanceAndPrice(lastCalculatedDistance);
    } else {
        calculateDistance();
    }
}

// Mettre à jour le prix quand l'heure ou la date change
document.getElementById('time').addEventListener('change', function() {
    calculateDistanceAndPrice();
});

document.getElementById('date').addEventListener('change', function() {
    calculateDistanceAndPrice();
});

// Gestion de la sélection des services
document.querySelectorAll('.service-choice-card').forEach(card => {
    card.addEventListener('click', function() {
        // Trouver et sélectionner le bouton radio dans cette carte
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
            
            // Retirer la sélection précédente
            document.querySelectorAll('.service-choice-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Ajouter la sélection au service choisi
            this.classList.add('selected');
            
            // Gérer l'affichage des champs
            const conventionnelFields = document.getElementById('conventionnelFields');
            const journeeMessage = document.getElementById('journeeMessage');
            const distancePrice = document.getElementById('distancePrice');
            const passengersGroup = document.getElementById('passengersGroup');
            const passengers = document.getElementById('passengers');

            if (radio.value === 'medical') {
                conventionnelFields.style.display = 'block';
                journeeMessage.style.display = 'none';
                distancePrice.style.display = 'block';
                passengersGroup.style.display = 'none';
            } else if (radio.value === 'journee') {
                conventionnelFields.style.display = 'none';
                journeeMessage.style.display = 'block';
                distancePrice.style.display = 'none';
                passengersGroup.style.display = 'block';
                passengers.max = '8';
            } else if (radio.value === 'groupe') {
                conventionnelFields.style.display = 'none';
                journeeMessage.style.display = 'none';
                distancePrice.style.display = 'block';
                passengersGroup.style.display = 'block';
                passengers.max = '8';
            } else {
                conventionnelFields.style.display = 'none';
                journeeMessage.style.display = 'none';
                distancePrice.style.display = 'block';
                passengersGroup.style.display = 'block';
                passengers.max = '4';
            }
            
            // Recalculer la distance et le prix si possible
            calculateDistance();
        }
    });
});

// Vérification de la sélection du service avant soumission
document.getElementById('reservationForm').addEventListener('invalid', function(e) {
    if (e.target.id === 'serviceType' && !e.target.value) {
        alert('Veuillez sélectionner un type de service');
    }
}, true);

// Gestion du formulaire de réservation
document.getElementById('reservationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Afficher un indicateur de chargement
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;

    try {
        // Récupération des données du formulaire
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            pickup: document.getElementById('pickup').value,
            destination: document.getElementById('destination').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            passengers: document.getElementById('passengers').value,
            service: document.querySelector('input[name="service"]:checked')?.value || 'standard'
        };

        // Vérifier que tous les champs requis sont remplis
        if (!formData.name || !formData.email || !formData.phone || !formData.pickup || !formData.destination || !formData.date || !formData.time) {
            throw new Error('Veuillez remplir tous les champs obligatoires');
        }

        // Envoyer l'email via EmailJS
        const response = await emailjs.send(
            'service_yi8qv11',
            'template_xq9lzxl',
            {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                service: formData.service,
                pickup: formData.pickup,
                destination: formData.destination,
                date: formData.date,
                time: formData.time,
                passengers: formData.passengers,
                message: `Service: ${formData.service}\nPassagers: ${formData.passengers}\nDate: ${formData.date}\nHeure: ${formData.time}`
            }
        );

        console.log('Email envoyé avec succès:', response);

        // Afficher un message de succès
        const successDialog = document.createElement('div');
        successDialog.classList.add('success-dialog');
        successDialog.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Réservation envoyée !</h3>
                <p>Nous vous contacterons dans les plus brefs délais.</p>
                <button onclick="this.parentElement.parentElement.remove()">Fermer</button>
            </div>
        `;
        document.body.appendChild(successDialog);

        // Réinitialiser le formulaire
        this.reset();
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        alert(error.message || 'Une erreur est survenue lors de l\'envoi de la réservation. Veuillez réessayer.');
    } finally {
        // Réactiver le bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Ajouter des styles pour la boîte de dialogue de succès
const style = document.createElement('style');
style.textContent = `
    .success-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .success-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
    }

    .success-content i {
        font-size: 3rem;
        color: #4CAF50;
        margin-bottom: 1rem;
    }

    .success-content button {
        background: var(--primary-color);
        color: var(--secondary-color);
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        font-weight: bold;
        margin-top: 1rem;
        cursor: pointer;
    }

    .success-content button:hover {
        opacity: 0.9;
    }
`;
