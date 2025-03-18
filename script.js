//changer la couleur des boutons principaux
function changeColor(element, etapeId){
    
    //vérifier si un bouton est déjà cliqué dans cette étape
    if (lastClick[etapeId]){
        //retire la classe orange du dernier bouton cliqué
        lastClick[etapeId].classList.remove("orange");

    }

    //ajoute ou retire la classe orange
    element.classList.toggle("orange")

    //stocke le bouton cliqué comme dernier bouton cliqué pour cette étape
    lastClick[etapeId]=element.classList.contains("orange")?element:null;
}

//variable pour stocker le dernier bouton cliqué par étape
const lastClick={
    "1":null, //étape 1
    "2":null, //étape 2
    "3":null //étape 3
};

function showText (stepId, textId){
    //sélectionner l'étape correspondante
    const step = document.querySelector(`.step[data-step="${stepId}"]`);

    //cacher tous les textes de cette étape

    step.querySelectorAll('.text').forEach(text=>{text.classList.add('hidden');

    });

    //afficher le texte sélectionné
    document.getElementById(textId).classList.remove('hidden');
}

function unselect () {

const unselect = document.querySelectorAll('.checkbox'); // Sélectionne seulement les boutons actifs
unselect.forEach(button => {
    button.classList.remove('crossed', 'checked'); // Retire la classe active de chaque bouton
    button.innerHTML="";
});
}

function showButtons(clickedButton) {
    const group = clickedButton.getAttribute("data-group");
    const allButtons = document.querySelectorAll('.step[data-step="3"] .btnGroup .btn');

    // Cache tous les boutons au départ
    allButtons.forEach(btn => {
        btn.classList.add('hidden');
    });

    // Montre uniquement les boutons associés au groupe cliqué
    const relatedButtons = document.querySelectorAll(`.step[data-step="3"] .btnGroup .btn[data-group="${group}"], .step[data-step="3"] .btnGroup .btn.${group}`);
    relatedButtons.forEach(btn => {
        btn.classList.remove('hidden');

            // Cache le bouton cliqué  
    clickedButton.classList.add('hidden');
    });
}


// Fonction pour revenir au groupe de boutons précédent
function goBackToGroup() {
 // Cacher les boutons spécifiques (qui étaient affichés précédemment)
 const specificButtons = document.querySelectorAll('.step[data-step="3"] .btn');
 specificButtons.forEach(btn => {
     btn.classList.add('hidden'); // Cache les boutons qui ne doivent pas être affichés
 });

    // Afficher tous les boutons de l'étape 3
    const allButtons = document.querySelectorAll('.step[data-step="3"] .main');
    allButtons.forEach(main => {
        main.classList.remove('hidden', 'orange'); // Montre tous les boutons
    });

    allButtons.forEach(main => {
        main.classList.remove('hidden', 'orange'); // Montre tous les boutons
    });

    const variable = document.querySelectorAll(`.variable`);
    variable.forEach(element =>{
        element.classList.add('hidden');
    });
    const children = parentElement.querySelectorAll('*'); // Sélectionne tous les enfants
    children.forEach((child) => {
        child.classList.add('hidden');
    });
}

    document.querySelectorAll('.btn4').forEach(button=>{
        button.addEventListener('click', function placements(){
            this.classList.toggle('active');
            this.classList.toggle('hidden');
        });
    });

function toggleCheck(element) {
    element.classList.remove("crossed"); // Supprime la classe 'crossed'
    element.classList.add("checked"); // Ajoute la classe 'checked'
    element.innerHTML = "✔"; // Affiche une coche
}

function toggleCross(element) {
    element.classList.remove("checked"); // Supprime la classe 'checked'
    element.classList.add("crossed"); // Ajoute la classe 'crossed'
    element.innerHTML = "✖"; // Affiche une croix
}

