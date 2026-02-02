<template>
    <footer class="formulation-footer" role="contentinfo" aria-label="Pied de page">
        <!-- Ligne principale -->
        <div class="footer-main">
            <div class="footer-content">
                <!-- Informations de conformité -->
                <div class="compliance-info">
                    <div class="compliance-icon" aria-hidden="true">⚖️</div>
                    <div class="compliance-text">
                        <h3 class="compliance-title">Conformité réglementaire</h3>
                        <p class="compliance-description">
                            Cet outil est basé sur le Règlement UE 1223/2009 et les bonnes pratiques de formulation cosmétique.
                        </p>
                    </div>
                </div>

                <!-- Liens rapides -->
                <nav class="footer-nav" aria-label="Navigation du pied de page">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a
                                href="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02009R1223-20240401"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="nav-link"
                            >
                                Règlement UE 1223/2009
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                                href="/aide"
                                class="nav-link"
                            >
                                Guide d'utilisation
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                                href="/contact"
                                class="nav-link"
                            >
                                Contact
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                                href="/mentions-legales"
                                class="nav-link"
                            >
                                Mentions légales
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Séparateur -->
        <div class="footer-divider"></div>

        <!-- Section des avertissements -->
        <div class="disclaimer-section">
            <div class="disclaimer-header">
                <span class="disclaimer-icon" aria-hidden="true">⚠️</span>
                <h4 class="disclaimer-title">Avertissement important</h4>
            </div>
            <p class="disclaimer-text">
                Cet outil fournit des recommandations techniques basées sur le Règlement UE 1223/2009.
                Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable
                de la Conformité (PRC). Toute commercialisation nécessite une évaluation de sécurité
                complète par un expert qualifié.
            </p>
        </div>

        <!-- Informations techniques -->
        <div class="technical-info">
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Version :</span>
                    <span class="info-value">2.2.0</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Dernière mise à jour :</span>
                    <span class="info-value">{{ currentDate }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Navigateur recommandé :</span>
                    <span class="info-value">Chrome, Firefox, Safari récents</span>
                </div>
            </div>
        </div>

        <!-- Copyright et liens secondaires -->
        <div class="footer-bottom">
            <div class="copyright">
                © {{ currentYear }} Formulateur Cosmétique Pro. Tous droits réservés.
            </div>

            <div class="footer-links">
                <button
                    @click="toggleCookieSettings"
                    class="footer-btn"
                    type="button"
                    aria-label="Gérer les préférences de cookies"
                >
                    Gérer les cookies
                </button>
                <button
                    @click="scrollToTop"
                    class="footer-btn"
                    type="button"
                    aria-label="Retour en haut de la page"
                >
                    ↑ Retour en haut
                </button>
            </div>
        </div>

        <!-- Indicateur d'accessibilité -->
        <div class="accessibility-indicator" aria-live="polite">
            <div class="indicator-content">
                <span class="indicator-icon" aria-hidden="true">♿</span>
                <span class="indicator-text">
          Ce site respecte les
          <a
              href="https://www.w3.org/WAI/standards-guidelines/wcag/"
              target="_blank"
              rel="noopener noreferrer"
              class="indicator-link"
          >
            directives WCAG 2.1 AA
          </a>
        </span>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

// Références
const showCookieSettings = ref(false)

// Données calculées
const currentYear = computed(() => new Date().getFullYear())

const currentDate = computed(() => {
    return new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

// Méthodes
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

const toggleCookieSettings = () => {
    showCookieSettings.value = !showCookieSettings.value
    // Émettre un événement si besoin
    // emit('toggle-cookie-settings', showCookieSettings.value)
}
</script>

<style scoped>
.formulation-footer {
    @apply mt-12 pt-8 border-t border-gray-200 bg-white;
    scroll-margin-top: 2rem;
}

/* Main content */
.footer-main {
    @apply mb-8;
}

.footer-content {
    @apply flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8;
}

.compliance-info {
    @apply flex items-start gap-4 max-w-2xl;
}

.compliance-icon {
    @apply flex-shrink-0 text-3xl mt-1;
}

.compliance-text {
    @apply flex-1;
}

.compliance-title {
    @apply font-bold text-gray-900 text-lg mb-2;
}

.compliance-description {
    @apply text-gray-600;
}

/* Navigation */
.footer-nav {
    @apply lg:text-right;
}

.nav-list {
    @apply flex flex-wrap gap-4 lg:flex-col lg:gap-2;
}

.nav-item {
    @apply list-none;
}

.nav-link {
    @apply text-blue-600 hover:text-blue-800 focus:text-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    rounded px-2 py-1 transition-colors text-sm;
}

/* Divider */
.footer-divider {
    @apply h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent
    my-8;
}

/* Disclaimer section */
.disclaimer-section {
    @apply mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl;
}

.disclaimer-header {
    @apply flex items-center gap-3 mb-3;
}

.disclaimer-icon {
    @apply text-2xl text-amber-600;
}

.disclaimer-title {
    @apply font-bold text-amber-800 text-lg;
}

.disclaimer-text {
    @apply text-amber-700 text-sm leading-relaxed;
}

/* Technical info */
.technical-info {
    @apply mb-8;
}

.info-grid {
    @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.info-item {
    @apply flex flex-col sm:flex-row sm:items-center gap-1 p-3 bg-gray-50 rounded-lg;
}

.info-label {
    @apply text-sm font-medium text-gray-700;
}

.info-value {
    @apply text-sm text-gray-600;
}

/* Footer bottom */
.footer-bottom {
    @apply flex flex-col sm:flex-row justify-between items-center gap-4
    pt-6 border-t border-gray-200;
}

.copyright {
    @apply text-sm text-gray-500 text-center sm:text-left;
}

.footer-links {
    @apply flex gap-3;
}

.footer-btn {
    @apply px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg
    hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors;
}

/* Accessibility indicator */
.accessibility-indicator {
    @apply mt-8 pt-6 border-t border-gray-200;
}

.indicator-content {
    @apply flex items-center justify-center gap-2;
}

.indicator-icon {
    @apply text-gray-600;
}

.indicator-text {
    @apply text-sm text-gray-600;
}

.indicator-link {
    @apply text-blue-600 hover:text-blue-800 underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .compliance-info {
        @apply flex-col items-start;
    }

    .nav-list {
        @apply grid grid-cols-2 gap-3;
    }

    .info-grid {
        @apply grid-cols-1;
    }
}

/* Print styles */
@media print {
    .formulation-footer {
        @apply border-t-2 border-gray-400 mt-16;
    }

    .footer-btn,
    .accessibility-indicator {
        @apply hidden;
    }

    .disclaimer-section {
        @apply border border-gray-400;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .nav-link,
    .footer-btn {
        @apply transition-none;
    }

    .scroll-to-top {
        animation: none;
    }
}

/* High contrast support */
@media (prefers-contrast: high) {
    .formulation-footer {
        @apply border-t-2 border-gray-900;
    }

    .nav-link {
        @apply underline;
    }

    .disclaimer-section {
        @apply border-2 border-gray-900 bg-white;
    }
}
</style>