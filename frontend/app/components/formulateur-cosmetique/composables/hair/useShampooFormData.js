import { ref, computed, watch } from 'vue'

export default function useShampooFormData() {
  // Données du formulaire avec valeurs par défaut sécurisées
  const formData = ref({
    name: '',
    description: '',
    volume: 250,
    hairType: '',
    preservativeSystem: '',
    cosgardPercent: 0.6,
    thickener: '',
    thickenerPercent: 0.5,
    phAdjuster: '',
    phAdjusterPercent: 0.1,
    fragranceType: 'essential_oils',
    fragranceIntensity: 'medium',
    fragranceNote: '',
    selectedEssentialOils: []
  })

  // pH cible calculé
  const targetPh = ref(5.5)
  const viscosityTarget = ref('medium') // low, medium, high

  // Profils capillaires
  const hairProfiles = {
    normal: {
      name: 'Normaux',
      description: 'Cheveux équilibrés',
      surfactant_min: 10,
      surfactant_max: 25,
      surfactant_ratio: 70,
      conditioning_min: 0.5,
      conditioning_max: 3,
      ph_min: 4.5,
      ph_max: 5.8,
      oil_tolerance: 'normal'
    },
    sec: {
      name: 'Secs',
      description: 'Cheveux secs et cassants',
      surfactant_min: 8,
      surfactant_max: 20,
      surfactant_ratio: 60,
      conditioning_min: 2,
      conditioning_max: 5,
      ph_min: 4.8,
      ph_max: 6.0,
      oil_tolerance: 'high'
    },
    gras: {
      name: 'Gras',
      description: 'Cheveux gras aux racines',
      surfactant_min: 15,
      surfactant_max: 30,
      surfactant_ratio: 80,
      conditioning_min: 0.2,
      conditioning_max: 2,
      ph_min: 4.2,
      ph_max: 5.5,
      oil_tolerance: 'low'
    },
    mixte: {
      name: 'Mixtes',
      description: 'Racines grasses, pointes sèches',
      surfactant_min: 12,
      surfactant_max: 25,
      surfactant_ratio: 75,
      conditioning_min: 1,
      conditioning_max: 3,
      ph_min: 4.5,
      ph_max: 5.8,
      oil_tolerance: 'medium'
    },
    fragile: {
      name: 'Fragilisés',
      description: 'Cheveux colorés, abîmés',
      surfactant_min: 8,
      surfactant_max: 18,
      surfactant_ratio: 65,
      conditioning_min: 2,
      conditioning_max: 6,
      ph_min: 4.8,
      ph_max: 6.0,
      oil_tolerance: 'high'
    },
    enfant: {
      name: 'Enfants',
      description: 'Doux pour les enfants',
      surfactant_min: 5,
      surfactant_max: 15,
      surfactant_ratio: 50,
      conditioning_min: 0.5,
      conditioning_max: 2,
      ph_min: 5.0,
      ph_max: 6.2,
      oil_tolerance: 'low'
    }
  }

  const hairProfilesOptions = computed(() => {
    return Object.entries(hairProfiles).map(([value, profile]) => ({
      value,
      label: profile.name,
      description: profile.description
    }))
  })

  const selectedHairProfile = computed(() => {
    return formData.value?.hairType ? hairProfiles[formData.value.hairType] : null
  })

  // Tensioactifs
  const surfactants = ref([
    {
      id: 'sci',
      name: 'SCI (Sodium Cocoyl Isethionate)',
      inci: 'Sodium Cocoyl Isethionate',
      type: 'primary',
      function: 'Surfactant',
      cas: '61789-32-0',
      min: 5,
      max: 30,
      default: 15,
      selected: false,
      percent: 15,
      mildness: 8,
      foam: 7,
      viscosity_contribution: 'medium'
    },
    {
      id: 'scs',
      name: 'SCS (Sodium Coco Sulfate)',
      inci: 'Sodium Coco-Sulfate',
      type: 'primary',
      function: 'Surfactant',
      cas: '97375-27-4',
      min: 5,
      max: 25,
      default: 12,
      selected: false,
      percent: 12,
      mildness: 5,
      foam: 9,
      viscosity_contribution: 'high'
    },
    {
      id: 'slsa',
      name: 'SLSA (Sodium Lauryl Sulfoacetate)',
      inci: 'Sodium Lauryl Sulfoacetate',
      type: 'primary',
      function: 'Surfactant',
      cas: '1847-58-1',
      min: 5,
      max: 25,
      default: 10,
      selected: false,
      percent: 10,
      mildness: 9,
      foam: 6,
      viscosity_contribution: 'low'
    },
    {
      id: 'c14-16',
      name: 'C14-16 Oléfine Sulfonate',
      inci: 'Sodium C14-16 Olefin Sulfonate',
      type: 'primary',
      function: 'Surfactant',
      cas: '68439-57-6',
      min: 5,
      max: 25,
      default: 12,
      selected: false,
      percent: 12,
      mildness: 6,
      foam: 8,
      viscosity_contribution: 'medium'
    },
    {
      id: 'decyl',
      name: 'Decyl Glucoside',
      inci: 'Decyl Glucoside',
      type: 'primary',
      function: 'Surfactant',
      cas: '58846-77-8',
      min: 5,
      max: 30,
      default: 15,
      selected: false,
      percent: 15,
      mildness: 9,
      foam: 5,
      viscosity_contribution: 'low'
    },
    {
      id: 'coco-glucoside',
      name: 'Coco Glucoside',
      inci: 'Coco-Glucoside',
      type: 'primary',
      function: 'Surfactant',
      cas: '141464-42-8',
      min: 5,
      max: 30,
      default: 15,
      selected: false,
      percent: 15,
      mildness: 9,
      foam: 5,
      viscosity_contribution: 'low'
    },
    {
      id: 'cocamidopropyl-betaine',
      name: 'Cocamidopropyl Betaine',
      inci: 'Cocamidopropyl Betaine',
      type: 'secondary',
      function: 'Surfactant / Viscosity Increasing Agent',
      cas: '61789-40-0',
      min: 2,
      max: 15,
      default: 5,
      selected: false,
      percent: 5,
      mildness: 8,
      foam: 6,
      viscosity_contribution: 'high'
    },
    {
      id: 'coco-betaine',
      name: 'Coco Betaine',
      inci: 'Coco-Betaine',
      type: 'secondary',
      function: 'Surfactant',
      cas: '68424-94-2',
      min: 2,
      max: 15,
      default: 5,
      selected: false,
      percent: 5,
      mildness: 8,
      foam: 6,
      viscosity_contribution: 'medium'
    },
    {
      id: 'cocamide-dea',
      name: 'Cocamide DEA',
      inci: 'Cocamide DEA',
      type: 'secondary',
      function: 'Viscosity Increasing Agent',
      cas: '68603-42-9',
      min: 1,
      max: 8,
      default: 3,
      selected: false,
      percent: 3,
      mildness: 5,
      foam: 5,
      viscosity_contribution: 'high',
      warning: 'Peut former des nitrosamines'
    },
    {
      id: 'cocamide-mea',
      name: 'Cocamide MEA',
      inci: 'Cocamide MEA',
      type: 'secondary',
      function: 'Viscosity Increasing Agent',
      cas: '68140-00-1',
      min: 1,
      max: 8,
      default: 3,
      selected: false,
      percent: 3,
      mildness: 5,
      foam: 5,
      viscosity_contribution: 'high'
    },
    {
      id: 'lauryl-glucoside',
      name: 'Lauryl Glucoside',
      inci: 'Lauryl Glucoside',
      type: 'secondary',
      function: 'Surfactant',
      cas: '110615-47-9',
      min: 2,
      max: 12,
      default: 4,
      selected: false,
      percent: 4,
      mildness: 9,
      foam: 4,
      viscosity_contribution: 'low'
    },
    {
      id: 'peg-7-glyceryl-cocoate',
      name: 'PEG-7 Glyceryl Cocoate',
      inci: 'PEG-7 Glyceryl Cocoate',
      type: 'secondary',
      function: 'Emollient / Surfactant',
      cas: '68201-46-7',
      min: 1,
      max: 5,
      default: 2,
      selected: false,
      percent: 2,
      mildness: 8,
      foam: 2,
      viscosity_contribution: 'low'
    }
  ])

  // Actifs capillaires
  const actives = ref([
    {
      id: 'keratine',
      label: 'Kératine hydrolysée',
      inci: 'Hydrolyzed Keratin',
      type: 'protéine',
      function: 'Hair Conditioning Agent',
      cas: '69430-36-0',
      min: 0.5,
      max: 5,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['sec', 'fragile', 'mixte'],
      description: 'Renforce et répare la fibre capillaire'
    },
    {
      id: 'soie',
      label: 'Protéines de soie hydrolysées',
      inci: 'Hydrolyzed Silk',
      type: 'protéine',
      function: 'Hair Conditioning Agent',
      cas: '96690-41-4',
      min: 0.5,
      max: 3,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['sec', 'fragile', 'normal'],
      description: 'Apporte douceur et brillance'
    },
    {
      id: 'ble',
      label: 'Protéines de blé hydrolysées',
      inci: 'Hydrolyzed Wheat Protein',
      type: 'protéine',
      function: 'Hair Conditioning Agent',
      cas: '100209-45-8',
      min: 0.5,
      max: 3,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['normal', 'sec', 'mixte'],
      description: 'Protège et fortifie'
    },
    {
      id: 'panthenol',
      label: 'Panthénol (Provitamine B5)',
      inci: 'Panthenol',
      type: 'vitamine',
      function: 'Hair Conditioning Agent',
      cas: '81-13-0',
      min: 0.5,
      max: 5,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['normal', 'sec', 'fragile', 'mixte'],
      description: 'Hydrate et apaise'
    },
    {
      id: 'niacinamide',
      label: 'Niacinamide (Vitamine B3)',
      inci: 'Niacinamide',
      type: 'vitamine',
      function: 'Skin Conditioning Agent',
      cas: '98-92-0',
      min: 0.5,
      max: 3,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['gras', 'mixte', 'normal'],
      description: 'Régule le sébum'
    },
    {
      id: 'cafeine',
      label: 'Caféine',
      inci: 'Caffeine',
      type: 'stimulant',
      function: 'Hair Conditioning Agent',
      cas: '58-08-2',
      min: 0.5,
      max: 2,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['gras', 'normal', 'fragile'],
      description: 'Stimule la microcirculation'
    },
    {
      id: 'biotine',
      label: 'Biotine (Vitamine B8)',
      inci: 'Biotin',
      type: 'vitamine',
      function: 'Hair Conditioning Agent',
      cas: '58-85-5',
      min: 0.1,
      max: 1,
      default: 0.3,
      enabled: false,
      percent: 0.3,
      hair_types: ['fragile', 'sec', 'normal'],
      description: 'Renforce la kératine'
    },
    {
      id: 'arginine',
      label: 'Arginine',
      inci: 'Arginine',
      type: 'acide aminé',
      function: 'Hair Conditioning Agent',
      cas: '74-79-3',
      min: 0.5,
      max: 3,
      default: 1,
      enabled: false,
      percent: 1,
      hair_types: ['sec', 'fragile', 'normal'],
      description: 'Répare et hydrate'
    },
    {
      id: 'zinc-pca',
      label: 'Zinc PCA',
      inci: 'Zinc PCA',
      type: 'minéral',
      function: 'Sebum Regulating Agent',
      cas: '15454-75-8',
      min: 0.2,
      max: 2,
      default: 0.5,
      enabled: false,
      percent: 0.5,
      hair_types: ['gras', 'mixte'],
      description: 'Régule l\'excès de sébum'
    },
    {
      id: 'piroctone-olamine',
      label: 'Piroctone Olamine',
      inci: 'Piroctone Olamine',
      type: 'anti-pelliculaire',
      function: 'Anti-dandruff Agent',
      cas: '68890-66-4',
      min: 0.1,
      max: 1,
      default: 0.3,
      enabled: false,
      percent: 0.3,
      hair_types: ['gras', 'normal'],
      description: 'Action anti-pelliculaire'
    },
    {
      id: 'climbazole',
      label: 'Climbazole',
      inci: 'Climbazole',
      type: 'anti-pelliculaire',
      function: 'Anti-dandruff Agent',
      cas: '38083-17-9',
      min: 0.2,
      max: 0.5,
      default: 0.3,
      enabled: false,
      percent: 0.3,
      hair_types: ['gras', 'normal'],
      description: 'Action anti-pelliculaire',
      warning: 'Concentration max 0.5%'
    },
    {
      id: 'extrait-ortie',
      label: 'Extrait d\'ortie',
      inci: 'Urtica Dioica (Nettle) Extract',
      type: 'extrait',
      function: 'Skin Conditioning Agent',
      cas: '84012-40-8',
      min: 0.5,
      max: 5,
      default: 2,
      enabled: false,
      percent: 2,
      hair_types: ['gras', 'mixte'],
      description: 'Purifie et régule'
    },
    {
      id: 'extrait-bouleau',
      label: 'Extrait de bouleau',
      inci: 'Betula Alba (Birch) Extract',
      type: 'extrait',
      function: 'Skin Conditioning Agent',
      cas: '85251-64-5',
      min: 0.5,
      max: 5,
      default: 2,
      enabled: false,
      percent: 2,
      hair_types: ['gras', 'normal'],
      description: 'Purifiant et astringent'
    },
    {
      id: 'extrait-romarin',
      label: 'Extrait de romarin',
      inci: 'Rosmarinus Officinalis (Rosemary) Extract',
      type: 'extrait',
      function: 'Skin Conditioning Agent',
      cas: '84604-14-8',
      min: 0.5,
      max: 5,
      default: 2,
      enabled: false,
      percent: 2,
      hair_types: ['gras', 'normal', 'sec'],
      description: 'Stimulant et antioxydant'
    }
  ])

  // Agents conditionneurs
  const conditioningAgents = ref([
    {
      id: 'btms-25',
      name: 'BTMS 25',
      inci: 'Behentrimonium Methosulfate (and) Cetearyl Alcohol',
      type: 'quat',
      function: 'Antistatic Agent / Hair Conditioning',
      min: 1,
      max: 8,
      default: 3,
      selected: false,
      percent: 3,
      description: 'Conditionneur cationique doux',
      compatibility: ['anionic', 'nonionic']
    },
    {
      id: 'btms-50',
      name: 'BTMS 50',
      inci: 'Behentrimonium Methosulfate (and) Cetearyl Alcohol',
      type: 'quat',
      function: 'Antistatic Agent / Hair Conditioning',
      min: 1,
      max: 8,
      default: 3,
      selected: false,
      percent: 3,
      description: 'Conditionneur plus concentré',
      compatibility: ['anionic', 'nonionic']
    },
    {
      id: 'cetrimonium-chloride',
      name: 'Cetrimonium Chloride',
      inci: 'Cetrimonium Chloride',
      type: 'quat',
      function: 'Antistatic Agent / Preservative',
      cas: '112-02-7',
      min: 0.5,
      max: 3,
      default: 1,
      selected: false,
      percent: 1,
      description: 'Conditionneur et conservateur léger',
      warning: 'Irritant à haute concentration'
    },
    {
      id: 'polyquaternium-7',
      name: 'Polyquaternium-7',
      inci: 'Polyquaternium-7',
      type: 'polymer',
      function: 'Antistatic Agent / Film Former',
      cas: '26590-05-6',
      min: 0.5,
      max: 3,
      default: 1,
      selected: false,
      percent: 1,
      description: 'Agent filmogène démêlant'
    },
    {
      id: 'polyquaternium-10',
      name: 'Polyquaternium-10',
      inci: 'Polyquaternium-10',
      type: 'polymer',
      function: 'Antistatic Agent / Film Former',
      cas: '81859-24-7',
      min: 0.2,
      max: 2,
      default: 0.5,
      selected: false,
      percent: 0.5,
      description: 'Conditionneur pour cheveux fins'
    },
    {
      id: 'guar-hydroxypropyl',
      name: 'Guar Hydroxypropyltrimonium Chloride',
      inci: 'Guar Hydroxypropyltrimonium Chloride',
      type: 'polymer',
      function: 'Antistatic Agent',
      cas: '65497-29-2',
      min: 0.2,
      max: 2,
      default: 0.5,
      selected: false,
      percent: 0.5,
      description: 'Conditionneur naturel'
    },
    {
      id: 'cetearyl-alcohol',
      name: 'Alcool cétéarylique',
      inci: 'Cetearyl Alcohol',
      type: 'fatty_alcohol',
      function: 'Emollient / Viscosity Increasing Agent',
      cas: '67762-27-0',
      min: 0.5,
      max: 5,
      default: 2,
      selected: false,
      percent: 2,
      description: 'Alcool gras émollient'
    },
    {
      id: 'behenyl-alcohol',
      name: 'Alcool béhénylique',
      inci: 'Behenyl Alcohol',
      type: 'fatty_alcohol',
      function: 'Emollient / Viscosity Increasing Agent',
      cas: '661-19-8',
      min: 0.5,
      max: 4,
      default: 1.5,
      selected: false,
      percent: 1.5,
      description: 'Alcool gras émollient'
    }
  ])

  // Épaississants
  const thickeners = ref([
    {
      id: 'xanthan',
      name: 'Gomme xanthane',
      inci: 'Xanthan Gum',
      function: 'Viscosity Increasing Agent',
      cas: '11138-66-2',
      min: 0.1,
      max: 2,
      default: 0.5,
      viscosity: 'high',
      ph_stability: [3, 11],
      temperature_stability: 'good'
    },
    {
      id: 'guar',
      name: 'Gomme de guar',
      inci: 'Guar Gum',
      function: 'Viscosity Increasing Agent',
      cas: '9000-30-0',
      min: 0.1,
      max: 2,
      default: 0.5,
      viscosity: 'medium',
      ph_stability: [4, 10],
      temperature_stability: 'medium'
    },
    {
      id: 'hydroxyethylcellulose',
      name: 'Hydroxyéthylcellulose',
      inci: 'Hydroxyethylcellulose',
      function: 'Viscosity Increasing Agent',
      cas: '9004-62-0',
      min: 0.2,
      max: 3,
      default: 1,
      viscosity: 'medium',
      ph_stability: [2, 12],
      temperature_stability: 'good'
    },
    {
      id: 'carbomer',
      name: 'Carbomer',
      inci: 'Carbomer',
      function: 'Viscosity Increasing Agent',
      cas: '9007-20-9',
      min: 0.1,
      max: 1,
      default: 0.3,
      viscosity: 'high',
      ph_stability: [5, 9],
      temperature_stability: 'medium',
      note: 'Nécessite neutralisation'
    },
    {
      id: 'nacl',
      name: 'Chlorure de sodium (sel)',
      inci: 'Sodium Chloride',
      function: 'Viscosity Increasing Agent',
      cas: '7647-14-5',
      min: 0.1,
      max: 2,
      default: 0.5,
      viscosity: 'medium',
      note: 'Augmente la viscosité des tensioactifs'
    }
  ])

  // Ajusteurs de pH
  const phAdjusters = ref([
    {
      id: 'citric-acid',
      name: 'Acide citrique',
      inci: 'Citric Acid',
      function: 'pH Adjuster',
      cas: '77-92-9',
      min: 0.01,
      max: 1,
      default: 0.1,
      type: 'acid',
      strength: 'medium'
    },
    {
      id: 'lactic-acid',
      name: 'Acide lactique',
      inci: 'Lactic Acid',
      function: 'pH Adjuster',
      cas: '50-21-5',
      min: 0.01,
      max: 1,
      default: 0.1,
      type: 'acid',
      strength: 'medium'
    },
    {
      id: 'sodium-hydroxide',
      name: 'Hydroxyde de sodium',
      inci: 'Sodium Hydroxide',
      function: 'pH Adjuster',
      cas: '1310-73-2',
      min: 0.01,
      max: 0.5,
      default: 0.05,
      type: 'base',
      strength: 'high',
      warning: 'Corrosif pur'
    },
    {
      id: 'sodium-bicarbonate',
      name: 'Bicarbonate de sodium',
      inci: 'Sodium Bicarbonate',
      function: 'pH Adjuster',
      cas: '144-55-8',
      min: 0.01,
      max: 1,
      default: 0.1,
      type: 'base',
      strength: 'low'
    }
  ])

  // Systèmes de conservation
  const preservativeSystems = ref([
    {
      id: 'cosgard',
      name: 'Cosgard',
      inci: 'Benzyl Alcohol (and) Salicylic Acid (and) Glycerin (and) Sorbic Acid',
      type: 'broad_spectrum',
      function: 'Preservative',
      cas: '100-51-6, 69-72-7, 56-81-5, 110-44-1',
      min: 0.5,
      max: 1.0,
      defaultPercent: 0.6,
      ph_range: [3, 6],
      water_soluble: true,
      notes: 'Spectre large, pH optimal < 5.5',
      allergens: ['Benzyl Alcohol']
    },
    {
      id: 'geogard-221',
      name: 'Geogard 221',
      inci: 'Dehydroacetic Acid (and) Benzyl Alcohol',
      type: 'broad_spectrum',
      function: 'Preservative',
      cas: '520-45-6, 100-51-6',
      min: 0.5,
      max: 1.0,
      defaultPercent: 0.6,
      ph_range: [3, 6],
      water_soluble: true,
      notes: 'Bon spectre, pH optimal < 6',
      allergens: ['Benzyl Alcohol']
    },
    {
      id: 'phenoxyethanol',
      name: 'Phénoxyéthanol',
      inci: 'Phenoxyethanol',
      type: 'broad_spectrum',
      function: 'Preservative',
      cas: '122-99-6',
      min: 0.5,
      max: 1.0,
      defaultPercent: 0.8,
      ph_range: [3, 8],
      water_soluble: 'partial',
      notes: 'Réglementé UE ≤ 1%',
      warning: 'Déconseillé pour bébés'
    },
    {
      id: 'potassium-sorbate',
      name: 'Sorbate de potassium',
      inci: 'Potassium Sorbate',
      type: 'mold_inhibitor',
      function: 'Preservative',
      cas: '590-00-1, 24634-61-5',
      min: 0.1,
      max: 0.6,
      defaultPercent: 0.3,
      ph_range: [3, 6],
      water_soluble: true,
      notes: 'Principalement anti-moisissures'
    },
    {
      id: 'sodium-benzoate',
      name: 'Benzoate de sodium',
      inci: 'Sodium Benzoate',
      type: 'mold_inhibitor',
      function: 'Preservative',
      cas: '532-32-1',
      min: 0.1,
      max: 0.5,
      defaultPercent: 0.3,
      ph_range: [2, 5],
      water_soluble: true,
      notes: 'Actif à pH < 5'
    },
    {
      id: 'leucidal-liquid',
      name: 'Leucidal Liquid',
      inci: 'Leuconostoc/Radish Root Ferment Filtrate',
      type: 'natural',
      function: 'Preservative',
      min: 2,
      max: 4,
      defaultPercent: 3,
      ph_range: [3, 8],
      water_soluble: true,
      notes: 'Conservateur naturel'
    },
    {
      id: 'preservative-system',
      name: 'Système complet (Cosgard + Geogard)',
      inci: 'Benzyl Alcohol, Dehydroacetic Acid, Salicylic Acid, Sorbic Acid',
      type: 'broad_spectrum',
      function: 'Preservative',
      min: 0.8,
      max: 1.2,
      defaultPercent: 1.0,
      ph_range: [3, 6],
      water_soluble: true,
      notes: 'Combinaison synergique'
    }
  ])

  // Options de parfum
  const fragranceOptions = [
    { value: 'essential_oils', label: 'Huiles essentielles' },
    { value: 'fragrance_oil', label: 'Parfum cosmétique' },
    { value: 'none', label: 'Non parfumé' }
  ]

  const fragranceNotes = [
    { value: 'citrus', label: 'Agrumes' },
    { value: 'floral', label: 'Floral' },
    { value: 'woody', label: 'Boisé' },
    { value: 'fresh', label: 'Frais' },
    { value: 'herbal', label: 'Herbacé' },
    { value: 'sweet', label: 'Sucré' },
    { value: 'spicy', label: 'Épicé' },
    { value: 'menthol', label: 'Mentholé' }
  ]

  // Huiles essentielles avec leurs allergènes
  const hairEssentialOils = ref([
    {
      id: 'lavande',
      name: 'Lavande',
      inci: 'Lavandula Angustifolia Oil',
      latinName: 'Lavandula angustifolia',
      properties: ['apaisant', 'réparateur'],
      hair_types: ['normal', 'sec', 'fragile'],
      max_percent: 1,
      default_percent: 0.5,
      allergens: ['Linalool', 'Geraniol', 'Limonene'],
      cas: '8000-28-0'
    },
    {
      id: 'tea-tree',
      name: 'Arbre à thé',
      inci: 'Melaleuca Alternifolia Oil',
      latinName: 'Melaleuca alternifolia',
      properties: ['purifiant', 'antipelliculaire'],
      hair_types: ['gras', 'mixte'],
      max_percent: 0.5,
      default_percent: 0.3,
      allergens: ['Limonene'],
      cas: '68647-73-4'
    },
    {
      id: 'romarin',
      name: 'Romarin',
      inci: 'Rosmarinus Officinalis Oil',
      latinName: 'Rosmarinus officinalis',
      properties: ['stimulant', 'fortifiant'],
      hair_types: ['gras', 'normal', 'fragile'],
      max_percent: 1,
      default_percent: 0.5,
      allergens: ['Limonene', 'Linalool'],
      cas: '8000-25-7'
    },
    {
      id: 'menthe-poivree',
      name: 'Menthe poivrée',
      inci: 'Mentha Piperita Oil',
      latinName: 'Mentha piperita',
      properties: ['rafraîchissant', 'stimulant'],
      hair_types: ['gras', 'normal'],
      max_percent: 0.5,
      default_percent: 0.3,
      allergens: ['Limonene'],
      cas: '8006-90-4'
    },
    {
      id: 'ylang-ylang',
      name: 'Ylang-Ylang',
      inci: 'Cananga Odorata Oil',
      latinName: 'Cananga odorata',
      properties: ['nourrissant', 'brillant'],
      hair_types: ['sec', 'fragile'],
      max_percent: 0.5,
      default_percent: 0.3,
      allergens: ['Benzyl Benzoate', 'Geraniol', 'Linalool'],
      cas: '8006-81-3'
    },
    {
      id: 'citron',
      name: 'Citron',
      inci: 'Citrus Limon Oil',
      latinName: 'Citrus limon',
      properties: ['purifiant', 'éclaircissant'],
      hair_types: ['gras', 'mixte'],
      max_percent: 0.5,
      default_percent: 0.3,
      allergens: ['Limonene', 'Citral'],
      cas: '8008-56-8',
      warning: 'Photosensibilisant'
    },
    {
      id: 'cèdre',
      name: 'Cèdre',
      inci: 'Cedrus Atlantica Oil',
      latinName: 'Cedrus atlantica',
      properties: ['fortifiant', 'antipelliculaire'],
      hair_types: ['gras', 'normal', 'fragile'],
      max_percent: 1,
      default_percent: 0.5,
      allergens: ['Limonene'],
      cas: '8023-85-6'
    },
    {
      id: 'géranium',
      name: 'Géranium',
      inci: 'Pelargonium Graveolens Oil',
      latinName: 'Pelargonium graveolens',
      properties: ['équilibrant', 'réparateur'],
      hair_types: ['sec', 'normal', 'mixte'],
      max_percent: 0.5,
      default_percent: 0.3,
      allergens: ['Citronellol', 'Geraniol', 'Linalool'],
      cas: '8000-46-2'
    }
  ])

  // Méthodes
  const applyInitialData = (data) => {
    if (!data) return

    // Informations de base - avec vérifications de sécurité
    if (data.name !== undefined) formData.value.name = data.name
    if (data.description !== undefined) formData.value.description = data.description
    if (data.volume !== undefined) formData.value.volume = data.volume
    if (data.hairType !== undefined) formData.value.hairType = data.hairType

    // Conservation
    if (data.preservativeSystem !== undefined) formData.value.preservativeSystem = data.preservativeSystem
    if (data.cosgardPercent !== undefined) formData.value.cosgardPercent = data.cosgardPercent

    // Texturisants
    if (data.thickener !== undefined) formData.value.thickener = data.thickener
    if (data.thickenerPercent !== undefined) formData.value.thickenerPercent = data.thickenerPercent
    if (data.phAdjuster !== undefined) formData.value.phAdjuster = data.phAdjuster
    if (data.phAdjusterPercent !== undefined) formData.value.phAdjusterPercent = data.phAdjusterPercent

    // Parfum
    if (data.fragranceType !== undefined) formData.value.fragranceType = data.fragranceType
    if (data.fragranceIntensity !== undefined) formData.value.fragranceIntensity = data.fragranceIntensity
    if (data.fragranceNote !== undefined) formData.value.fragranceNote = data.fragranceNote

    // Charger les ingrédients sélectionnés
    if (data.surfactants && Array.isArray(data.surfactants)) {
      data.surfactants.forEach(s => {
        const surfactant = surfactants.value.find(sur => sur.id === s.id)
        if (surfactant) {
          surfactant.selected = true
          if (s.percent !== undefined) surfactant.percent = s.percent
        }
      })
    }

    if (data.actives && Array.isArray(data.actives)) {
      data.actives.forEach(a => {
        const active = actives.value.find(act => act.id === a.id)
        if (active) {
          active.enabled = true
          if (a.percent !== undefined) active.percent = a.percent
        }
      })
    }

    if (data.conditioningAgents && Array.isArray(data.conditioningAgents)) {
      data.conditioningAgents.forEach(ca => {
        const agent = conditioningAgents.value.find(cond => cond.id === ca.id)
        if (agent) {
          agent.selected = true
          if (ca.percent !== undefined) agent.percent = ca.percent
        }
      })
    }

    if (data.selectedEssentialOils && Array.isArray(data.selectedEssentialOils)) {
      formData.value.selectedEssentialOils = data.selectedEssentialOils
    }

    // pH cible
    if (data.targetPh !== undefined) targetPh.value = data.targetPh
  }

  // Watchers
  watch(() => formData.value?.hairType, (newType) => {
    if (newType && hairProfiles[newType]) {
      const profile = hairProfiles[newType]
      targetPh.value = (profile.ph_min + profile.ph_max) / 2
    }
  })

  return {
    formData,
    hairProfiles,
    hairProfilesOptions,
    selectedHairProfile,
    surfactants,
    actives,
    conditioningAgents,
    thickeners,
    phAdjusters,
    preservativeSystems,
    fragranceOptions,
    fragranceNotes,
    hairEssentialOils,
    targetPh,
    viscosityTarget,
    applyInitialData
  }
}