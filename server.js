const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

// Configuration SendGrid
sgMail.setApiKey('VOTRE_CLE_SENDGRID');

// Configuration MongoDB
const MONGODB_URI = 'votre_uri_mongodb';
let db;

MongoClient.connect(MONGODB_URI)
    .then(client => {
        console.log('Connecté à MongoDB');
        db = client.db('taxi-reservations');
    })
    .catch(error => console.error('Erreur MongoDB:', error));

// Modèle de réservation
const reservationSchema = new mongoose.Schema({
    name: String,
    phone: String,
    pickup: String,
    destination: String,
    datetime: Date,
    passengers: Number,
    createdAt: { type: Date, default: Date.now }
});

app.post('/api/reservation', async (req, res) => {
    try {
        const { name, phone, pickup, destination, datetime, passengers } = req.body;

        // Enregistrement dans MongoDB
        await db.collection('reservations').insertOne({
            name,
            phone,
            pickup,
            destination,
            datetime: new Date(datetime),
            passengers: parseInt(passengers),
            createdAt: new Date()
        });

        // Email au client
        const msgClient = {
            to: 'email_du_client@example.com', // À remplacer par l'email du client
            from: 'votre_email_verifie@votredomaine.com', // Doit être vérifié sur SendGrid
            subject: 'Confirmation de votre réservation de taxi',
            html: `
                <h2>Confirmation de réservation</h2>
                <p>Bonjour ${name},</p>
                <p>Votre réservation a été confirmée avec les détails suivants :</p>
                <ul>
                    <li>De : ${pickup}</li>
                    <li>Vers : ${destination}</li>
                    <li>Date/Heure : ${datetime}</li>
                    <li>Nombre de passagers : ${passengers}</li>
                </ul>
            `
        };

        // Email au chauffeur/entreprise
        const msgChauffeur = {
            to: 'email_entreprise@votredomaine.com',
            from: 'votre_email_verifie@votredomaine.com',
            subject: 'Nouvelle réservation de taxi',
            html: `
                <h2>Nouvelle réservation</h2>
                <p>Détails de la réservation :</p>
                <ul>
                    <li>Client : ${name}</li>
                    <li>Téléphone : ${phone}</li>
                    <li>De : ${pickup}</li>
                    <li>Vers : ${destination}</li>
                    <li>Date/Heure : ${datetime}</li>
                    <li>Passagers : ${passengers}</li>
                </ul>
            `
        };

        await sgMail.send(msgClient);
        await sgMail.send(msgChauffeur);

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors du traitement de la réservation' });
    }
});

// Route pour obtenir toutes les réservations (protégée par mot de passe)
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await db.collection('reservations')
            .find()
            .sort({ datetime: -1 })
            .toArray();
        res.json(reservations);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
