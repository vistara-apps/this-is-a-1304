export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

export const stateRights = {
  'California': {
    overview: 'California has strong protections for individual rights during police encounters.',
    specificRights: [
      'Right to remain silent during questioning',
      'Right to refuse consent to searches without a warrant',
      'Right to record police interactions in public spaces',
      'Right to an attorney during custodial interrogation'
    ],
    trafficStops: {
      requirements: 'Provide license, registration, and insurance when requested',
      searchRights: 'Police need probable cause to search your vehicle without consent',
      passengerRights: 'Passengers may remain silent and ask if they are free to leave'
    }
  },
  'Texas': {
    overview: 'Texas follows federal constitutional protections with some state-specific provisions.',
    specificRights: [
      'Right to remain silent',
      'Right to refuse searches without probable cause',
      'Right to record police in public areas',
      'Right to know why you are being detained'
    ],
    trafficStops: {
      requirements: 'Must provide driver\'s license, registration, and insurance',
      searchRights: 'Consent is not required for vehicle searches with probable cause',
      passengerRights: 'Passengers may be required to identify themselves if detained'
    }
  },
  'Florida': {
    overview: 'Florida law provides constitutional protections during police encounters.',
    specificRights: [
      'Right to remain silent',
      'Right to an attorney',
      'Right to refuse consent to searches',
      'Right to record police interactions'
    ],
    trafficStops: {
      requirements: 'Driver must provide license, registration, and insurance',
      searchRights: 'Police need warrant, consent, or exigent circumstances',
      passengerRights: 'Passengers are not required to provide identification'
    }
  },
  'New York': {
    overview: 'New York provides strong constitutional protections and has specific laws about police interactions.',
    specificRights: [
      'Right to remain silent',
      'Right to refuse searches without a warrant',
      'Right to record police in public',
      'Right to ask if you are free to leave'
    ],
    trafficStops: {
      requirements: 'Must provide driver\'s license, registration, and insurance',
      searchRights: 'Vehicle searches require warrant, consent, or probable cause',
      passengerRights: 'Passengers may remain silent and are not required to show ID'
    }
  }
}

// Add default rights for states not specifically defined
US_STATES.forEach(state => {
  if (!stateRights[state]) {
    stateRights[state] = {
      overview: `${state} follows federal constitutional protections during police encounters.`,
      specificRights: [
        'Right to remain silent under the Fifth Amendment',
        'Right to an attorney under the Sixth Amendment',
        'Right to refuse consent to searches under the Fourth Amendment',
        'Right to record police interactions in public spaces'
      ],
      trafficStops: {
        requirements: 'Driver must provide license, registration, and insurance when requested',
        searchRights: 'Police need warrant, consent, or probable cause to search',
        passengerRights: 'Passengers have the right to remain silent'
      }
    }
  }
})

export const scriptScenarios = [
  {
    title: 'Basic Traffic Stop Response',
    scenario: 'When pulled over during a routine traffic stop',
    category: 'traffic',
    language: 'en',
    premium: false,
    content: '"Officer, I understand you have pulled me over. I am going to reach for my license, registration, and insurance now. I am exercising my right to remain silent beyond providing these documents. I do not consent to any searches of my vehicle."'
  },
  {
    title: 'Respuesta Básica en Parada de Tráfico',
    scenario: 'Cuando te detienen en una parada de tráfico de rutina',
    category: 'traffic',
    language: 'es',
    premium: false,
    content: '"Oficial, entiendo que me ha detenido. Voy a buscar mi licencia, registro y seguro ahora. Estoy ejerciendo mi derecho a permanecer en silencio más allá de proporcionar estos documentos. No consiento ningún registro de mi vehículo."'
  },
  {
    title: 'Refusing Vehicle Search',
    scenario: 'When an officer asks to search your vehicle',
    category: 'search',
    language: 'en',
    premium: true,
    content: '"Officer, I respectfully exercise my Fourth Amendment right and do not consent to any search of my vehicle, my person, or my belongings. I understand you may have the authority to search anyway, but I want to be clear that I do not consent. Am I free to go?"'
  },
  {
    title: 'Negarse al Registro del Vehículo',
    scenario: 'Cuando un oficial pide registrar tu vehículo',
    category: 'search',
    language: 'es',
    premium: true,
    content: '"Oficial, respetuosamente ejerzo mi derecho de la Cuarta Enmienda y no consiento ningún registro de mi vehículo, mi persona o mis pertenencias. Entiendo que usted puede tener la autoridad para registrar de todos modos, pero quiero dejar claro que no consiento. ¿Soy libre de irme?"'
  },
  {
    title: 'During Arrest Situation',
    scenario: 'If you are being placed under arrest',
    category: 'arrest',
    language: 'en',
    premium: true,
    content: '"I am exercising my right to remain silent. I want to speak to an attorney immediately. I do not consent to any searches. I am not resisting arrest. Please treat me with respect and dignity."'
  },
  {
    title: 'Durante Situación de Arresto',
    scenario: 'Si estás siendo arrestado',
    category: 'arrest',
    language: 'es',
    premium: true,
    content: '"Estoy ejerciendo mi derecho a permanecer en silencio. Quiero hablar con un abogado inmediatamente. No consiento ningún registro. No me estoy resistiendo al arresto. Por favor, tráteme con respeto y dignidad."'
  },
  {
    title: 'General Police Interaction',
    scenario: 'For general encounters with law enforcement',
    category: 'general',
    language: 'en',
    premium: false,
    content: '"Hello officer. I want to exercise my right to remain silent. Am I being detained or am I free to go? I do not consent to any searches. I want to speak to an attorney if I am being detained."'
  },
  {
    title: 'Interacción General con Policía',
    scenario: 'Para encuentros generales con las fuerzas del orden',
    category: 'general',
    language: 'es',
    premium: false,
    content: '"Hola oficial. Quiero ejercer mi derecho a permanecer en silencio. ¿Estoy siendo detenido o soy libre de irme? No consiento ningún registro. Quiero hablar con un abogado si estoy siendo detenido."'
  },
  {
    title: 'Recording Notification',
    scenario: 'When you want to inform the officer you are recording',
    category: 'general',
    language: 'en',
    premium: true,
    content: '"Officer, I want to inform you that I am recording this interaction for my safety and yours. I have the right to record in public spaces. I am not interfering with your duties and will comply with lawful orders."'
  },
  {
    title: 'Notificación de Grabación',
    scenario: 'Cuando quieres informar al oficial que estás grabando',
    category: 'general',
    language: 'es',
    premium: true,
    content: '"Oficial, quiero informarle que estoy grabando esta interacción por mi seguridad y la suya. Tengo el derecho de grabar en espacios públicos. No estoy interfiriendo con sus deberes y cumpliré con las órdenes legales."'
  }
]