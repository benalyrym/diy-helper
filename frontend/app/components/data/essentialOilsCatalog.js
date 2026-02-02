const makeOil = (name, latinName, properties, options = {}) => ({
    name,
    latinName,
    properties,
    maxFace: options.maxFace ?? 0.5,
    ifra: options.ifra ?? options.maxFace ?? 0.5,
    pregnancy: options.pregnancy ?? true,
    photo: options.photo ?? false,
    allergen: options.allergen ?? false
})

export const essentialOilsCatalog = {
    'Anti-age et regeneration': [
        makeOil('Encens', 'Boswellia carterii', ['Anti-age', 'Regenerant', 'Cicatrisant'], { maxFace: 0.5, pregnancy: true }),
        makeOil('Helichryse italienne', 'Helichrysum italicum', ['Anti-age', 'Regenerant', 'Cicatrisant'], { maxFace: 0.4, pregnancy: true }),
        makeOil('Ciste ladanifere', 'Cistus ladaniferus', ['Anti-age', 'Regenerant', 'Astringent'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Carotte sauvage', 'Daucus carota', ['Regenerant', 'Eclat', 'Anti-age'], { maxFace: 0.3, pregnancy: false, photo: true }),
        makeOil('Myrrhe', 'Commiphora myrrha', ['Regenerant', 'Cicatrisant', 'Antioxydant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Elemi', 'Canarium luzonicum', ['Regenerant', 'Equilibrant', 'Antioxydant'], { maxFace: 0.5, pregnancy: true, allergen: true }),
        makeOil('Bois de rose', 'Aniba rosaeodora', ['Hydratant', 'Regenerant', 'Apaisant'], { maxFace: 0.8, pregnancy: true, allergen: true }),
        makeOil('Rose damas', 'Rosa damascena', ['Anti-age', 'Eclat', 'Apaisant'], { maxFace: 0.3, pregnancy: true, allergen: true }),
        makeOil('Patchouli', 'Pogostemon cablin', ['Regenerant', 'Equilibrant', 'Cicatrisant'], { maxFace: 0.5, pregnancy: true, allergen: true }),
        makeOil('Vetiver', 'Vetiveria zizanoides', ['Regenerant', 'Calmant', 'Anti-age'], { maxFace: 0.4, pregnancy: true, allergen: true })
    ],
    'Hydratation et eclat': [
        makeOil('Lavande vraie', 'Lavandula angustifolia', ['Apaisant', 'Hydratant', 'Equilibrant'], { maxFace: 1.0, pregnancy: true }),
        makeOil('Geranium rosat', 'Pelargonium graveolens', ['Equilibrant', 'Hydratant', 'Eclat'], { maxFace: 0.5, pregnancy: false, allergen: true }),
        makeOil('Neroli', 'Citrus aurantium var. amara', ['Eclat', 'Apaisant', 'Hydratant'], { maxFace: 0.3, pregnancy: true, allergen: true }),
        makeOil('Petitgrain bigarade', 'Citrus aurantium', ['Equilibrant', 'Eclat', 'Apaisant'], { maxFace: 0.6, pregnancy: true, allergen: true }),
        makeOil('Ylang-ylang', 'Cananga odorata', ['Relaxant', 'Eclat', 'Equilibrant'], { maxFace: 0.5, pregnancy: false, allergen: true }),
        makeOil('Palmarosa', 'Cymbopogon martinii', ['Hydratant', 'Regenerant', 'Equilibrant'], { maxFace: 0.7, pregnancy: true, allergen: true }),
        makeOil('Ho wood', 'Cinnamomum camphora', ['Hydratant', 'Apaisant', 'Eclat'], { maxFace: 0.8, pregnancy: true }),
        makeOil('Camomille romaine', 'Chamaemelum nobile', ['Apaisant', 'Calmant', 'Hydratant'], { maxFace: 0.3, pregnancy: true }),
        makeOil('Lavande aspic', 'Lavandula latifolia', ['Apaisant', 'Purifiant', 'Hydratant'], { maxFace: 0.5, pregnancy: false, allergen: true }),
        makeOil('Litsea cubeba', 'Litsea cubeba', ['Eclat', 'Purifiant', 'Tonique'], { maxFace: 0.4, pregnancy: false, allergen: true })
    ],
    'Apaisant et sensible': [
        makeOil('Camomille allemande', 'Matricaria recutita', ['Apaisant', 'Calmant', 'Anti-inflammatoire'], { maxFace: 0.3, pregnancy: true }),
        makeOil('Tanaisie bleue', 'Tanacetum annuum', ['Apaisant', 'Calmant', 'Anti-inflammatoire'], { maxFace: 0.2, pregnancy: false }),
        makeOil('Marjolaine a coquilles', 'Origanum majorana', ['Apaisant', 'Relaxant', 'Equilibrant'], { maxFace: 0.5, pregnancy: true, allergen: true }),
        makeOil('Melisse', 'Melissa officinalis', ['Apaisant', 'Calmant', 'Eclat'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Verveine citronnee', 'Aloysia citriodora', ['Apaisant', 'Relaxant', 'Eclat'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Copaiba', 'Copaifera officinalis', ['Apaisant', 'Regenerant', 'Calmant'], { maxFace: 1.0, pregnancy: true }),
        makeOil('Nard', 'Nardostachys jatamansi', ['Relaxant', 'Apaisant', 'Calmant'], { maxFace: 0.5, pregnancy: false, allergen: true }),
        makeOil('Lavandin grosso', 'Lavandula intermedia', ['Apaisant', 'Equilibrant', 'Purifiant'], { maxFace: 0.8, pregnancy: false, allergen: true }),
        makeOil('Santal', 'Santalum album', ['Apaisant', 'Regenerant', 'Calmant'], { maxFace: 0.5, pregnancy: true }),
        makeOil('Cajeput', 'Melaleuca cajuputi', ['Apaisant', 'Purifiant', 'Tonique'], { maxFace: 0.5, pregnancy: false, allergen: true })
    ],
    'Purifiant et anti-imperfections': [
        makeOil('Tea tree', 'Melaleuca alternifolia', ['Purifiant', 'Antiseptique', 'Tonique'], { maxFace: 0.7, pregnancy: false }),
        makeOil('Niaouli', 'Melaleuca quinquenervia', ['Purifiant', 'Antiseptique', 'Tonique'], { maxFace: 0.6, pregnancy: false }),
        makeOil('Eucalyptus radiata', 'Eucalyptus radiata', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.6, pregnancy: false }),
        makeOil('Eucalyptus globulus', 'Eucalyptus globulus', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.5, pregnancy: false }),
        makeOil('Ravintsara', 'Cinnamomum camphora', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.6, pregnancy: false }),
        makeOil('Thym linalol', 'Thymus vulgaris linalool', ['Purifiant', 'Antiseptique', 'Tonique'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Romarin cineole', 'Rosmarinus officinalis', ['Purifiant', 'Tonique', 'Antioxydant'], { maxFace: 0.4, pregnancy: false, allergen: true }),
        makeOil('Laurier noble', 'Laurus nobilis', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.5, pregnancy: false, allergen: true }),
        makeOil('Citronnelle', 'Cymbopogon nardus', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.4, pregnancy: false, allergen: true }),
        makeOil('Lemongrass', 'Cymbopogon citratus', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.3, pregnancy: false, allergen: true })
    ],
    'Tonique et circulation': [
        makeOil('Cypres', 'Cupressus sempervirens', ['Tonique', 'Circulatoire', 'Astringent'], { maxFace: 0.6, pregnancy: false, allergen: true }),
        makeOil('Genevrier', 'Juniperus communis', ['Tonique', 'Detoxifiant', 'Circulatoire'], { maxFace: 0.5, pregnancy: false, allergen: true }),
        makeOil('Cedre atlas', 'Cedrus atlantica', ['Tonique', 'Circulatoire', 'Regenerant'], { maxFace: 0.6, pregnancy: false }),
        makeOil('Pin sylvestre', 'Pinus sylvestris', ['Tonique', 'Stimulant', 'Purifiant'], { maxFace: 0.8, pregnancy: false }),
        makeOil('Sapin baumier', 'Abies balsamea', ['Tonique', 'Stimulant', 'Purifiant'], { maxFace: 0.8, pregnancy: false }),
        makeOil('Menthe poivree', 'Mentha piperita', ['Tonique', 'Stimulant', 'Purifiant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Menthe verte', 'Mentha spicata', ['Tonique', 'Stimulant', 'Purifiant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Romarin verbenone', 'Rosmarinus officinalis verbenone', ['Tonique', 'Circulatoire', 'Regenerant'], { maxFace: 0.4, pregnancy: false, allergen: true }),
        makeOil('Gingembre', 'Zingiber officinale', ['Tonique', 'Circulatoire', 'Rechauffant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Poivre noir', 'Piper nigrum', ['Tonique', 'Circulatoire', 'Rechauffant'], { maxFace: 0.3, pregnancy: false, allergen: true })
    ],
    'Agrumes phototoxiques': [
        makeOil('Bergamote', 'Citrus bergamia', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.2, pregnancy: true, photo: true, allergen: true }),
        makeOil('Citron', 'Citrus limon', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.2, pregnancy: true, photo: true, allergen: true }),
        makeOil('Citron vert', 'Citrus aurantifolia', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.2, pregnancy: true, photo: true, allergen: true }),
        makeOil('Pamplemousse', 'Citrus paradisi', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.3, pregnancy: true, photo: true, allergen: true }),
        makeOil('Orange douce', 'Citrus sinensis', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.5, pregnancy: true, photo: true, allergen: true }),
        makeOil('Orange amere', 'Citrus aurantium', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.3, pregnancy: true, photo: true, allergen: true }),
        makeOil('Mandarine rouge', 'Citrus reticulata', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.5, pregnancy: true, photo: true, allergen: true }),
        makeOil('Tangerine', 'Citrus tangerina', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.5, pregnancy: true, photo: true, allergen: true }),
        makeOil('Yuzu', 'Citrus junos', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.2, pregnancy: true, photo: true, allergen: true }),
        makeOil('Kumquat', 'Citrus japonica', ['Eclat', 'Tonique', 'Detoxifiant'], { maxFace: 0.2, pregnancy: true, photo: true, allergen: true })
    ],
    'Bois et resines': [
        makeOil('Cedre de Virginie', 'Juniperus virginiana', ['Regenerant', 'Tonique', 'Ancrant'], { maxFace: 0.6, pregnancy: false }),
        makeOil('Amyris', 'Amyris balsamifera', ['Apaisant', 'Regenerant', 'Equilibrant'], { maxFace: 0.6, pregnancy: true }),
        makeOil('Benjoin', 'Styrax benzoin', ['Regenerant', 'Apaisant', 'Cicatrisant'], { maxFace: 0.5, pregnancy: true, allergen: true }),
        makeOil('Palo santo', 'Bursera graveolens', ['Apaisant', 'Regenerant', 'Purifiant'], { maxFace: 0.5, pregnancy: true }),
        makeOil('Bois de gaiac', 'Guaiacum officinale', ['Regenerant', 'Antioxydant', 'Apaisant'], { maxFace: 0.4, pregnancy: true }),
        makeOil('Opoponax', 'Commiphora erythraea', ['Regenerant', 'Calmant', 'Ancrant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Pin maritime', 'Pinus pinaster', ['Tonique', 'Purifiant', 'Stimulant'], { maxFace: 0.8, pregnancy: false }),
        makeOil('Sapin de Siberie', 'Abies sibirica', ['Tonique', 'Purifiant', 'Stimulant'], { maxFace: 0.8, pregnancy: false }),
        makeOil('Epinette noire', 'Picea mariana', ['Tonique', 'Purifiant', 'Stimulant'], { maxFace: 0.8, pregnancy: false }),
        makeOil('Thuya', 'Thuja occidentalis', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.2, pregnancy: false, allergen: true })
    ],
    'Fleurs et parfums': [
        makeOil('Rose de mai', 'Rosa centifolia', ['Eclat', 'Apaisant', 'Anti-age'], { maxFace: 0.2, pregnancy: true, allergen: true }),
        makeOil('Jasmin', 'Jasminum officinale', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Tuberose', 'Polianthes tuberosa', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.1, pregnancy: false, allergen: true }),
        makeOil('Mimosa', 'Acacia decurrens', ['Apaisant', 'Eclat', 'Relaxant'], { maxFace: 0.2, pregnancy: true, allergen: true }),
        makeOil('Violette', 'Viola odorata', ['Apaisant', 'Eclat', 'Relaxant'], { maxFace: 0.1, pregnancy: true, allergen: true }),
        makeOil('Champaca', 'Magnolia champaca', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.1, pregnancy: false, allergen: true }),
        makeOil('Osmanthus', 'Osmanthus fragrans', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.1, pregnancy: false, allergen: true }),
        makeOil('Frangipanier', 'Plumeria alba', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.2, pregnancy: true, allergen: true }),
        makeOil('Narcisse', 'Narcissus poeticus', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.1, pregnancy: false, allergen: true }),
        makeOil('Gardenia', 'Gardenia jasminoides', ['Eclat', 'Relaxant', 'Apaisant'], { maxFace: 0.1, pregnancy: true, allergen: true })
    ],
    'Herbacees et aromatiques': [
        makeOil('Basilic tropical', 'Ocimum basilicum', ['Tonique', 'Purifiant', 'Stimulant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Basilic sacre', 'Ocimum sanctum', ['Tonique', 'Purifiant', 'Stimulant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Sauge sclaree', 'Salvia sclarea', ['Equilibrant', 'Relaxant', 'Tonique'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Sauge officinale', 'Salvia officinalis', ['Purifiant', 'Tonique', 'Antiseptique'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Origan compact', 'Origanum compactum', ['Purifiant', 'Antiseptique', 'Tonique'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Thym thymol', 'Thymus vulgaris thymol', ['Purifiant', 'Antiseptique', 'Tonique'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Sarriette des montagnes', 'Satureja montana', ['Purifiant', 'Antiseptique', 'Tonique'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Estragon', 'Artemisia dracunculus', ['Apaisant', 'Digestif', 'Relaxant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Hysope', 'Hyssopus officinalis', ['Purifiant', 'Tonique', 'Stimulant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Coriandre feuille', 'Coriandrum sativum', ['Equilibrant', 'Tonique', 'Apaisant'], { maxFace: 0.3, pregnancy: true, allergen: true })
    ],
    'Epices et chaudes': [
        makeOil('Cannelle ecorce', 'Cinnamomum verum', ['Tonique', 'Antiseptique', 'Rechauffant'], { maxFace: 0.1, pregnancy: false, allergen: true }),
        makeOil('Cannelle feuille', 'Cinnamomum verum leaf', ['Tonique', 'Antiseptique', 'Rechauffant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Clou de girofle', 'Syzygium aromaticum', ['Tonique', 'Antiseptique', 'Rechauffant'], { maxFace: 0.1, pregnancy: false, allergen: true }),
        makeOil('Muscade', 'Myristica fragrans', ['Tonique', 'Rechauffant', 'Stimulant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Cardamome', 'Elettaria cardamomum', ['Tonique', 'Rechauffant', 'Stimulant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Anis etoile', 'Illicium verum', ['Tonique', 'Rechauffant', 'Stimulant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Fenouil doux', 'Foeniculum vulgare', ['Tonique', 'Rechauffant', 'Stimulant'], { maxFace: 0.2, pregnancy: false, allergen: true }),
        makeOil('Curcuma', 'Curcuma longa', ['Tonique', 'Rechauffant', 'Antioxydant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Galanga', 'Alpinia galanga', ['Tonique', 'Rechauffant', 'Stimulant'], { maxFace: 0.3, pregnancy: false, allergen: true }),
        makeOil('Poivre rose', 'Schinus molle', ['Tonique', 'Rechauffant', 'Stimulant'], { maxFace: 0.3, pregnancy: false, allergen: true })
    ]
}
