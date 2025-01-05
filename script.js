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

function tracage () {
    const tracageVisible = document.querySelectorAll('[data-tracage]:not(.hidden)');
    const tracageFinal = [];

    tracageVisible.forEach(element => {
        const dataTracage = element.getAttribute('data-tracage');
        if (dataTracage) {
            tracageFinal.push(dataTracage);
        }
    });

    const tracageDisplay = document.getElementById('tracageDisplay');
    // Afficher chaque tracage récupéré sur une ligne différente
    tracageDisplay.innerHTML = 'Données récupérées :<br>' + tracageFinal.join('<br>');
    tracageDisplay.classList.remove('hidden');
}


function rgpdTracage() {
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
}

// Gestion du changement dans le menu déroulant
document.getElementById('optionsReleve').addEventListener('change', function () {
    const selectedOption = this.value;

    switch (selectedOption) {
        case 'base':
            hideTransmission(); transmissionReleves2();
            break;
        case 'hc_hp':
            hideTransmission(); transmissionReleves3();
            break;
        case 'tempo_ejp':
            hideTransmission(); transmissionReleves5();
            break;
        case 'zen_weekend':
            hideTransmission(); transmissionReleves4();
            break;
        default:
            console.error("Option non gérée :", selectedOption);
    }
});

// Initialisation au chargement de la page
window.onload = function () {
    transmissionReleves2(); // Option par défaut "Base"
};

function transmissionReleves (button) {
    const showOption = document.querySelectorAll('.transmissionReleves, #textBoxDisplay, #messageDisplay');
    showOption.forEach(element => {
        element.classList.remove('hidden');
    });
}

function transmissionReleves2() {
    const showElement = document.getElementById('indexBase');
    showElement.classList.remove('hidden');
    showElement.classList.add('active');
}

function transmissionReleves3() {
    const showElement = document.getElementById('indexHCHP');
    showElement.classList.remove('hidden');
    showElement.classList.add('active');
}

function transmissionReleves4() {
    const showElement = document.getElementById('indexWE');
    showElement.classList.remove('hidden');
    showElement.classList.add('active');
}

function transmissionReleves5() {
    const showElement = document.getElementById('indexTempo');
    showElement.classList.remove('hidden');
    showElement.classList.add('active');
}

function hideTransmission (){
    const cacherIndex = document.querySelectorAll(".index")
    cacherIndex.forEach(element => {
        element.classList.add('hidden');
    })
    cacherIndex.forEach(element => {
        element.classList.remove('active');
    })
}

fetch('transmission_releves.html')
    .then(response => response.text())
    .then(html => document.getElementById('contenu').innerHTML = html);
