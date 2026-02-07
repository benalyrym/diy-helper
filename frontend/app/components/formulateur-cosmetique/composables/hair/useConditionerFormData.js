import { reactive, computed } from 'vue'

export default function useConditionerFormData() {
  const formData = reactive({
    name: '',
    volume: 500,
    hairType: 'normaux',
    preservativeSystem: 'cosgard',
    cosgardPercent: 0.8,
    thickener: 'xanthane',
    thickenerPercent: 1.0,
    fragranceType: 'synthetic',
    fragranceIntensity: 2,
    fragranceNote: 'floral',
    selectedEssentialOils: []
  })

  // Profils de cheveux
  const hairProfiles = {
    fins: {
      oil: 5,
      maxActives: 3,
      viscosity: 'Fluide',
      description: 'Cheveux fins, manque de volume, alourdissement rapide',
      tips: [
        'Utilisez des huiles légères (jojoba, pépins de raisin)',
        'Évitez les formules trop riches et épaisses',
        'Privilégiez les actifs gainants légers',
        'Concentration en agents démêlants: 1-3%'
      ],
      color: '#8b5cf6'
    },
    normaux: {
      oil: 8,
      maxActives: 4,
      viscosity: 'Moyenne',
      description: 'Cheveux équilibrés, bonne tenue, brillance naturelle',
      tips: [
        'Équilibrez hydratation et nutrition',
        'Utilisez des huiles moyennement pénétrantes',
        'Agents démêlants: 2-4%',
        'Texture crème légère'
      ],
      color: '#10b981'
    },
    secs: {
      oil: 12,
      maxActives: 4,
      viscosity: 'Riche',
      description: 'Cheveux déshydratés, cassants, besoin en nutrition élevé',
      tips: [
        'Utilisez des huiles nourrissantes (avocat, amande douce)',
        'Intégrez des actifs réparateurs (kératine, protéines)',
        'Agents démêlants: 3-6%',
        'Texture riche et onctueuse'
      ],
      color: '#f59e0b'
    },
    gras: {
      oil: 3,
      maxActives: 2,
      viscosity: 'Très fluide',
      description: 'Cheveux à tendance grasse, racines luisantes',
      tips: [
        'Privilégiez les formules légères et astringentes',
        'Utilisez des huiles régulatrices (noisette, tea tree)',
        'Évitez les formules trop riches',
        'Agents démêlants: 1-2% maximum'
      ],
      color: '#3b82f6'
    },
    colorés: {
      oil: 6,
      maxActives: 3,
      viscosity: 'Moyenne',
      description: 'Cheveux traités, besoin en soin et protection de la couleur',
      tips: [
        'Utilisez des actifs protecteurs de couleur',
        'Évitez les sulfates et détergents agressifs',
        'pH légèrement acide (4.5-5.5)',
        'Intégrez des antioxydants'
      ],
      color: '#ec4899'
    }
  }

  const hairProfilesOptions = computed(() => {
    return Object.entries(hairProfiles).map(([key, value]) => ({
      value: key,
      label: key,
      icon: key === 'fins' ? '💨' :
        key === 'normaux' ? '🌟' :
          key === 'secs' ? '🔥' :
            key === 'gras' ? '💦' : '🎨',
      iconLabel: key === 'fins' ? 'Icône cheveux fins' :
        key === 'normaux' ? 'Icône cheveux normaux' :
          key === 'secs' ? 'Icône cheveux secs' :
            key === 'gras' ? 'Icône cheveux gras' :
              'Icône cheveux colorés',
      oil: value.oil,
      maxActives: value.maxActives,
      viscosity: value.viscosity,
      description: value.description,
      color: value.color,
      tips: value.tips
    }))
  })

  const selectedHairProfile = computed(() => {
    return hairProfilesOptions.value.find(p => p.value === formData.hairType)
  })

  // Actifs capillaires
  const actives = reactive([
    {
      key: 'keratine',
      label: 'Kératine hydrolysée',
      min: 0.5,
      max: 3,
      percent: 1.5,
      enabled: false,
      inci: 'Hydrolyzed Keratin',
      type: 'reparateur',
      description: 'Reconstruit la structure capillaire, répare les pointes fourchues',
      stability: 'pH 4-7',
      compatibility: ['Protéines', 'B5'],
      restrictions: 'Ne pas chauffer au-dessus de 40°C'
    },
    {
      key: 'b5',
      label: 'Panthénol (B5)',
      min: 0.5,
      max: 5,
      percent: 2,
      enabled: false,
      inci: 'Panthenol',
      type: 'hydratant',
      description: 'Humectant, augmente l\'élasticité des cheveux',
      stability: 'stable',
      compatibility: ['Kératine', 'Bétaine'],
      restrictions: 'Aucune connue'
    },
    {
      key: 'betaine',
      label: 'Bétaïne',
      min: 1,
      max: 5,
      percent: 3,
      enabled: false,
      inci: 'Betaine',
      type: 'hydratant',
      description: 'Hydratant puissant, antistatique naturel',
      stability: 'stable',
      compatibility: ['B5', 'Glycérine'],
      restrictions: 'Aucune connue'
    },
    {
      key: 'silk_protein',
      label: 'Protéine de soie',
      min: 0.1,
      max: 2,
      percent: 0.5,
      enabled: false,
      inci: 'Hydrolyzed Silk Protein',
      type: 'gainant',
      description: 'Gainant naturel, apporte brillance et douceur',
      stability: 'pH 4-8',
      compatibility: ['Kératine', 'B5'],
      restrictions: 'Ne pas utiliser avec fortes concentrations d\'acides'
    },
    {
      key: 'argan_oil',
      label: 'Huile d\'argan',
      min: 0.5,
      max: 3,
      percent: 1,
      enabled: false,
      inci: 'Argania Spinosa Kernel Oil',
      type: 'nutritif',
      description: 'Nourrit en profondeur, protège les pointes',
      stability: 'sensible à l\'oxydation',
      compatibility: ['Vitamine E', 'Autres huiles'],
      restrictions: 'Protéger de la lumière'
    }
  ])

  // Systèmes de conservation
  const preservativeSystems = [
    {
      id: 'cosgard',
      name: 'Cosgard',
      max: 1.0,
      description: 'Benzyl Alcohol, Dehydroacetic Acid - Large spectre',
      icon: '🛡️',
      iconLabel: 'Icône Cosgard conservateur large spectre',
      inci: 'Benzyl Alcohol, Dehydroacetic Acid',
      recommendation: '0.5-1.0%',
      features: [
        'Large spectre antibactérien',
        'pH stable 3-8',
        'Conforme UE 1223/2009',
        'Adapté aux émulsions'
      ]
    },
    {
      id: 'phenoxyethanol',
      name: 'Phénoxyéthanol',
      max: 1.0,
      description: 'Conservateur synthétique standard',
      icon: '⚗️',
      iconLabel: 'Icône conservateur synthétique',
      inci: 'Phenoxyethanol',
      recommendation: '0.5-1.0%',
      features: [
        'Efficacité prouvée',
        'Large spectre',
        'Stable à la chaleur',
        'Usage cosmétique établi'
      ]
    }
  ]

  // Phase aqueuse - Infusions capillaires
  const aqueousPhaseOptions = reactive({
    'Infusions fortifiantes': {
      icon: '💪',
      items: [
        {
          name: 'Ortie',
          description: 'Fortifiante, anti-chute',
          properties: ['Fortifiant', 'Antioxydant', 'Astringent'],
          percent: 20, min: 10, max: 50, selected: false
        },
        {
          name: 'Romarin',
          description: 'Stimulant la pousse, anti-pelliculaire',
          properties: ['Stimulant', 'Antiseptique', 'Circulatoire'],
          percent: 15, min: 5, max: 40, selected: false
        },
        {
          name: 'Sauge',
          description: 'Régulateur sébacé, anti-graisse',
          properties: ['Régulateur', 'Astringent', 'Antifongique'],
          percent: 10, min: 5, max: 30, selected: false
        }
      ]
    },
    'Infusions apaisantes': {
      icon: '💆',
      items: [
        {
          name: 'Camomille',
          description: 'Apaisant, éclaircissant naturel',
          properties: ['Apaisant', 'Éclaircissant', 'Anti-inflammatoire'],
          percent: 15, min: 5, max: 40, selected: false
        },
        {
          name: 'Calendula',
          description: 'Cicatrisant, apaisant cuir chevelu',
          properties: ['Cicatrisant', 'Apaisant', 'Anti-rougeurs'],
          percent: 20, min: 10, max: 50, selected: false
        }
      ]
    },
    'Infusions hydratantes': {
      icon: '💧',
      items: [
        {
          name: 'Aloe vera',
          description: 'Hydratant intense, apaisant',
          properties: ['Hydratant', 'Apaisant', 'Régénérant'],
          percent: 25, min: 10, max: 60, selected: false
        },
        {
          name: 'Bambou',
          description: 'Riche en silicium, fortifiant',
          properties: ['Fortifiant', 'Hydratant', 'Élastifiant'],
          percent: 15, min: 5, max: 40, selected: false
        }
      ]
    }
  })

  // Phase grasse - Huiles capillaires
  const oilPhaseOptions = reactive({
    'Huiles légères (pénétration rapide)': {
      icon: '⚡',
      items: [
        {
          name: 'Jojoba',
          description: 'Sébum-like, régulateur',
          properties: ['Régulateur', 'Non comédogène', 'Pénétrant'],
          specifics: ['Poids moléculaire léger'],
          penetration: 'légère', percent: 2, min: 0.5, max: 5, selected: false
        },
        {
          name: 'Pépins de raisin',
          description: 'Légère, antioxydante',
          properties: ['Antioxydant', 'Légère', 'Astringente'],
          specifics: ['Vitamine E naturelle'],
          penetration: 'légère', percent: 1.5, min: 0.5, max: 4, selected: false
        },
        {
          name: 'Noisette',
          description: 'Astringente, régulatrice sébacée',
          properties: ['Astringent', 'Régulateur', 'Raffermissant'],
          specifics: ['Acides gras essentiels'],
          penetration: 'légère', percent: 2, min: 0.5, max: 5, selected: false
        }
      ]
    },
    'Huiles nourrissantes': {
      icon: '🌰',
      items: [
        {
          name: 'Argan',
          description: 'Régénérante, protectrice',
          properties: ['Régénérant', 'Protecteur', 'Antioxydant'],
          specifics: ['Vitamine E', 'Squalène'],
          penetration: 'moyenne', percent: 3, min: 1, max: 6, selected: false
        },
        {
          name: 'Avocat',
          description: 'Nourrissante, réparatrice',
          properties: ['Nourrissant', 'Réparateur', 'Émollient'],
          specifics: ['Vitamines A,D,E'],
          penetration: 'moyenne', percent: 4, min: 1, max: 8, selected: false
        },
        {
          name: 'Macadamia',
          description: 'Riche en acide palmitoléique',
          properties: ['Nourrissant', 'Protecteur', 'Brillant'],
          specifics: ['Oméga-7'],
          penetration: 'moyenne', percent: 3, min: 1, max: 6, selected: false
        }
      ]
    },
    'Huiles gainantes': {
      icon: '✨',
      items: [
        {
          name: 'Brocoli',
          description: 'Gainant naturel, brillance',
          properties: ['Gainant', 'Brillant', 'Protecteur'],
          specifics: ['Acides gras insaturés'],
          penetration: 'faible', percent: 2, min: 0.5, max: 4, selected: false
        },
        {
          name: 'Camélia',
          description: 'Lissante, protectrice de la couleur',
          properties: ['Lissant', 'Protecteur', 'Brillant'],
          specifics: ['Oméga-9'],
          penetration: 'faible', percent: 3, min: 1, max: 6, selected: false
        }
      ]
    }
  })

  // Agents démêlants
  const conditioningAgents = reactive([
    {
      name: 'BTMS',
      description: 'Conditionneur cationique, démêlant puissant',
      properties: ['Démêlant', 'Adoucissant', 'Antistatique'],
      percent: 3, min: 1, max: 6, selected: false
    },
    {
      name: 'Cetyl Alcohol',
      description: 'Épaississant, conditionneur léger',
      properties: ['Épaississant', 'Émollient', 'Stabilisateur'],
      percent: 2, min: 0.5, max: 4, selected: false
    },
    {
      name: 'Behentrimonium Methosulfate',
      description: 'Conditionneur doux, bonne compatibilité',
      properties: ['Conditionneur', 'Démêlant', 'Adoucissant'],
      percent: 2.5, min: 1, max: 5, selected: false
    }
  ])

  // Épaississants naturels
  const thickeners = [
    {
      name: 'xanthane',
      description: 'Gomme naturelle, texture gel fluide',
      properties: ['Naturel', 'pH stable', 'Facile à utiliser'],
      min: 0.3, max: 2
    },
    {
      name: 'guar',
      description: 'Gomme de guar, texture crémeuse',
      properties: ['Naturel', 'Économique', 'Bon épaississant'],
      min: 0.5, max: 3
    },
    {
      name: 'carbomer',
      description: 'Synthétique, texture gel transparent',
      properties: ['Haute performance', 'Texture gel', 'Stable'],
      min: 0.1, max: 1
    }
  ]

  // Options de parfum
  const fragranceOptions = [
    { value: 'synthetic', label: 'Parfum synthétique', description: 'Stable, large choix de notes' },
    { value: 'essential_oils', label: 'Huiles essentielles', description: '100% naturel, propriétés additionnelles' },
    { value: 'none', label: 'Sans parfum', description: 'Pour peaux sensibles ou allergies' }
  ]

  // Notes de parfum
  const fragranceNotes = [
    { value: 'floral', label: 'Florale', examples: 'Rose, Jasmin, Lavande' },
    { value: 'fruity', label: 'Fruitée', examples: 'Pêche, Fraise, Agrumes' },
    { value: 'woody', label: 'Boisée', examples: 'Santal, Cèdre, Patchouli' },
    { value: 'fresh', label: 'Fraîche', examples: 'Menthe, Citron, Herbes' }
  ]

  // Huiles essentielles capillaires
  const hairEssentialOils = [
    {
      name: 'Lavande',
      latinName: 'Lavandula angustifolia',
      properties: ['Apaisant', 'Antiseptique', 'Équilibrant']
    },
    {
      name: 'Romarin',
      latinName: 'Rosmarinus officinalis',
      properties: ['Stimulant', 'Antipelliculaire', 'Fortifiant']
    },
    {
      name: 'Ylang-Ylang',
      latinName: 'Cananga odorata',
      properties: ['Équilibrant', 'Aphrodisiaque', 'Antistress']
    },
    {
      name: 'Cèdre',
      latinName: 'Cedrus atlantica',
      properties: ['Astringent', 'Antiseptique', 'Tonifiant']
    },
    {
      name: 'Tea Tree',
      latinName: 'Melaleuca alternifolia',
      properties: ['Antibactérien', 'Antifongique', 'Purifiant']
    },
    {
      name: 'Citron',
      latinName: 'Citrus limon',
      properties: ['Astringent', 'Purifiant', 'Éclaircissant']
    }
  ]

  const applyInitialData = (initialData = {}) => {
    if (!initialData || Object.keys(initialData).length === 0) return

    Object.assign(formData, {
      name: initialData.name || '',
      volume: initialData.volume || 500,
      hairType: initialData.hairType || 'normaux',
      preservativeSystem: initialData.preservativeSystem || 'cosgard',
      cosgardPercent: initialData.cosgardPercent || 0.8,
      thickener: initialData.thickener || 'xanthane',
      thickenerPercent: initialData.thickenerPercent || 1.0
    })
  }

  return {
    formData,
    hairProfiles,
    hairProfilesOptions,
    selectedHairProfile,
    actives,
    preservativeSystems,
    aqueousPhaseOptions,
    oilPhaseOptions,
    conditioningAgents,
    thickeners,
    fragranceOptions,
    fragranceNotes,
    hairEssentialOils,
    applyInitialData
  }
}
