export interface UserEntity {
    nom : string;
    prenoms : string;
    date_de_naissance : Date | string;
    lieu_de_naissance : string;
    courriel : string;
    telephone : string;
    adresse : string;
    sexe : string;
    nationalite : string;

    type_de_piece : string;
    numero_de_piece : string;

    cycle : string;
    filiere : string;

    situation_matrimoniale : string;
    nombre_denfants : number;
    
    role : string;
    statut : string;
    frais_dinscription : number;
    frais_de_scolarite : number;

    date_de_creation : Date | string;
    date_de_derniere_modification : Date | string;
    cree_par : string;
    modifie_par : string;
}
