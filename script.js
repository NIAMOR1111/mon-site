document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SÉLECTEURS ---
    const buttons = document.querySelectorAll('.id-button');
    const motifButtons = document.querySelectorAll('.motif-button');
    
    const verifBlocks = document.querySelectorAll('.verif-block');
    const motifSection = document.getElementById('motif-appel-section');
    const separators = document.querySelectorAll('hr');
    const arborescenceSection = document.getElementById('arborescence-section');
    const arborescenceContainer = document.getElementById('arborescence-container');
    const subcategoriesContainer = document.getElementById('subcategories-container');
    const actionArea = document.getElementById('action-area');
    const suiviDemandeSection = document.getElementById('suivi-demande-section');
    const bilanAppelSection = document.getElementById('bilan-appel-section');
    
    const dynamicStyle = document.getElementById('dynamic-module-style');
    const generateButton = document.getElementById('generate-button');
    const outputContainer = document.getElementById('trace-output-container');
    const outputTextarea = document.getElementById('trace-output');
    
    window.traceAction = ""; 
    let selectedMotif = null;
    let currentModuleCleanup = null;

    // --- 2. ARBORESCENCE ---
    const structureArborescence = [
        {
            title: "1 - GESTION DE CONTRAT",
            categories: [
                {
                    label: "Souscription",
                    subs: [
                        { label: "Info souscription", file: "aide_generique.html" },
                        { label: "Branchement provisoire", file: "aide_generique.html" },
                        { label: "Inversion PDL/PCE", file: "aide_generique.html" }
                    ]
                },
                {
                    label: "Changement contractuel",
                    subs: [
                        { label: "Offre (Changement)", file: "aide_changement_offre.html" },
                        { label: "Puissance (Changement)", file: "aide_changement_puissance.html" }
                    ]
                },
                {
                    label: "Facturation",
                    subs: [
                        { label: "Envoi de duplicata", file: "aide_envoi_duplicata.html" },
                        { label: "Facture non reçue / multiple", file: "aide_generique.html" },
                        { label: "Explication de facture", file: "aide_generique.html" },
                        { label: "Estimation de régularisation", file: "aide_estimation_regularisation.html" },
                        { label: "Contestation de facture", file: "aide_generique.html" }
                    ]
                },
                {
                    label: "Recouvrement",
                    subs: [
                        { label: "Délais / Impayés", file: "aide_generique.html" }
                    ]
                },
                {
                    label: "Résiliation",
                    subs: [
                        { label: "Contrat d'énergie", file: "aide_resiliation_energie.html" },
                        { label: "Contrat de service", file: "aide_generique.html" }
                    ]
                }
            ]
        },
        {
            title: "2 - DEMANDE TECHNIQUE",
            categories: [
                {
                    label: "RDV",
                    subs: [
                        { label: "Modification de RDV", file: "aide_generique.html" },
                        { label: "Réclamation RDV", file: "aide_generique.html" }
                    ]
                },
                {
                    label: "Panne / Urgence",
                    subs: [
                        { label: "Panne de courant / Gaz", file: "aide_panne_courant.html" },
                        { label: "Problème matériel", file: "aide_generique.html" },
                        { label: "Demande d'intervention", file: "aide_generique.html" }
                    ]
                },
                {
                    label: "Relevés",
                    subs: [
                        { label: "Transmission de relevés", file: "aide_transmission_releves.html" }
                    ]
                }
            ]
        }
    ];

    // --- 3. FONCTIONS INTERFACE ---
    function renderArborescence() {
        if (!arborescenceContainer) return;
        arborescenceContainer.innerHTML = ''; 
        structureArborescence.forEach((partie, pIndex) => {
            const partTitle = document.createElement('h3');
            partTitle.className = 'part-title'; partTitle.textContent = partie.title;
            arborescenceContainer.appendChild(partTitle);
            const btnGroup = document.createElement('div');
            btnGroup.className = 'button-group';
            partie.categories.forEach((cat, cIndex) => {
                const btn = document.createElement('button');
                btn.type = 'button'; btn.className = 'category-button'; btn.textContent = cat.label;
                btn.dataset.pIndex = pIndex; btn.dataset.cIndex = cIndex;
                btnGroup.appendChild(btn);
            });
            arborescenceContainer.appendChild(btnGroup);
        });
    }

    async function loadExternalModule(filename) {
        if (currentModuleCleanup) { currentModuleCleanup(); currentModuleCleanup = null; }
        if (dynamicStyle) dynamicStyle.innerHTML = "";
        actionArea.innerHTML = '<p style="color:#666;">Chargement...</p>';
        actionArea.classList.remove('hidden');
        window.traceAction = ""; 

        try {
            const response = await fetch(filename);
            if (!response.ok) throw new Error("Fichier non trouvé");
            const htmlContent = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            const styles = doc.querySelectorAll('style');
            if (dynamicStyle) styles.forEach(style => dynamicStyle.innerHTML += style.innerHTML);

            const wrapper = doc.querySelector('.module-wrapper') || doc.body;
            wrapper.querySelectorAll('script, style').forEach(el => el.remove());
            actionArea.innerHTML = wrapper.innerHTML;

            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement("script");
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);
            });
        } catch (error) {
            actionArea.innerHTML = `<h3>${filename}</h3><p><i>Module standard (Fichier non créé).</i></p>`;
            window.traceAction = `Sujet abordé : ${filename.replace('.html', '').replace('aide_', '')}`;
        }
    }

    // --- 4. LISTENERS ---

    // RGPD
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            verifBlocks.forEach(block => {
                if (block.id === targetId) { block.classList.remove('hidden'); } 
                else { block.classList.add('hidden'); block.querySelectorAll('.verif-box').forEach(b => { b.dataset.status='none'; b.innerHTML=''; }); }
            });
            if(motifSection) motifSection.classList.remove('hidden');
            separators.forEach(sep => sep.classList.remove('hidden'));
            if(arborescenceSection) { arborescenceSection.classList.remove('hidden'); renderArborescence(); }
            if(suiviDemandeSection) suiviDemandeSection.classList.remove('hidden');
            if(bilanAppelSection) bilanAppelSection.classList.remove('hidden');
            outputContainer.classList.add('hidden');
        });
    });

    // ARBORESCENCE
    if (arborescenceContainer) {
        arborescenceContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('category-button')) {
                document.querySelectorAll('.category-button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const pIndex = e.target.dataset.pIndex;
                const cIndex = e.target.dataset.cIndex;
                const subs = structureArborescence[pIndex].categories[cIndex].subs;
                subcategoriesContainer.innerHTML = '';
                subcategoriesContainer.classList.remove('hidden');
                actionArea.classList.add('hidden');
                subs.forEach(sub => {
                    const btn = document.createElement('button');
                    btn.className = 'subcategory-button';
                    btn.textContent = sub.label; btn.dataset.file = sub.file;
                    subcategoriesContainer.appendChild(btn);
                });
            }
        });
    }

    if (subcategoriesContainer) {
        subcategoriesContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('subcategory-button')) {
                document.querySelectorAll('.subcategory-button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                loadExternalModule(e.target.dataset.file);
            }
        });
    }

    // MOTIFS
    motifButtons.forEach(button => {
        button.addEventListener('click', function() {
            motifButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedMotif = this.dataset.motif;
        });
    });

    // SUIVI
    document.querySelectorAll('.suivi-header input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const contentId = this.dataset.target;
            const contentDiv = document.getElementById(contentId);
            const headerDiv = this.closest('.suivi-header');
            if (this.checked) { contentDiv.classList.remove('hidden'); headerDiv.classList.add('open'); } 
            else { contentDiv.classList.add('hidden'); headerDiv.classList.remove('open'); contentDiv.querySelectorAll('input, textarea').forEach(i => i.value = ''); }
        });
    });

    // CLICS CASES
    const handleBoxClick = function(e) {
        const status = this.dataset.status;
        if (e.type === 'click') {
            this.dataset.status = (status === 'checked') ? 'none' : 'checked';
            this.innerHTML = (this.dataset.status === 'checked') ? '✔' : '';
        } else if (e.type === 'dblclick') {
            e.preventDefault();
            this.dataset.status = 'crossed';
            this.innerHTML = '✖';
        } else if (e.type === 'contextmenu' && this.classList.contains('bilan-box')) {
            e.preventDefault();
            this.dataset.status = (status === 'proposed') ? 'none' : 'proposed';
            this.innerHTML = (this.dataset.status === 'proposed') ? 'ℹ' : '';
        }
    };
    document.querySelectorAll('.verif-box, .bilan-box').forEach(box => {
        box.addEventListener('click', handleBoxClick);
        box.addEventListener('dblclick', handleBoxClick);
        box.addEventListener('contextmenu', handleBoxClick);
    });

    // --- 5. GÉNÉRATION ---
    generateButton.addEventListener('click', function() {
        const activeIdBtn = document.querySelector('.id-button.active');
        if (!activeIdBtn) return alert("Erreur : Étape 1 (Identification) manquante.");
        if (!selectedMotif) return alert("Erreur : Étape 2 (Motif) manquante.");

        const shortMode = activeIdBtn.dataset.shortMode;
        const activeBlock = document.getElementById(activeIdBtn.dataset.target);
        const boxes = activeBlock.querySelectorAll('.verif-box');
        let red = [], greenCount = 0;
        boxes.forEach(b => { if (b.dataset.status === 'crossed') red.push(b.nextElementSibling.textContent); if (b.dataset.status === 'checked') greenCount++; });
        let trace = `Client ${shortMode === 'non identifié' ? shortMode : 'identifié par ' + shortMode}`;
        trace += red.length > 0 ? ` et RGPD échouée sur :\n` + red.map(r => ` - ${r}`).join('\n') : (greenCount === boxes.length ? ` et RGPD OK\n` : ` - Vérification RGPD incomplète.\n`);

        const now = new Date();
        trace += `\n${selectedMotif.toUpperCase()} adressée le ${now.toLocaleDateString()} à ${now.toLocaleTimeString()}.\n`;
        trace += window.traceAction ? `\n${window.traceAction}\n` : `\n⚠ Aucune action spécifique enregistrée.\n`;

        let traceSuivi = "";
        document.querySelectorAll('.suivi-header input[type="checkbox"]:checked').forEach(cb => {
            if (cb.id !== 'check-otd') { const val = document.getElementById(cb.dataset.target).querySelector('input').value; if (val) traceSuivi += `- ${cb.nextElementSibling.textContent.trim()}: ${val}\n`; }
        });
        if (document.getElementById('check-otd').checked) { traceSuivi += `- OTD: Superviseur(${document.getElementById('otd-superviseur').value}) Détails(${document.getElementById('otd-details').value})\n`; }
        if (traceSuivi) trace += `\n--- SUIVI ---\n${traceSuivi}`;

        let sous=[], rel=[], ref=[], prop=[];
        document.querySelectorAll('.bilan-box').forEach(b => {
            const l=b.dataset.label, s=b.dataset.status, t=b.dataset.type;
            if(s==='checked') t==='sub'?sous.push(l):rel.push(l);
            else if(s==='crossed') ref.push(l);
            else if(s==='proposed') prop.push(l);
        });
        if (sous.length+rel.length+ref.length+prop.length > 0) {
            trace += `\n--- BILAN ---\n`;
            if(sous.length) trace+=`Souscrit: ${sous.join(', ')}\n`;
            if(rel.length) trace+=`Mise en relation: ${rel.join(', ')}\n`;
            if(ref.length) trace+=`Refusé: ${ref.join(', ')}\n`;
            if(prop.length) trace+=`Proposé: ${prop.join(', ')}\n`;
        }

        outputTextarea.value = trace;
        outputContainer.classList.remove('hidden');
    });

});