document.getElementById("validerTracage").addEventListener("click", function () {
    const tracageVisible = document.querySelectorAll('[data-tracage]:not(.hidden)');
    const tracageFinal = [];

    tracageVisible.forEach(element => {
        const dataTracage = element.getAttribute('data-tracage');
        if (dataTracage) {
            tracageFinal.push(dataTracage);
        }
    });

    const placementsDisplay = document.getElementById('placementsDisplay');
    // Afficher chaque tracage récupéré sur une ligne différente
    placementsDisplay.innerHTML = tracageFinal.join('<br>');
    placementsDisplay.classList.remove('hidden');

    const tracageBox = document.getElementById('tracageBox');
    tracageBox.classList.remove('hidden');

    let tracageDisplay = document.getElementById("tracageDisplay");
    tracageDisplay.innerHTML = ""; // Réinitialiser le contenu du tracage à chaque appel

    // Vérification des demandes techniques et ajout des informations de tracage
    let tracageMessage = ""; // Variable pour accumuler les messages de tracage

    // Vérification de la demande SPID
    if (document.getElementById("spid").checked) {
        const spidNumber = document.getElementById("spidNumber").value;
        if (spidNumber) {
            tracageMessage += `J'ai fait une demande SPID : ${spidNumber}<br>`;
        } else {
            tracageMessage += `La demande SPID a été cochée, mais aucun numéro n'a été saisi.<br>`;
        }
    }

    // Vérification de la demande ENEDIS
    if (document.getElementById("enedis").checked) {
        const enedisNumber = document.getElementById("enedisNumber").value;
        if (enedisNumber) {
            tracageMessage += `J'ai fait une demande ENEDIS : ${enedisNumber}<br>`;
        } else {
            tracageMessage += `La demande ENEDIS a été cochée, mais aucun numéro n'a été saisi.<br>`;
        }
    }

    // Vérification de la demande GRDF
    if (document.getElementById("grdf").checked) {
        const grdfNumber = document.getElementById("grdfNumber").value;
        if (grdfNumber) {
            tracageMessage += `J'ai fait une demande GRDF : ${grdfNumber}<br>`;
        } else {
            tracageMessage += `La demande GRDF a été cochée, mais aucun numéro n'a été saisi.<br>`;
        }
    }

    // Si des messages de tracage ont été générés, les afficher dans tracageDisplay
    if (tracageMessage) {
        tracageDisplay.innerHTML = tracageMessage;
        tracageDisplay.classList.remove("hidden"); // Afficher l'élément tracageDisplay
    }
})


document.getElementById("validerTracage").addEventListener("click", function () {
    const confirmationLines = document.querySelectorAll('.confirmationLine:not(.hidden)');
    let uncheckedNames = [];
    
    confirmationLines.forEach(line => {
        const checkbox = line.querySelector('.checkbox');
        if (checkbox.classList.contains('crossed')) {
            // Ajoute le nom à la liste si la case n'est pas cochée
            uncheckedNames.push(checkbox.getAttribute('data-name'));
        }
    });

    // Si aucune case n'est cochée, ne rien ajouter dans data-tracage
    if (uncheckedNames.length === 0) {
        // Ne rien faire ou gérer le traçage comme vide
        return; // On sort de la fonction si aucune case n'est cochée
    } else {
        // Sélectionner un élément spécifique pour mettre à jour l'attribut data-tracage
        const firstLine = confirmationLines[0]; // Ou tout autre élément selon votre besoin
        const tracage = `Identification échouée pour : ${uncheckedNames.join(', ')}`;
        firstLine.setAttribute('data-tracage', tracage); // Mettre à jour l'attribut data-tracage
    }

    // Vous pouvez ensuite mettre ce message dans un élément HTML si besoin
    const tracageDisplay = document.getElementById('tracageDisplay');
    tracageDisplay.innerHTML = `Message: ${tracage}`; // Affichage dans le tracageDisplay
})

document.querySelectorAll('.nextStep').forEach(button => {
    button.addEventListener('click', () => {

        const speechContainer = document.querySelector('#conteneur');

        // Récupérer l'élément cliqué
        const clickedElement = event.target;

        // Récupérer l'ID de l'élément cliqué
        const elementId = clickedElement.id;

        // Ajouter ".html" après l'ID
        const fileName = elementId + ".html";

        // Utiliser fetch pour récupérer le contenu
        fetch(fileName)
            .then(response => {
                return response.text();
            })
            .then(htmlContent => {
                // Insérer le contenu récupéré dans l'élément HTML
                speechContainer.innerHTML = htmlContent;

                // Exécuter les scripts inclus dans le contenu chargé
                const scripts = speechContainer.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    // Copier les attributs du script original
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    // Copier le contenu du script
                    newScript.textContent = oldScript.textContent;
                    // Remplacer l'ancien script
                    oldScript.replaceWith(newScript);
                });

                // Appliquer les styles intégrés si nécessaire
                const styles = speechContainer.querySelectorAll('style');
                styles.forEach(style => {
                    const newStyle = document.createElement('style');
                    newStyle.textContent = style.textContent;
                    newStyle.classList.add('dynamic-style'); // Ajoute une classe pour permettre leur suppression
                    document.head.appendChild(newStyle);
                });
            });
    });
});

// Gestion du bouton de suppression
document.getElementById('backButton').addEventListener('click', () => {
    // Supprimer tous les scripts dynamiques ajoutés
    const dynamicScripts = document.querySelectorAll('#conteneur script');
    dynamicScripts.forEach(script => script.remove());

    // Supprimer tous les styles dynamiques ajoutés
    const dynamicStyles = document.querySelectorAll('style.dynamic-style');
    dynamicStyles.forEach(style => style.remove());

    // Supprimer le contenu de l'élément conteneur
    const speechContainer = document.querySelector('#conteneur');
    speechContainer.innerHTML = '';
    const aideTracage = document.querySelector('#aideTracage');
    aideTracage.innerHTML='';
    const hideDisplay = document.querySelector('#messageDisplay');
    hideDisplay.classList.add('hidden');
});

