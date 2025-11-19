document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SÉLECTEURS GLOBAUX ---
    const buttons = document.querySelectorAll('.id-button');
    const motifButtons = document.querySelectorAll('.motif-button');
    
    // Sections HTML
    const verifBlocks = document.querySelectorAll('.verif-block');
    const motifSection = document.getElementById('motif-appel-section');
    const separators = document.querySelectorAll('hr');
    const arborescenceSection = document.getElementById('arborescence-section');
    const categoriesContainer = document.getElementById('categories-container');
    const subcategoriesContainer = document.getElementById('subcategories-container');
    const actionArea = document.getElementById('action-area');
    const suiviDemandeSection = document.getElementById('suivi-demande-section');
    const bilanAppelSection = document.getElementById('bilan-appel-section');
    
    // Style dynamique
    const dynamicStyle = document.getElementById('dynamic-module-style');

    // Outputs
    const generateButton = document.getElementById('generate-button');
    const outputContainer = document.getElementById('trace-output-container');
    const outputTextarea = document.getElementById('trace-output');
    
    // --- 2. VARIABLES GLOBALES ---
    window.traceAction = ""; 
    let selectedMotif = null;
    let currentModuleCleanup = null; // Pour nettoyer le script du module précédent

    // --- 3. DONNÉES ARBORESCENCE ---
    const arborescence = {
        puissance: { 
            label: "Puissance", 
            sub: { 
                changement_puissance: { label: "Changement de puissance", file: "aide_changement_puissance.html" }, 
                info_puissance: { label: "Information sur la puissance", file: "aide_info_puissance.html" } 
            } 
        },
        facturation: { 
            label: "Facturation", 
            sub: { 
                paiement: { label: "Paiement et échéancier", file: "aide_paiement.html" }, 
                contestation: { label: "Contestation et Remboursement", file: "aide_contestation.html" } 
            } 
        },
        contrat: { 
            label: "Contrat", 
            sub: { 
                souscription_resiliation: { label: "Souscription / Résiliation", file: "aide_contrat.html" }, 
                modification_offre: { label: "Modification d'offre", file: "aide_modification_offre.html" } 
            } 
        },
        intervention: { 
            label: "Intervention", 
            sub: { 
                releve: { label: "Relève et Compteur", file: "aide_releve.html" }, 
                depannage: { label: "Dépannage / Urgence", file: "aide_depannage.html" } 
            } 
        }
    };

    // --- 4. FONCTION DE CHARGEMENT MODULAIRE (Cœur du système) ---
    async function loadExternalModule(filename) {
        // A. Nettoyage
        if (currentModuleCleanup) {
            currentModuleCleanup(); // Appel de la fonction de nettoyage du module précédent
            currentModuleCleanup = null;
        }
        dynamicStyle.innerHTML = ""; // Supprimer le CSS précédent
        actionArea.innerHTML = '<p style="color:#666;">Chargement du module...</p>';
        actionArea.classList.remove('hidden');
        window.traceAction = ""; 

        try {
            const response = await fetch(filename);
            if (!response.ok) throw new Error("Fichier introuvable");
            
            const htmlContent = await response.text();
            
            // B. Parsing
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            // C. Injection CSS
            const styles = doc.querySelectorAll('style');
            styles.forEach(style => dynamicStyle.innerHTML += style.innerHTML);

            // D. Injection HTML (Wrapper)
            const wrapper = doc.querySelector('.module-wrapper') || doc.body;
            // On retire les scripts du HTML parsé pour les exécuter manuellement après
            wrapper.querySelectorAll('script').forEach(s => s.remove());
            wrapper.querySelectorAll('style').forEach(s => s.remove());
            
            actionArea.innerHTML = wrapper.innerHTML;

            // E. Exécution JS
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement("script");
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript); // Exécute le script
                document.body.removeChild(newScript); // Nettoie la balise
            });

        } catch (error) {
            actionArea.innerHTML = `
                <h3>${filename}</h3>
                <p>Simulation : Le fichier n'existe pas sur le serveur.</p>
            `;
            window.traceAction = `Le client a abordé le sujet : ${filename.replace('.html', '')}`;
        }
    }

    // --- 5. LOGIQUE ÉVÉNEMENTIELLE (Boutons et Interactions) ---

    // A. Gestion des Boites (Verif RGPD)
    document.querySelectorAll('.verif-box').forEach(box => {
        box.addEventListener('click', function() {
            const status = this.dataset.status;
            this.dataset.status = (status === 'checked') ? 'none' : 'checked';
            this.innerHTML = (this.dataset.status === 'checked') ? '✔' : '';
            outputContainer.classList.add('hidden');
        });
        box.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const status = this.dataset.status;
            this.dataset.status = (status === 'crossed') ? 'none' : 'crossed';
            this.innerHTML = (this.dataset.status === 'crossed') ? '✖' : '';
            outputContainer.classList.add('hidden');
        });
    });

    // B. Boutons Identification (Étape 1)
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            
            // Gestion classe active
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Affichage bloc vérification
            verifBlocks.forEach(block => {
                if (block.id === targetId) {
                    block.classList.remove('hidden');
                } else {
                    block.classList.add('hidden');
                    // Reset des cases des autres blocs
                    block.querySelectorAll('.verif-box').forEach(box => { 
                        box.dataset.status = 'none'; 
                        box.innerHTML = ''; 
                    });
                }
            });
            
            // Afficher TOUTES les étapes suivantes
            motifSection.classList.remove('hidden');
            separators.forEach(sep => sep.classList.remove('hidden'));
            arborescenceSection.classList.remove('hidden'); 
            suiviDemandeSection.classList.remove('hidden');
            bilanAppelSection.classList.remove('hidden');
            
            outputContainer.classList.add('hidden');
        });
    });

    // C. Boutons Motif (Étape 2)
    motifButtons.forEach(button => {
        button.addEventListener('click', function() {
            motifButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedMotif = this.dataset.motif;
            outputContainer.classList.add('hidden');
        });
    });

    // D. Arborescence (Étape 3)
    categoriesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-button')) {
            // Gestion boutons catégories
            categoriesContainer.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const catKey = e.target.dataset.category;
            const subs = arborescence[catKey].sub;
            
            // Remplir sous-catégories
            subcategoriesContainer.innerHTML = '';
            subcategoriesContainer.classList.remove('hidden');
            actionArea.classList.add('hidden');
            
            for (const key in subs) {
                const btn = document.createElement('button');
                btn.className = 'category-button';
                btn.dataset.file = subs[key].file;
                btn.textContent = subs[key].label;
                subcategoriesContainer.appendChild(btn);
            }
            outputContainer.classList.add('hidden');
        }
    });

    subcategoriesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-button')) {
            subcategoriesContainer.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            // CHARGER LE MODULE EXTERNE
            loadExternalModule(e.target.dataset.file);
            outputContainer.classList.add('hidden');
        }
    });

    // E. Suivi de la demande (Étape 4)
    // Calcul date automatique
    function calculateRecontactDate() {
        const today = new Date();
        let futureDate = new Date();
        futureDate.setDate(today.getDate() + 15);
        if (futureDate.getDay() === 0) futureDate.setDate(futureDate.getDate() + 1);
        return futureDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    document.querySelectorAll('.suivi-header input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const contentId = this.dataset.target;
            const contentDiv = document.getElementById(contentId);
            const headerDiv = this.closest('.suivi-header');
            
            if (this.checked) {
                contentDiv.classList.remove('hidden');
                headerDiv.classList.add('open');
                if (this.id === 'check-otd') document.getElementById('otd-date').value = calculateRecontactDate();
            } else {
                contentDiv.classList.add('hidden');
                headerDiv.classList.remove('open');
                contentDiv.querySelectorAll('input, textarea').forEach(i => i.value = '');
            }
            outputContainer.classList.add('hidden');
        });
    });

    // F. Bilan (Étape 5) - Gestion Clic Droit/Gauche/Double
    document.querySelectorAll('.bilan-box').forEach(box => {
        box.addEventListener('click', function() {
            const status = this.dataset.status;
            this.dataset.status = (status === 'checked') ? 'none' : 'checked';
            this.innerHTML = (this.dataset.status === 'checked') ? '✔' : '';
        });
        box.addEventListener('dblclick', function(e) {
            e.preventDefault();
            this.dataset.status = 'crossed';
            this.innerHTML = '✖';
        });
        box.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const status = this.dataset.status;
            this.dataset.status = (status === 'proposed') ? 'none' : 'proposed';
            this.innerHTML = (this.dataset.status === 'proposed') ? 'ℹ' : '';
        });
    });

    // --- 6. GÉNÉRATION DU TRAÇAGE FINAL ---
    generateButton.addEventListener('click', function() {
        
        // Vérifications
        const activeIdBtn = document.querySelector('.id-button.active');
        if (!activeIdBtn) { alert("Veuillez sélectionner un mode d'identification (Étape 1)."); return; }
        if (!selectedMotif) { alert("Veuillez sélectionner un motif (Étape 2)."); return; }

        // 1. RGPD
        const shortMode = activeIdBtn.dataset.shortMode;
        const activeBlock = document.getElementById(activeIdBtn.dataset.target);
        const boxes = activeBlock.querySelectorAll('.verif-box');
        let red = [], greenCount = 0;
        boxes.forEach(b => {
            if(b.dataset.status === 'crossed') red.push(b.nextElementSibling.textContent.trim());
            if(b.dataset.status === 'checked') greenCount++;
        });

        let trace = `Client ${shortMode === 'non identifié' ? shortMode : 'identifié par ' + shortMode}`;
        if (red.length > 0) trace += ` et RGPD échouée sur :\n` + red.map(r => ` - ${r}`).join('\n');
        else if (greenCount === boxes.length) trace += ` et RGPD OK\n`;
        else trace += ` - Vérification RGPD incomplète.\n`;

        // 2. Motif & Date
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR');
        const timeStr = now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
        trace += `\n${selectedMotif.charAt(0).toUpperCase() + selectedMotif.slice(1)} adressée le ${dateStr} à ${timeStr}.\n`;

        // 3. Action (Variable globale remplie par le module)
        trace += window.traceAction ? `\n${window.traceAction}\n` : `\n⚠ Aucune action spécifique sélectionnée.\n`;

        // 4. Suivi
        let traceSuivi = "";
        document.querySelectorAll('.suivi-header input[type="checkbox"]:checked').forEach(cb => {
            if (cb.id !== 'check-otd') {
                const val = document.getElementById(cb.dataset.target).querySelector('input').value;
                if (val) traceSuivi += `- ${cb.nextElementSibling.textContent.trim()}: ${val}\n`;
            }
        });
        if (document.getElementById('check-otd').checked) {
            traceSuivi += `- OTD: Superviseur (${document.getElementById('otd-superviseur').value}), Détails (${document.getElementById('otd-details').value}), Recontact (${document.getElementById('otd-date').value})\n`;
        }
        if (traceSuivi) trace += `\n--- SUIVI ---\n${traceSuivi}`;

        // 5. Bilan
        let souscrits = [], relations = [], refuses = [], proposes = [];
        document.querySelectorAll('.bilan-box').forEach(box => {
            const label = box.dataset.label;
            const type = box.dataset.type;
            const status = box.dataset.status;

            if (status === 'checked') {
                if (type === 'sub') souscrits.push(label);
                else relations.push(label);
            } else if (status === 'crossed') refuses.push(label);
            else if (status === 'proposed') proposes.push(label);
        });

        if (souscrits.length > 0 || relations.length > 0 || refuses.length > 0 || proposes.length > 0) {
            trace += `\n--- BILAN DE L'APPEL ---\n`;
            if (souscrits.length > 0) trace += `Le client a souscrit à : ${souscrits.join(', ')}\n`;
            if (relations.length > 0) trace += `Le client a demandé à être mis en relation avec : ${relations.join(', ')}\n`;
            if (refuses.length > 0) trace += `Le client a refusé : ${refuses.join(', ')}\n`;
            if (proposes.length > 0) trace += `Proposition faite pour : ${proposes.join(', ')}\n`;
        }

        // Affichage final
        outputTextarea.value = trace;
        outputContainer.classList.remove('hidden');
    });

});