document.addEventListener("DOMContentLoaded", function () {
    const gallerie = document.getElementById("gallerie");
    const relevesbtn = document.getElementById("relevesButton");
    const imageRoot = relevesbtn.getAttribute("data-image-root");
    const imageNumber = parseInt(relevesbtn.getAttribute("data-image-number"), 10);
    
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let currentImageIndex = 0;

    // Générer les miniatures
    for (let i = 1; i <= imageNumber; i++) {
        const img = document.createElement("img");
        img.src = `${imageRoot}${i}.png`;
        img.alt = `Image ${i}`;
        img.dataset.index = i - 1; // Stocker l'index de l'image
        img.addEventListener("click", openModal);
        gallerie.appendChild(img);
    }

    // Fonction pour ouvrir le modal
    function openModal(event) {
        currentImageIndex = parseInt(event.target.dataset.index, 10);
        showImage(currentImageIndex);
        modal.style.display = "flex";
    }

    // Fonction pour afficher une image dans le modal
    function showImage(index) {
        modalImage.src = `${imageRoot}${index + 1}.png`;
    }

    // Fermer le modal
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Naviguer vers l'image précédente
    prevButton.addEventListener("click", function () {
        currentImageIndex = (currentImageIndex - 1 + imageNumber) % imageNumber;
        showImage(currentImageIndex);
    });

    // Naviguer vers l'image suivante
    nextButton.addEventListener("click", function () {
        currentImageIndex = (currentImageIndex + 1) % imageNumber;
        showImage(currentImageIndex);
    });

    // Fermer le modal en cliquant à l'extérieur de l'image
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

document.querySelectorAll('.nextStep').forEach(button => {
    button.addEventListener('click', () => {
    
    const speechContainer = document.querySelector('#aideTracage');

     // Récupérer l'élément cliqué
     const clickedElement = event.target;

     // Récupérer l'ID de l'élément cliqué
    const elementId = clickedElement.id;

       // Ajouter ".html" après l'ID
       const fileName = elementId + "aide" +".html";

    // Utiliser fetch pour récupérer le contenu de 2.html
    fetch(fileName)
        .then(response => {
            return response.text();
        })
        .then(htmlContent => {
            // Insérer le contenu récupéré dans l'élément HTML
            speechContainer.innerHTML = htmlContent;

            // Exécuter les scripts inclus dans le contenu chargé
            const scripts = speechContainer.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                // Copier les attributs du script original
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                // Copier le contenu du script
                newScript.textContent = oldScript.textContent;
                // Remplacer l'ancien script
                oldScript.replaceWith(newScript);
            });

            // Appliquer les styles intégrés si nécessaire (facultatif)
            const styles = speechContainer.querySelectorAll('style');
            styles.forEach(style => {
                const newStyle = document.createElement('style');
                newStyle.textContent = style.textContent;
                document.head.appendChild(newStyle);
            });
        });
})
const makeappear = document.getElementById('messageDisplay');
makeappear.classList.remove('hidden');

});

//copier le texte de traçage en un clic gauche
// Fonction pour copier le texte de la zone tracageDisplay
document.getElementById("tracageDisplay").addEventListener("click", function() {
    // Crée un élément temporaire de type texte
    const range = document.createRange();
    range.selectNodeContents(this);
    
    // Sélectionne le texte de la zone
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Tente de copier le texte dans le presse-papiers
    try {
        document.execCommand('copy');
        alert("Le texte a été copié !");
    } catch (err) {
        console.error("Erreur lors de la copie : ", err);
    }
    
    // Désélectionne le texte après la copie
    selection.removeAllRanges();
});

document.getElementById('backButton').addEventListener('click', ()=> {
    const hideTracage = document.querySelector('#tracageBox');
    hideTracage.classList.add('hidden');
})

const buttons = document.querySelectorAll('.typeTracage');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Récupérer la date et l'heure actuelles  
        const now = new Date();
        const dateString = now.toLocaleString();

        // Mettre à jour le data-tracage  
        if (this.textContent.trim() === 'Demande') {
            this.setAttribute('data-tracage', `Le client a formulé une demande le ${dateString}`);
        } else if (this.textContent.trim() === 'Réclamation') {
            this.setAttribute('data-tracage', `Le client a formulé une réclamation le ${dateString}`);
        }

        // Annuler le data-tracage de l'autre bouton  
        buttons.forEach(btn => {
            if (btn !== this) {
                btn.setAttribute('data-tracage', '');
            }
        });
    });
});

// Fonction pour afficher/masquer le champ de référence
function toggleReferenceField(checkbox, referenceId) {
    const referenceField = document.getElementById(referenceId);
    if (checkbox.checked) {
        referenceField.classList.remove('hidden');
    } else {
        referenceField.classList.add('hidden');
    }
}