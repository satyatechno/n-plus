import Config from 'react-native-config';

import { screenNames } from '@src/navigation/screenNames';

/**
 * Audio Player Analytics Constants
 */
export const AUDIO_PLAYER_ORGANISM = 'Audio bar';

/**
 * Analytics Constants
 * Centralized mapping for organisms and molecules used in analytics events
 * Organized by screen for better structure and maintainability
 * This file should be extended as new events and components are added
 */

/**
 * Organisms mapping
 * Organized by screen (StoryPage, LiveBlog, Onboarding, etc.)
 */
export const ANALYTICS_ORGANISMS = {
  STORY_PAGE: {
    CATEGORY_SLIDER: 'Header',
    INSIDE_NOTE: 'inside_note',
    BODY: 'Body',
    AUTHOR_CARD: 'Author card',
    TOP_NAVIGATION_BAR: {
      BUTTON_BACK: 'Button back',
      BUTTON_SHARE: 'Button Share',
      BUTTON_BOOKMARK: 'Button Bookmark',
      BUTTON_SIZE_TIPOGRAPHY: 'Button Size tipography'
    },
    MORE_FROM_AUTHOR: 'More from the author',
    NEWS_CARD: 'News card',
    PILL_GROUP: 'Tematicas relacionadas > categories_slider',
    RECOMMENDED_STORIES: 'Historias recomendadas',
    LATEST_NEWS: 'Ultimas noticias > video_carousel',
    BOTTOM_NAVIGATION_BAR: 'Bottomnav_final',
    RELACIONADO: 'Relacionado',
    HERO: 'Hero'
  },
  AUTHOR_BIO: {
    MAS_DEL_AUTOR: 'Mas del autor'
  },
  LIVE_BLOG: {
    BUTTON: 'Button',
    NOTIFICATION_BELL: 'Notification bell',
    BODY: 'Body',
    MODAL_NOTIFICATION_ON: 'Notification pop up | desactivar notificaciones',
    MODAL_NOTIFICATION_OFF: 'Notification pop up | recibir notificaciones',
    RECOMMENDED_STORIES: 'Historias recomendadas',
    HERO: 'Hero',
    CLOSED_LIVEBLOGS: 'Así te lo contamos',
    HERO_BODY: 'Hero | Body'
  },
  VIDEO: {
    HEADER: 'Header',
    CATEGORY_HEADER: 'Category Header',
    ANCHORS: 'Ancors',
    HIGHLIGHT_PROGRAM: 'Highlight Program',
    PROHRAMAS_DE: 'Programas de...'
  },
  PRODUCERS: {
    POR_EL_PLANETA: 'Por el planeta',
    HEADER: 'header_dark_theme',
    HERO: 'Hero',
    CONTINUE_WATCHING: 'Continúa viendo',
    ACTION_SHEET: 'Action sheet 3 dots',
    THE_MOST_SEEN_OF_THE_MONTH: 'Los Más Vistos del mes',
    ALL_THE_INVESTIGATION: 'Todos los documentales',
    ALL_DOCUMENTALES: 'Todos los documentales',
    POR_EL_PLANETA_DETAIL_PAGE: 'Por el planeta detail page',
    DOCUMENTAL_DESCRIPTION: 'Documental description',
    RECENTLY_ADDED: 'Agregados recientemente',
    ALL_DOCUMENTALS_POR_EL_PLANETA: 'All documentals por el planeta',
    INTERACTIVES: 'Interactives',
    BUTTON: 'Button'
  },
  ONBOARDING: {
    BUTTON: 'Button',
    BUTTON_ACTIONS: 'Button actions',
    NEXT: 'Next',
    VERIFIED_ACCOUNT: 'Verified account',
    REGISTRATION_DATA: 'Registration data',
    REGISTRATION_WITH_EMAIL: 'registration with email',
    REGISTRATION_WITH_SOCIAL_MEDIA: 'registration with social media',
    LOGIN_SOCIAL_MEDIA: 'Login social media',
    HEADER: 'Header',
    LEGALS: 'Legals',
    OTP: 'OTP',
    LOGIN_MAIL: 'Login mail',
    MAIL_REQUEST: 'Mail request',
    PASSWORD: 'Password',
    REGISTER_MODAL: 'Register modal'
  },
  MY_ACCOUNT: {
    DESUBSCRIBE: 'Mis suscripciones',
    SUBSCRIPTION: 'Suscripciones',
    BUTTON: 'Button',
    HEADER: 'Header',
    DELETE_CACHE: 'Uso de datos',
    HEADER_MY_ACCOUNT_MAIN: 'Header/My Account_main',
    CONTENT_CARD: 'Content card',
    MENU_3_DOTS: 'Menu 3 dots adjustment',
    ACTION_SHEET_MENU_DOTS: 'Action sheet - Menu 3 dots',
    DELETE_ACCOUNT: 'Delete account',
    MY_RECOMMENDATIONS_OPTIONS: 'My recommendations options',
    EDIT_INTEREST: 'Action_Button_Secondary | Ver más intereses',
    NOTIFICATION_LIST: 'Notification list',
    SEGMENTED_TABS: 'Segmented Tabs',
    CHECKBOX_OPTIONS: 'Checkbox options',
    TEXT_BOX: 'text box',
    CHIP_LIST: 'Chip list',
    OPTION_CHECK: 'Option Cheack',
    DELETE_ACCOUNT_BUTTON: 'Button_grey | Eliminar cuenta',
    INPUT_NUMBER: 'input Number',
    BUTTON_RESEND_CODE: 'Resend code',
    APPEARANCE_OF_THE_SYSTEM: 'Apariencia del sistema',
    TEXT_SIZE: 'Tamaño del texto',
    DATA_USAGE: 'Uso de datos',
    AUTOPLAY_VIDEOS: 'Reproducción automática de videos',
    MY_INTEREST: 'Mis intereses',
    INPUT_PASSWORD: 'Pass password',
    INPUT_NEW_PASSWORD: 'New password',
    INPUT_REPEAT_NEW_PASSWORD: 'Repeat new password',
    INPUT_NAME: 'Name',
    INPUT_LAST_NAME: 'Last name',
    INPUT_GENDER: 'Gender',
    INPUT_DATE_OF_BIRTH: 'Date of birth',
    CONFIGURATION: 'Configuration',
    USER_DATA: 'User data',
    APP: 'App',
    SOCIAL_MEDIA: 'Social media',
    LEGALS: 'Legals',
    ACTION_SHEET: 'Action sheet',
    HERO: 'Hero',
    OPINION: 'Opinión',
    PROGRAMAS: 'Programas',
    NOTICIAS: 'Noticias',
    LIVEBLOG: 'Liveblog',
    VIDEOS: 'Videos',
    PODCAST: 'Podcast'
  },
  SEARCH_LANDING_SCREEN: {
    POPULAR_SEARCH: 'Popular search',
    INTEREST: 'Interest',
    YOU_MIGHT_BE_INTERESTED_IN: 'You might be interested in',
    SEARCH_AUDIO: 'Search audio',
    CONTENT_TYPE: 'Category type'
  },
  HOME_HEADER_MENU: {
    MENU: 'Header>Menu'
  },
  AUDIO_PLAYER: 'Audio bar',
  SEARCH_AUTOCOMPLETE: 'Autocomplete',
  SEARCH_RESULTS: 'Result',
  VIDEOS: {
    HERO: 'Hero',
    EXCLUSIVO_N_PLUS: 'Exclusive N+ > Card',
    EXCLUSIVO: 'Exclusivo de N+',
    LATEST_NEWS: 'Latest news',
    N_PLUS_VIDEOS: 'Videos de N+',
    PROGRAMS: 'Programas',
    PROGRAMS_NPLUS: 'Programas N+',
    DETAIL_PROGRAM: 'Detail program',
    PROGRAM_INDEX_SECTION: 'Program Index Section',
    BOTTOM_NAVIGATION_BAR: 'Bottom navigation bar',
    BUTTON_BACK: 'Button back',
    BUTTON_SHARE: 'Button share',
    BUTTON_BOOKMARK: 'Button bookmark',
    MORE_FROM_AUTHOR: 'More from the author',
    NEWS_CARD: 'News card',
    CATEGORY_HEADER_01: 'Category Header 01',
    CATEGORY_HEADER_02: 'Category Header 02',
    CONTINUE_WATCHING: 'Continúa Viendo',
    ACTION_SHEET: 'Action sheet 3 dots',
    NPLUS_FOCUS: 'N+ Focus',
    POR_EL_PLANETA: 'Por el Planeta',
    EPISODES_CAROUSEL: 'Episodes',
    MAIN_CARD: 'Main card',
    START_TO_SEE: 'Start to see',
    BOOKMARK: 'Bookmark',
    INTERACTIVES: 'Interactivos',
    GO_BACK: 'Header',
    ALL_THE_INVESTIGATION: 'Todas las investigaciones',
    SHORT_REPORTS_VIDEOS: 'Reportajes en corto',
    N_PLUS_FOCUS: 'N+ Focus',
    HEADER_DARK_THEME: 'header_dark_theme',
    SHORT_REPORTS_POSTS: 'News_Section',
    PROGRAM_SELECCIONADO: 'Programa seleccionado',
    ACTION_SHEET_MODAL: 'Action sheet'
  },
  EPISODE_DETAIL_PAGE: {
    HEADER: 'Header',
    HERO: 'Hero',
    RELATED_CONTENT: 'Contenido relacionado'
  },
  MEDIA_PLAYER: 'Media Player',
  LIVE: {
    HEADER: 'Header',
    CHANNEL_LIST: 'Canales',
    CHANNEL_SCHEDULE: 'Channel Schedule',
    LIVEBLOGS: 'Liveblogs',
    BUTTON: 'Button',
    LIVE_PRINCIPAL: 'Live Principal',
    CLOSED_LIVEBLOGS: 'Así te lo contamos'
  },
  HOME_INVESTIGATION: {
    HEADER: 'header_dark_theme',
    INVESTIGATION: 'Investigation',
    BUTTON: 'Button'
  },
  HOME_SHORT_REPORTS: {
    HEADER: 'header_dark_theme',
    SHORT_REPORTS: 'Short Reports'
  },
  INTERACTIVE_INVESTIGATION: {
    HEADER: 'header_dark_theme',
    INTERACTIVES: 'Interactives'
  },
  INVESTIGATION_DETAIL: {
    HEADER: 'header_dark_theme'
  },
  SHORT_REPORTS: 'Reportajes en corto',
  INVESTIGATION_DESCRIPTION: {
    HERO: 'Hero',
    HEADER: 'Header',
    BUTTON_BACK: 'Button back',
    BOOKMARK: 'Bookmark',
    SHARE: 'Share',
    INTERACTIVE_INVESTIGATION: 'Button interactive investigation',
    SEE_ALL: 'Investigación por',
    SEE_MORE: 'See All'
  },
  RECENTLY_ADDED: 'Agregados recientemente',
  TOPIC: {
    HEADER: 'Header',
    HERO: 'Hero',
    PRIORITICED_NEWS: 'Prioriticed news',
    RELATED_TOPIC: 'Tematicas relacionadas > categories_slider',
    MORE_NEWS: 'Más noticias',
    BUTTON: 'Button'
  },
  CATEGORY: {
    HEADER: 'Header',
    HERO: 'Hero',
    PRIORITICED_NEWS: 'Prioriticed news',
    RELATED_TOPIC: 'Tematicas relacionadas > categories_slider',
    MORE_NEWS: 'Más noticias',
    BUTTON: 'Button'
  },
  PRESS_ROOM: {
    HEADER: 'Header',
    HERO: 'Hero',
    PRIORITICED_NEWS: 'Prioriticed news',
    BUTTON: 'Button'
  },
  HOME_PRIME_SECTION: {
    LIVE_STREAMING: 'Prime: Live Streaming player',
    BREAKING_NEWS: 'Prime: Breaking News  / Video On Demand / Day a day',
    LIVE_BLOG: 'Prime: Live Blog'
  },
  SHORT_INVESTIGATION_DETAIL_PAGE: {
    BOTTOM_NAVIGATION_BAR: 'bottom navigation bar',
    AUTHOR_INFO_BLOCK: 'author card',
    HERO_MEDIA_CAROUSEL: 'Hero',
    TOPIC_CHIPS: 'Tematicas relacionadas > categories_slider ',
    RECOMMENDED_REPORTS: 'Reportajes recomendados'
  },
  AUDIO: {
    INSIDE_NOTE: 'Inside note'
  },
  OPINION: {
    HEADER: 'Header',
    HERO: 'Hero',
    RECIENTES: 'Opiniones recientes',
    OTRAS_OPINIONES: 'Otras Opiniones',
    MÁS_OPINIONES: 'Más opiniones',
    MÁS_OPINIONES_DE: 'Más opiniones de...',
    BOTTOMNAV_FINAL: 'Bottomnav final',
    BOTTOMNAV_FINAL_TYPOGRAPHY: 'Bottomnav_final> Selection size typography',
    AUTHOR_CARD: 'Author card'
  },
  SEARCH: {
    SEARCH_HEADER: 'Search Header',
    SEARCH_BAR: 'Search bar',
    SEARCH_AUDIO_BAR: 'Search bar > Audio',
    BÚSQUEDAS_POPULARES: 'Búsquedas populares',
    INTERESES: 'Intereses',
    PODRÍA_INTERESARTE: 'Podría interesarte',
    SEARCH_AUDIO_HEADER: 'Search audio Header',
    FILTER_WITH_ICON: 'filter_with_icon',
    FILTER_WITH_ICON_Filters: 'filter_with_icon > recent search list'
  },
  HOME_PAGE: {
    SPECIAL_SECTION_ONE: 'Special Category 1 (Donald Trump)',
    SPECIAL_SECTION_THREE: 'Editorial decision section: Latest news // Our selection N+',
    SPECIAL_SECTION_FOUR: 'Special Category 2: N+ Local',
    SPECIAL_SECTION_FIVE: 'N+ Videos',
    SPECIAL_SECTION_SIX: 'Passion Products (Estilo de Vida)',
    SPECIAL_SECTION_SEVEN: 'Special Category 3: Informate +',
    OPINION_SECTION: 'Opinion',
    EXCLUSIVE: 'Exclusive N+',
    EXCLUSIVE_CARD: 'Exclusive N+ > Card',
    NPLUS_FOCUS: 'N+ Focus',
    PROGRAMAS: 'Programas'
  },
  BOTTOM_NAV: 'Bottom Nav'
} as const;

/**
 * Molecules mapping
 */
export const ANALYTICS_MOLECULES = {
  STORY_PAGE: {
    CATEGORY_SLIDER: {
      BASE_NAME: 'Menu | ' // Base name for category options, number is added dynamically
    },
    INSIDE_NOTE: {
      LISTEN_ARTICLE: 'Listen_article',
      PLAY_ARTICLE: 'Play Article'
    },
    AUTHOR_CARD: {
      BASE_NAME: 'Author | ' // Base name for author options, number is added dynamically
    },
    PILL_GROUP: {
      BASE_NAME: 'Pill | ' // Base name for pill options, number is added dynamically
    },
    RECOMMENDED_STORIES: {
      BASE_NAME: 'News_Card ', // Base name for recommended story cards, number is added dynamically
      BUTTON_BOOKMARK: 'Button_Bookmark' // Bookmark button molecule
    },
    LATEST_NEWS: {
      BASE_NAME: 'Card Style/2 | ' // Base name for latest news carousel items, number is added dynamically
    },
    BOTTOM_NAVIGATION_BAR: {
      BUTTON_BACK: 'Button back',
      BUTTON_SHARE: 'Button Share',
      BUTTON_BOOKMARK: 'Button Bookmark',
      BUTTON_SIZE_TIPOGRAPHY: 'Button Size tipography'
    },
    MORE_FROM_AUTHOR: 'More from the author',
    NEWS_CARD: 'News card',
    RELACIONADO: {
      BASE_NAME: 'Card Style/1 | '
    },
    HERO_MEDIA_CAROUSEL: {
      BASE_NAME: 'Storypage_News | ',
      MEDIA_PLAYER: 'Media player | '
    },
    TEXT_BLOCK: 'Text block',
    LINK_HYPERLINK: 'Bold Text + Regular Text with hyperlink'
  },
  AUTHOR_BIO: {
    NEWS_CARD: {
      BASE_NAME: 'News_Card | '
    }
  },
  LIVE_BLOG: {
    RECOMMENDED_STORIES: {
      BUTTON_BOOKMARK: 'Button_Bookmark'
    },
    BUTTON_BELL_NOTIFICATION: 'Button bell notification',
    BUTTON_ACCEPT_NOTIFICATION: 'Button_Light_Theme | Notíficame',
    BUTTON_REJECT_NOTIFICATION: 'Button_Light_Theme | No, gracias',
    BUTTON_UNSUBSCRIBE_NOTIFICATION: 'Button_Light_Theme | Desactivar',
    BUTTON_KEEP_ME_NOTIFIED: 'Button_Light_Theme | Notíficame',
    BUTTON_SEE_ALL_LIVE_NEWS: 'Button see all live news'
  },
  ONBOARDING: {
    GUEST_BUTTON: 'Button Guest',
    BUTTON_CONTINUE: 'Button_Light_Theme | Continuar cuenta verificada',
    LOGIN_BUTTON_CONTINUE: 'Button_Light_Theme | Continuar contrasena actualizada',
    CONTINUAR_INTEREES: 'Button_Light_Theme | Continuar intereses',
    BUTTON_LOGIN: 'Button_Light_Theme | Iniciar sesión',
    BUTTON_REGISTER: 'Button_Light_Theme | Regístrate',
    TERMINOS_Y_CONDICIONES: 'Hyperlink |Terminos y Condiciones',
    AVISO_DE_PRIVACIDAD: 'Hyperlink | Aviso de privacidad',
    BUTTON_REGISTER_MAIL: 'Button register mail',
    BUTTON_VERIFICATION_CODE: 'Button_Light_Theme | Verificar codigo',
    BUTTON_UPDATE_PASSWORD: 'Button update password',
    BUTTON_CREATE_ACCOUNT: 'Button create and account',
    BUTTON_SEND_CODE: 'Button_Light_Theme | Enviar codigo',
    BUTTON_LOGIN_FACEBOOK: 'Button login facebook',
    BUTTON_TERMS_CONDITIONS: 'Button terms and conditions',
    BUTTON_PRIVACY_NOTICE: 'Button privacy notice',
    BUTTON_BACK: 'Button back',
    SOCIAL_MEDIA_BUTTON: 'Social_Media_Button',
    INPUT_EMAIL: 'input email',
    INPUT_PASSWORD: 'input password',
    INPUT_CONFIRM_PASSWORD: 'input confirm password',
    ICON_SEE_PASSWORD: 'Icon see password',
    INPUT_OTP: 'input OTP',
    BUTTON_FORGOT_PASSWORD: 'Button forgot password',
    BUTTON_TIMER: 'Button resend code',
    BUTTON_CONTINUE_INICIAR_SESION: 'Button_Light_Theme | Continuar Iniciar sesion',
    BUTTON_CONTINUE_CREAR_CUENTA: 'Button_Light_Theme | Continuar crear cuenta',
    CONTINUAR: 'Continuar',
    BUTTON_LOGIN_APPLE: 'Button login apple',
    BUTTON_REGISTER_APPLE: 'Button register apple',
    BUTTON_LOGIN_GOOGLE: 'Button login google',
    BUTTON_REGISTER_GOOGLE: 'Button register google',
    BUTTON_REGISTER_FACEBOOK: 'Button register facebook',
    BUTTON_CREAR_CUENTA: 'Button_Light_Theme | Crear cuenta',
    CREAR_CUENTA: 'Crear cuenta',
    VERIFICAR_CODIGO: 'Verificar código',
    RESEND_LINK: 'resend link',
    RESEND: 'resend'
  },
  MY_ACCOUNT: {
    PILL: (number: number): string => `Pill ${number}`,
    BUTTON_SAVED: 'Button_Light_Theme | Guardar',
    ACTUALIZAR_BUTTON: 'Button_Light_Theme | Guardar',
    BUTTON_CHANGED_PASSWORD: 'Button_Light_Theme | Cambiar contraseña',
    BUTTON_LOG_OUT: 'Button_Light_Theme | Cerrar sesión',
    BUTTON_DELETE: 'Action_Button_Secondary | Borrar caché',
    BUTTON_LOG_IN: 'Log in',
    BUTTON_REGISTER: 'Register',
    BUTTON_VERIFY_CODE: 'Button_Light_Theme | Verificar código',
    BUTTON_FINALIZED: 'Button_Light_Theme | Finalizar',
    BUTTON_SUBSCRIBE: 'Button_Light_Theme | Suscríbete',
    CONTENT_CARD: 'Content card',
    NEWS_CARD: 'News card',
    NEWS_CARD_PRINCIPAL: 'News card principal',
    LIVEBLOG_CARD: 'Liveblog card',
    OPINION_CARD: 'Opinión card',
    VIDEO_CARD: 'Video card',
    CHIP_OF_INTEREST: 'Chip of interest',
    BUTTON_CONTINUE: 'Button_Light_Theme | Cotninuar',
    BUTTON_SKIP: 'Button_Light_Theme | Salir',
    BUTTON_EXIT: 'Button exit',
    NOTIFICATION_CARD: 'Notification card',
    CHECK_BOX: 'Check box',
    DELETE_NOTIFICATION: 'Delete notification',
    BUTTON_UNSUBSCRIBE: 'Button_Light_Theme | Desuscribirse',
    BUTTON_UNSUBSCRIBE_ALL: 'Button_Light_Theme | Desuscribirse de todo',
    BUTTON_SEND_COMMENTS: 'Button_Light_Theme | Enviar comentarios',
    ELIMINATE_NOTIFICATION: 'Option | Eliminar notificaciones',
    BUTTON_ELIMINATE_NOTIFICATION: 'Button_grey | Eliminar notificación',
    MARK_AS_READ: 'Option | Marcar como leído',
    DELETE_ACCOUNT: 'Button_TextOnly/Normal | Eliminar cuenta',
    CLOSE: 'Close',
    SEE_UNREAD: 'Option | Ver no leídas',
    ELIMINATE_ALL_NOTIFICATIONS: 'Option | Eliminar todas las notificaciones',
    MANAGE_NOTIFICATIONS: 'Option | Administrar notificaciones',
    NOTIFICATION_LIST: 'Notification list',
    SEGMENTED_TABS: 'Segmented Tabs',
    NEWSLETTER_CARD: 'Newsletter card',
    LEGALS: 'Legals',
    INPUT: 'Input',
    CHECKBOX_OPTIONS: 'Checkbox options',
    TEXT_BOX: 'Text box',
    BOOKMARK_VIDEO: 'Video',
    BOOKMARK_NEWS: 'News_Section',
    BOOKMARK_LIVEBLOG: 'Liveblog',
    BOOKMARK_TALENT: 'Talent',
    BOOKMARK_PROGRAMS: 'Programs',
    BOOKMARK_PRESS_ROOM: 'Opinion news card ',
    BOOKMARK_PODCAST: 'Podcast',
    BOOKMARK_MAPS: 'Maps',
    BOOKMARK_AUTHORS: 'Authors',
    CHIP_LIST: 'Chip list',
    BACK: 'Back',
    VIEW_MORE_INTEREST: 'View more interest',
    VIEW_LESS_INTEREST: 'Action_Button_Secondary | Ver menos intereses',
    SETTINGS: 'settings',
    MENU_3_DOTS: '3 dots',
    SUBSCRIPTION: 'Newsletter | Mis suscripciones',
    MY_SUBSCRIPTIONS: 'Newsletter | Suscripciones',
    OTHER_REASON: 'Other reason',
    BUTTON_RESEND_CODE: 'Resend code',
    INPUT_NUMBER: 'Number',
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM_APPEARANCE: 'system appearance',
    SYSTEM_SIZE: 'Toggle',
    SMALL: 'small',
    MEDIUM: 'Medium',
    BIG: 'Big',
    DELETE_CACHE: 'delete cache',
    DOWNLOAD_IMAGES: 'Toggle',
    CANCEL: 'Cancel',
    CANCELAR: 'Button_Light_Theme | Cancelar',
    DELETE: 'Delete',
    EXIT: 'Exit',
    ALWAYS: 'Always',
    ONLY_WIFI: 'Only Wi-Fi',
    NEVER: 'Never',
    MANAGE: 'Action_Button_Secondary | Administrar',
    PASS_PASSWORD: 'Pass password',
    NEW_PASSWORD: 'New password',
    REPEAT_NEW_PASSWORD: 'Repeat new password',
    NAME: 'Name',
    LAST_NAME: 'Last name',
    GENDER: 'Gender',
    DATE_OF_BIRTH: 'Date of birth',
    CONFIGURATION: 'Configuration',
    UPDATE_PROFILE: 'Update profile',
    CHANGED_PASSWORD: 'Changed password',
    BOOKMARKS: 'Bookmarks',
    MY_ACCOUNT_NOTIFICATIONS_CONFIGURATION: 'My account Notifications configuration',
    RECOMENDATION_FOR_YOU: 'Recomendation for you',
    NEWSLETTER: 'Newsletter',
    SHARE_THIS_APP: 'Share this app',
    RATE_THIS_APP: 'Rate this app',
    SUPPORT: 'Support',
    FOLLOW_FACEBOOK: 'Follow Facebook',
    FOLLOW_X: 'Follow X',
    FOLLOW_INSTAGRAM: 'Follow Instagram',
    FOLLOW_TIK_TOK: 'Follow Tik tok',
    FOLLOW_YOUTUBE: 'Follow Youtube',
    FOLLOW_THREADS: 'Follow Threads',
    RIGHT_OF_REPLY: 'Right of reply',
    TERMS_AND_CONDITION: 'Terms and condition',
    PRIVACY_NOTICE: 'Privacy notice',
    LOG_OUT: 'Log out',
    CLOSE_BUTTON: 'Button_Light_Theme | No, gracias'
  },
  HOME_HEADER_MENU: {
    CATEGORY_OR_TOPIC: 'category or topic',
    NEXT_ICON: 'Next Icon'
  },
  SEARCH_LANDING_SCREEN: {
    POPULAR_SEARCH: {
      BASE_NAME: 'Carousel popular search '
    },
    INTEREST: {
      BASE_NAME: 'Category Pill '
    },
    YOU_MIGHT_BE_INTERESTED_IN: {
      BASE_NAME: 'News card '
    },
    SEARCH_AUDIO: 'Search bar > Audio',
    CATEGORY_PILL: 'Category Pill',
    MICROPHONE_RED: 'microphone red'
  },
  AUDIO_PLAYER: {
    PLAY_PAUSE_BUTTON: 'Play/Pause button',
    CLOSE_BUTTON: 'Close button',
    PLAYBACK_SPEED: 'Playback speed',
    REWIND_BUTTON: 'Rewind 5 seconds button',
    AUDIO_BAR: 'Audio bar',
    INFO_ICON: 'Info icon (i)',
    PROGRESS_BAR: 'Progress bar'
  },
  SEARCH_AUTOCOMPLETE: {
    SEARCHER_FIND: 'Searcher find'
  },
  SEARCH_RESULTS: {
    VIDEO: 'Video - News card Listing',
    NOTICIAS: 'Noticias - News card Listing',
    LIVEBLOG: 'Liveblog - News card Listing',
    PROGRAMAS: 'Programas - News card Listing',
    SALA_DE_PRENSA: 'Sala de prensa - News card Listing',
    PODCAST: 'Podcast - News card Listing',
    MAPS: 'Maps - News card Listing',
    AUTORES: 'Autores - News card Listing',
    BUTTON: 'Filter',
    BOOKMARK: 'Pill | Video',
    RELEVANCE_FILTER: 'Relevance filter',
    MOST_RECENT: 'Most recent'
  },
  VIDEOS: {
    CARD: 'Card',
    VIDEOS: 'videos',
    MEDIA_PLAYER: 'Media player',
    CARD_STYLE: 'card style 1',
    CARD_STYLE_2: 'Card Style/2',
    VIDEO_CARD: 'Video Card',
    BUTTON: 'Button',
    CTA_ALL_EPISODES: 'Action_Button_Primary |  Ver todos los programas',
    PROGRAM_CTA_ALL_EPISODES: 'Action_Button_Primary | Todos los episodios',
    CTA_SECTION: 'Action_Button_Primary | Todos los programas',
    CAROUSEL: 'Carousel',
    HOST_PROFILE: 'Host Profile',
    EXCLUSIVO_N_PLUS: 'Exclusivo de N+',
    PRINCIPAL_VIDEO: 'Video card',
    SEE_LAST_EPISODE: 'Button_Light_Theme | Ver el último episodio',
    // Programs section molecules
    PROGRAMS_CTA_SECTION: 'CTA section',
    PROGRAM_INDEX_SECTION: 'Program Index Section',
    // Continue watching molecules
    CONTINUE_WATCHING_CARD_1: 'Continue watching card 1',
    CONTINUE_WATCHING_CARD: 'Video Card',
    CONTINUE_WATCHING_CARD_2: 'Continue watching card 2',
    CONTINUE_WATCHING_3_DOTS: 'Continue watching 3 dots',
    CONTINUE_WATCHING_3_DOTS_BOOKMARK: 'Menu/option | Saved',
    CONTINUE_WATCHING_3_DOTS_UNBOOKMARK: 'Menu/option | Unsaved',
    CONTINUE_WATCHING_3_DOTS_SHARE: 'Menu/option | Compartir',
    CONTINUE_WATCHING_3_DOTS_REMOVE_FROM_LIST: 'Menu/option | Remover de mi lista',
    CONTINUE_WATCHING_3_DOTS_CLOSED: 'Dismiss Button',
    // N+ Focus molecules
    N_PLUS_FOCUS_HERO: 'Principal card productoras',
    N_PLUS_FOCUS_HERO_START_TO_SEE: 'Button_Dark_theme | Comenzar a ver',
    N_PLUS_FOCUS_HERO_BOOKMARK: 'Bookmark',
    N_PLUS_FOCUS_CTA_SECTION: 'Action_Button_Dark_Theme | Ver más',
    PRINCIPAL_INTERACTIVE_CARD: 'Interactive Card',
    INTERACTIVE_CONTENT_CARD: 'Interactive card > Button_Dark_theme | Ver interactivo',
    // Por el Planeta molecules
    POR_EL_PLANETA_CTA_SECTION: 'Por el Planeta CTA section',
    // Investigations molecules
    INVESTIGATION_CARD_X5: 'Investigation card x5',
    SHORT_NOTES_X3: 'Card Style/1',
    POST_SHORTS_NOTES_X3: 'News_Section',
    RELATED_NOTES_X3: 'News Section',
    BUTTON_SEE_ALL_INVESTIGATION: 'Action_Button_Dark_Theme | Explora N+ Focus',
    BUTTON_SEE_ALL_SHORT_REPORTS: 'Action_Button_Dark_Theme | Ver documentales',
    CATEGORY: 'Category',
    SEE_ALL_INVESTIGATION: 'Action_Button_Dark_Theme | Ver investigaciones',
    ELIMINAR: 'Button_Light_Theme | Eliminar',
    CANCEL: 'Button_Light_Theme | Cancelar',
    SEE_ALL_SHORT_REPORTS: 'Action_Button_Dark_Theme | Ver más'
  },
  EPISODE_DETAIL_PAGE: {
    HEADER: {
      BUTTON_BACK: 'Button back',
      SEARCH: 'Search'
    },
    DETAIL_VIDEO: {
      BOOKMARK: 'Bookmark',
      SHARE: 'Share'
    },
    RELATED_CONTENT: {
      EPISODE_CARD: 'Card Style/1',
      CTA_MORE_OF_THE_PROGRAM: 'Action_Button_Dark_Theme | Ver más del programa'
    }
  },
  PRODUCTION: {
    START_TO_SEE: 'Button_Dark_theme | Comenzar a ver',
    BOOKMARK: 'Bookmark',
    CARD_OF_VIDEO: 'Video Card |',
    THREE_DOTS: '3 dots',
    THREE_DOTS_BOOKMARK: 'Menu/option | Saved',
    THREE_DOTS_UNBOOKMARK: 'Menu/option | Unsaved',
    THREE_DOTS_SHARE: 'Menu/option | Compartir',
    THREE_DOTS_REMOVED: 'Menu/option | Remover de mi lista',
    THREE_DOTS_CLOSED: 'Dismiss Button',
    INTERACTIVE_CONTENT_CARD: 'Video Card |',
    INVESTIGATION_CARD: 'Video Card |',
    BUTTON_SEE_ALL: 'Action_Button_Dark_Theme | Ver documentales',
    BUTTON_BACK: 'Button back',
    BUTTON_INTERACTIVE_INVESTIGATION: 'Button interactive investigation',
    SHARE: 'Share',
    SAVED: 'Saved',
    SEARCH: 'Search',
    DOCUMENTAL_CONTENT_CARD: 'Documental content card',
    SEE_MORE: 'See more'
  },
  HOME_INVESTIGATION: {
    HEADER: {
      BUTTON_BACK: 'Button back',
      SEARCH: 'Search'
    },
    INVESTIGATION: {
      INVESTIGATION_CARD: 'Video Card'
    },
    BUTTON: {
      SEE_MORE: 'Action_Button_Dark_Theme | Ver más'
    }
  },
  HOME_SHORT_REPORTS: {
    HEADER: {
      BUTTON_BACK: 'Button back',
      SEARCH: 'Search'
    },
    SHORT_REPORTS: {
      BOOKMARK: 'Bookmark',
      SHORT_NOTES_CARD: 'Card Style/1',
      SHORT_NOTES_NEWS: 'News_Card'
    }
  },
  INTERACTIVE_INVESTIGATION: {
    HEADER: {
      BUTTON_BACK: 'Button back',
      SEARCH: 'Search'
    },
    INTERACTIVES: {
      INTERACTIVE_CONTENT_CARD: 'Interactive Card'
    }
  },
  INVESTIGATION_DESCRIPTION: {
    HEADER: 'Header',
    BUTTON_BACK: 'Button back',
    BOOKMARK: 'Bookmark',
    SHARE: 'Share',
    INTERACTIVE_INVESTIGATION: 'Button_Dark_theme | Ver investigación interactiva',
    CREW: 'Crew',
    SEE_MORE: 'Action_Button_Dark_Theme | Ver más',
    SEE_LESS: 'See less'
  },
  SHORT_REPORTS: {
    SHORT_NOTES: 'Card Style/1',
    RELATED_NOTES: 'News_Card',
    BUTTON_SEE_ALL: 'Action_Button_Dark_Theme | Ver todos'
  },
  SHORT_INVESTIGATION_DETAIL_PAGE: {
    BOTTOM_NAVIGATION_BAR: {
      BUTTON_BACK: 'Button back',
      BUTTON_SHARE: 'Button share',
      BUTTON_BOOKMARK: 'Button bookmark'
    },
    AUTHOR_INFO_BLOCK: {
      BASE_NAME: 'Author Name Text' // Base name for author options, number is added dynamically
    },
    HERO_MEDIA_CAROUSEL: {
      BASE_NAME: 'Storypage_News' // Base name for carousel images, number is added dynamically
    },
    TOPIC_CHIPS: {
      BASE_NAME: 'Pill' // Base name for topic pills, number is added dynamically
    },
    RECOMMENDED_REPORTS: {
      CARD_STYLE_1: 'Card Style/1',
      NEWS_CARD: 'News_Card',
      BOOKMARK: 'Bookmark',
      UNBOOKMARK: 'Unbookmark',
      TAP_IN_TEXT: 'Tap in text'
    }
  },
  RECENTLY_ADDED: 'Video Card',
  MEDIA_PLAYER: {
    MEDIA_PLAYER: 'Media player',
    PLAY_PAUSE_BUTTON: 'Play/Pause',
    SOUND_BUTTON: 'Sound',
    CLOSED_CAPTIONS: 'Closed Captions',
    AIRPLAY: 'Airplay',
    CAST: 'Cast',
    PIP: 'PiP',
    FULL_SCREEN: 'Full Screen',
    PROGRESS_BAR: 'Progress bar',
    SPEED_CONTROL: 'Speed Control',
    VIDEO_LOAD: 'video_load',
    VIDEO_START: 'video_start',
    VIDEO_25_PERCENT: 'video_25_percent',
    VIDEO_50_PERCENT: 'video_50_percent',
    VIDEO_75_PERCENT: 'video_75_percent',
    VIDEO_COMPLETE: 'video_complete'
  },
  LIVE: {
    BUTTON_BACK: 'Button back',
    SHARE: 'Share',
    ALL_LIVEBLOGS_ON: 'Action_Button_Primary | Ver noticias en vivo',
    MORE_LIVEBLOGS_OFF: 'Action_Button_Primary | Ver más liveblogs',
    CHANNEL_PRIMARY_HEADER: 'Primary Header/Light Theme'
  },
  TOPIC: {
    BACK: 'Back',
    PRINCIPAL_NEWS: 'Hero card or Hero card liveblog | 1',
    SECONDARY_NEWS: 'Card style |',
    PILL: 'Pill |',
    MORE_NEWS: 'Card style  or Card liveblog |',
    SEE_MORE: 'Action_Button_Primary | Ver más'
  },
  CATEGORY: {
    BACK: 'Back',
    PRINCIPAL_NEWS: 'Hero card or Hero card liveblog | 1',
    SECONDARY_NEWS: 'Card style |',
    PILL: 'Pill |',
    MORE_NEWS: 'Card style  or Card liveblog |',
    SEE_MORE: 'Action_Button_Primary | Ver más'
  },
  PRESS_ROOM: {
    BACK: 'Back',
    PRINCIPAL_NEWS: 'Breaking News IMG',
    SECONDARY_NEWS: 'Card style |',
    SEE_MORE: 'Action_Button_Primary | Ver más'
  },
  HOME_PRIME_SECTION: {
    BUTTON_LIVE: 'Button Live',
    PRINCIPA_NEWS: 'News Card Principal',
    NEWS_CARD: 'News card',
    MASTER_LIVEBLOG: 'Master Liveblog'
  },
  OPINION: {
    SEARCH: 'search',
    FULL_NEWS: 'Full News',
    OPINION_NEWS_CARD: 'Opinion news card',
    RECENT_OPINIONS: 'Recent Op..',
    OPINION_NEWS_CARD_NO_LIMIT: 'Opinion news card',
    FONT_SIZE_SELECTOR: 'Font size selector',
    AUTHOR_NAME: 'Author Name Text'
  },
  SEARCH: {
    BACK: 'Back',
    SEARCH_BAR: 'Search bar',
    AUDIO: 'Audio',
    CLOSE: 'Close',
    NEWS_CARD: 'News card',
    PILL: 'Pill',
    CAROUSEL_CARD: 'Carousel_card',
    IC_VOICE_SEARCH_CTA: 'ic_voice_search_cta',
    SEARCH_AUDIO_BAR: 'Search bar > Audio',
    FILTER_WITH_ICON: 'filter_with_icon',
    RECIENTE: 'Selection | Más reciente',
    RELEVANCIA: 'Selection | Más reciente',
    CARD_STYLE: 'Card Style',
    BOOKMARK: 'Bookmark',
    UNBOOKMARK: 'Unbookmark',
    TAP_IN_TEXT: 'Tap in text',
    NEWS_SECTION: 'News_Section',
    LIVE_BLOG: 'Live Blog',
    TALENT: 'Talent',
    VIDEO_CARD: 'Video card',
    OPINION_NEWS_CARD: 'Opinion card'
  },
  HOME_PAGE: {
    NEWS_PRINICPAL_CARD: 'News Card Principal',
    NEWS_CARD: 'News_card',
    CAROUSEL: 'Carousel',
    CARD: 'Card',
    CARD_STYLE_3: 'card_style_3',
    SECONDARY_CARD: 'Card Style/1',
    PRINCIPAL_CARD: 'Video Card',
    CARAOUSEL_VIDEOS: 'video_crousel > Card Style/2',
    PASSION_PRODUCTS: 'Crousel Card',
    ACTION_BUTTON: 'Action_Button_Dark_Theme | Ver Más',
    ACTION_BUTTON_PRIMARY: 'Action_Button_Primary | Ver Más Videos',
    HERO_OPINION_CARD: 'Hero Opinion Card',
    OPINION_CAROUSEL_CARD: 'Recent Opinion',
    ACTION_BUTTON_OPINION: 'Action_Button_Dark_Theme | Más Opiniones',
    BUTTON_DARK_THEME_VER_INVESTIGACION: 'Button_Dark_theme | Ver Investigación',
    BUTTON_DARK_THEME_VER_INTERACTIVO: 'Button_Dark_theme | Ver Interactivo',
    ACTION_BUTTON_DARK_THEME_EXPLORA_NPLUS: 'Action_Button_Dark_Theme | Explora N+ Focus',
    CARD_STYLE_1_X1: 'Card Style/1',
    NEWS_SECTION_X1: 'News_Section',
    CATEGORY_X2: 'Category',
    VIDEO_CARD_X5: 'Video Card',
    ACTION_BUTTON_PRIMARY_MAS_PROGRAMAS: 'Action_Button_Primary | Más Programas'
  },
  BOTTOM_TAB: {
    HOME: 'Inicio',
    VIDEOS: 'Videos',
    OPINION: 'Opinión',
    MY_ACCOUNT: 'Mi cuenta'
  }
  // Add more screens here as events increase
} as const;

export const ANALYTICS_ATOMS = {
  TAP: 'Tap',
  BOOKMARK: 'Bookmark',
  UNBOOKMARK: 'Unbookmark',
  TAP_IN_TEXT: 'Tap in text',
  MENU: 'menu / mobile responsive',
  SEARCH: 'Search',
  PLAY: 'Play',
  PAUSE: 'Pause',
  SPEED_1X: 'speed_1x',
  SPEED_1_5X: 'speed_1_5x',
  SPEED_2X: 'speed_0_2x',
  SEEKED: 'seeked',
  NO_SOUND: 'no_sound',
  CLOSED_CAPTION: 'closed_caption',
  CAST: 'Cast',
  PIP: 'pip',
  FULLSCREEN: 'crop_free',
  LOAD: 'load',
  START: 'Start',
  PROGRESS: 'Progress',
  COMPLETE: 'Complete',
  IC_VOICE_SEARCH_CTA: 'ic_voice_search_cta',
  AUDIO_PLAY_MUTE: 'Audio Play | Mute',
  AUDIO_PLAY_PLAYING: 'Audio Play | Playing',
  REPLAY_5: 'Replay_5',
  PROGRESS_BAR: 'Progress bar',
  INFO: 'Info',
  CLOSE: 'Close',
  SWIPE_RIGHT: 'Swipe Right',
  TAP_AND_SWIPE_RIGHT: 'Tap and Swipe Right',
  DOWNLOAD_PDF: 'Download pdf',
  SHARE: 'share',
  ARROW_BACK: 'arrow_back',
  REGITER_GUESS_USER: 'register_guess_user',
  CONTINUAR_CREAR_CUENTA: 'Button_Light_Theme | Continuar crear cuenta',
  INICIA_SESION: 'text link | Inicia sesión',
  TERMINOS_Y_CONDICIONES: 'Hyperlink |Terminos y Condiciones',
  AVISO_DE_PRIVACIDAD: 'Hyperlink | Aviso de privacidad',
  REGISTER_STEP_5: 'registerStep_5',
  LOGIN_GOOGLE: 'login_google',
  REGISTER_GOOGLE: 'register_google',
  LOGIN_META: 'login_meta',
  REGISTER_META: 'register_meta',
  LOGIN_APPLE: 'login_apple',
  REGISTER_APPLE: 'register_apple',
  LINK_REENVIAR: 'link | reenviar',
  REGISTER_SUCCESSFULL: 'register_successfull',
  OLVIDASTE_TU_CONTRASENA: 'link | Olvidaste tu contraseña',
  LOGIN_SUCCESSFULL: 'login_successfull',
  BACK: 'back',
  MENU_3_DOTS: 'Menu 3 dots',
  NEWSLETTER_SUBSCRIBE: 'profile_newsletter_subscribe',
  MENU_DOTS: 'Menu',
  DISMISS_BUTTON: 'Dismiss Button',
  SETTINGS: 'settings',
  TEXT_INCREASE: 'text_increase',
  NOTIFICATION_STATE_SELECT: 'notifications > animated state | select',
  NOTIFICATION_STATE_UNSELECT: 'notifications > animated state | unselect',
  PROGRESS_25: 'Progress_25_percent',
  PROGRESS_50: 'Progress_50_percent',
  PROGRESS_75: 'Progress_75_percent'
} as const;

export const ANALYTICS_PAGE = {
  HOME_PAGE: 'Homepage',
  HOME_VIDEOS: 'Home Videos',
  DETAIL_PAGE: 'Detalle de video',
  OPINION_HOME: 'Home Opinión',
  STORYPAGE: 'Story page',
  STORYPAGE_OPINION: 'Story page Opinión',
  AUTHOR_BIO: 'Author bio',
  SEARCH: 'Search',
  SEARCH_AUDIO: 'Search audio',
  RESULTADOS_SEARCH: 'Resultados Search',
  SPLASH: 'Splash',
  LOGIN: 'Login',
  CREATE_ACCOUNT: 'Create account',
  ONBOARDING_LOGIN: 'Onboarding_Login',
  ONBOARDING_CREATE_ACCOUNT: 'Onboarding_Create account',
  CREATE_ACCOUNT_PASSWORD: 'Create account Password',
  CREATE_ACCOUNT_OTP_VERIFICATION: 'Create account OTP verification',
  CREATE_ACCOUNT_VERIFIED: 'Create account Verified',
  LOGIN_PASSWORD: 'Login Password',
  LOGIN_FORGOT_PASSWORD: 'Login Forgot Password',
  LOGIN_OTP_VERIFICATION: 'Login OTP verification',
  UPDATE_PASSWORD: 'Update password',
  HOME: 'Home',
  LIVEBLOGS: 'Liveblogs',
  LIVE_LIVEBLOGS: 'Liveliveblogs',
  CLOSED_LIVEBLOGS: 'Así te lo contamos',
  LIVEBLOG_NOTA: 'Liveblog nota',
  INVESTIGATION_HOME: 'Investigaciones home',
  SHORT_REPORTS: 'Reportajes en corto home',
  INVESTIGATION_DETAIL: 'Detalle de Investigaciones',
  LIVE: 'Live',
  CATEGORY_HOME: 'Categorías home',
  TOPIC_HOME: 'Temáticas home',
  PRESSROOM_HOME: 'Sala de prensa home',
  POR_EL_PLANETA_HOME: 'Por el planeta home',
  POR_EL_PLANETA_TODOS: 'Por el planeta, todos los documentales ',
  POR_EL_PLANETA_DETAILS: 'Por el planeta, detalle de video',
  MY_NOTIFICATION: 'Mis notificaciones',
  ACTUALIZAR_PERFIL: 'Actualizar perfil',
  CAMBIAR_CONTRASENA: 'Cambiar contraseña',
  CERRAR_SESION: 'Cerrar sesión',
  CONFIGURACION: 'Configuración',
  BORRAR_CACHE: 'Borrar caché',
  GUARDADOS: 'Guardados',
  RECOMENDADO_PARA_TI: 'Recomendado para ti',
  RECOMMENDATIONS: 'Recommendations',
  CONFIGURACION_DE_INTERESES: 'Configuración de intereses',
  PROGRAMAS_HOME: 'Programas home',
  PROGRAMAS_DETAIL: 'Detalle de programa',
  TODOS_IOS_EPISODIOS: 'Todos los episodios',
  DETALLE_DE_EPISODIO: 'Detalle de episodio',
  ELIMINAR_CUENTA: 'Eliminar cuenta',
  VALIDATE_OTP: 'Eliminar cuenta, confirmar otp',
  FINALIZED: 'Eliminar cuenta, finalizado',
  NEWSLETTER: 'Newsletter',
  INTERACTIVOS: 'Interactivos home',
  INVESTIGATION: 'Investigaciones home',
  MY_ACCOUNT_HOME: 'My account home'
} as const;

export const ANALYTICS_COLLECTION = {
  HOME_PAGE: 'Homepage',
  VIDEOS: 'Videos',
  OPINION: 'Opinión',
  STORYPAGE: 'Story page',
  AUTHOR_BIO: 'Author bio',
  SEARCH: 'Search',
  ONBOARDING: 'Onboarding',
  AUDIO_PLAYER: 'audio_player',
  ONBOARDING_CREATE_ACCOUNT: 'Onboarding_Create account',
  ONBOARDING_LOGIN: 'Onboarding_Login',
  ONBOARDING_CREATE_ACCOUNT_PASSWORD: 'Onboarding_Create account Password',
  LIVE_BLOGS: 'Liveblogs',
  DETAIL_PAGE: 'Detalle de video',
  NPLUS_FOCUS: 'N+ Focus',
  LIVEBLOGS: 'Liveblogs',
  LIVE: 'Live',
  CATEGORY: 'Categorías',
  TOPIC: 'Temáticas',
  PRESSROOM: 'Sala de prensa',
  PRODUCTORAS: 'Productoras',
  PROGRAMAS: 'Programas',
  MY_ACCOUNT: 'Mi cuenta',
  CLOSED_LIVEBLOGS: 'Así te lo contamos'
} as const;

export const SCREEN_PAGE_WEB_URL = {
  HOME_HEADER: 'Home Header',
  VIDEOS_LANDING_PAGE: 'Home Video',
  OPINION_HOME: 'Home Opinión',
  SEARCH: 'Search Landing page',
  SEARCH_AUDIO: 'Search audio',
  RESULTADOS_SEARCH: 'Resultados Search',
  NPLUS_FOCUS_LANDING_PAGE: 'N+ Focus Landing page',
  CATEGORY: 'Categorías home',
  TOPIC: 'Temáticas home',
  SALA_DE_PRENSA: 'Sala de prensa home',
  POR_EL_PLANETA_HOME: 'Por el planeta Home',
  POR_EL_PLANETA_DETAILS: 'Por el Planeta Details',
  POR_EL_PLANETA_DOCUMENTARIES: 'Por el planeta Documentaries',
  MY_NOTIFICATION: 'myAccount_myNotification',
  NEWSLETTER: 'Newsletter',
  MY_ACCOUNT_HOME: 'My account home',
  HOME_PAGE: 'Homepage',
  MI_CUENTA: 'Mi cuenta',
  LIVEBLOG: 'LiveBlog',
  LIVE_TV: 'LiveTV',
  CLOSED_LIVEBLOGS: 'Así te lo contamos'
} as const;

/** Molecule names for My Account home options - only molecule differs per option */
export const MY_ACCOUNT_OPTIONS_MOLECULES = {
  UPDATE_PROFILE: 'My Account>Options | Actualizar perfil',
  CHANGE_PASSWORD: 'My Account>Options | Cambiar contraseña',
  BOOKMARKS: 'My Account>Options | Guardados',
  MY_NOTIFICATION: 'My Account>Options | Mis notificaciones',
  RECOMMENDED_FOR_YOU: 'My Account>Options | Recomendado para ti',
  NEWSLETTER: 'My Account>Options | Newsletter',
  SHARE_APP: 'My Account>Options | Compartir app',
  RATE_APP: 'My Account>Options | Calificar app',
  SUPPORT: 'My Account>Options | Soporte',
  RIGHT_OF_REPLY: 'My Account>Options2 | Derechos de réplica',
  TERMS_AND_CONDITIONS: 'My Account>Options2 | Términos y condiciones',
  PRIVACY_POLICY: 'My Account>Options2 | Aviso de privacidad',
  LOGOUT: 'Button_Light_Theme | Cerrar sesión'
} as const;

/** Social media follow - molecule is 'Síguenos', atom is platform name */
export const MY_ACCOUNT_SOCIAL = {
  MOLECULE: 'Síguenos',
  ATOMS: {
    FACEBOOK: 'Facebook',
    X: 'X',
    INSTAGRAM: 'Instagram',
    TIKTOK: 'Tik tok',
    YOUTUBE: 'Youtube',
    THREADS: 'Threads'
  }
} as const;

export const ANALYTICS_ID_PAGE = {
  HOMEPAGE: 'homepage',
  OPINION_HOME: Config.OPINION_CATEGORY_ID,
  VIDEOS_LANDING: 'landing_videos',
  SEARCH: 'landing_search',
  SEARCH_AUDIO: 'search_audio',
  RESULTADOS_SEARCH: 'resultados_search',
  AUDIO_PLAYER: 'audio_player',
  NPLUS_FOCUS_LANDING: 'landing_nplus_focus',
  MY_NOTIFICATION: 'myAccount_myNotification',
  MY_ACCOUNT_HOME: 'My account home',
  MI_CUENTA: 'Mi cuenta',
  LIVEBLOG: 'LiveBlog',
  LIVEBLOGS: 'LiveBlogs',
  LIVE_TV: 'LiveTV',
  CLOSED_LIVEBLOGS: 'Así te lo contamos'
} as const;

export const ANALYTICS_META_EVENTS = {
  REGITER_GUESS_USER: 'register_guest_user',
  LOGIN_SUCCESSFULL: 'login_successfull',
  LEAD: 'Lead',
  LOGOUT_SUCCESSFULL: 'logout_successfull',
  INTERESTS_MODIFY: 'interests_modify',
  PROFILE_UPDATE: 'profile_update_successfull',
  PROFILE_CHANGE: 'profile_change_password',
  SUBSCRIBE: 'Subscribe',
  DELETE_ACCOUNT_SUCCESSFULL: 'profile_delete_account_successfull'
} as const;

export const ANALYTICS_PRODUCTION = {
  POR_EL_PLANETA: 'Por el Planeta'
} as const;

/**
 * Helper function to get molecule name for Category Slider based on index
 * @param index - Zero-based index of the category (0-9)
 * @returns Molecule name (Category_Option-1 to Category_Option-10)
 */
export const getCategorySliderMolecule = (index: number): string => {
  // Clamp index to valid range (0-9) and add 1 to convert to 1-based numbering
  const clampedIndex = Math.max(0, Math.min(index, 9));
  const optionNumber = clampedIndex + 1;
  return `${ANALYTICS_MOLECULES.STORY_PAGE.CATEGORY_SLIDER.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Author Card based on index and author name
 * @param index - Zero-based index of the author
 * @param authorName - Name of the author
 * @returns Molecule name (Author Name | X1, Author Name | X2, etc.)
 */
export const getAuthorCardMolecule = (index: number, authorName: string): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${authorName} | X${optionNumber}`;
};

/**
 * Helper function to get molecule name for Pill Group based on index
 * @param index - Zero-based index of the topic/pill
 * @returns Molecule name (Related_topic_Pill-1, Related_topic_Pill-2, etc.)
 */
export const getPillGroupMolecule = (index: number): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.STORY_PAGE.PILL_GROUP.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Recommended Stories based on index
 * @param index - Zero-based index of the recommended story card
 * @returns Molecule name (News_card-1, News_card-2, etc.)
 */
export const getRecommendedStoriesMolecule = (index: number): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.STORY_PAGE.RECOMMENDED_STORIES.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Latest News based on index
 * @param index - Zero-based index of the latest news carousel item
 * @returns Molecule name (Latest_news_carousel-1, Latest_news_carousel-2, etc.)
 */
export const getLatestNewsMolecule = (index: number): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.STORY_PAGE.LATEST_NEWS.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Relacionado based on index
 * @param index - Zero-based index of the related story item
 * @returns Molecule name (Card Style/1 | 1, Card Style/1 | 2, etc.)
 */
export const getRelacionadoMolecule = (index: number): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.STORY_PAGE.RELACIONADO.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Author Bio News Card based on index
 * @param index - Zero-based index of the article card
 * @returns Molecule name (News_Card | 1, News_Card | 2, etc.)
 */
export const getAuthorBioNewsCardMolecule = (index: number): string => {
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.AUTHOR_BIO.NEWS_CARD.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Popular Search based on index
 * @param index - Zero-based index of the carousel item
 * @returns Molecule name (Carousel popular search 1, Carousel popular search 2, etc.)
 */
export const getPopularSearchMolecule = (index: number): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.SEARCH_LANDING_SCREEN.POPULAR_SEARCH.BASE_NAME}${optionNumber}`;
};

/**
 * Helper function to get molecule name for Exclusive Carousel based on index
 * @param index - Zero-based index of exclusive carousel item (0-9)
 * @returns Molecule name (Carousel 1, Carousel 2, etc.)
 */
export const getExclusiveCarouselMolecule = (index: number): string => {
  // Clamp index between 0–4 (since we only have 5 constants)
  const clampedIndex = Math.max(0, Math.min(index, 4));

  const key = `CAROUSEL_${clampedIndex + 1}` as keyof typeof ANALYTICS_MOLECULES.VIDEOS;

  return ANALYTICS_MOLECULES.VIDEOS[key];
};

/**
 * Helper function to get molecule name for Latest News Carousel based on index
 * @param index - Zero-based index of latest news carousel item (0-9)
 * @returns Molecule name (Last news carousel 1, Last news carousel 2, etc.)
 */
export const getLatestNewsCarouselMolecule = (index: number): string => {
  // Clamp index between 0–9 (we have 10 constants)
  const clampedIndex = Math.max(0, Math.min(index, 9));

  const key = `LAST_NEWS_CAROUSEL_${clampedIndex + 1}` as keyof typeof ANALYTICS_MOLECULES.VIDEOS;

  return ANALYTICS_MOLECULES.VIDEOS[key];
};

/**
 * Helper function to get molecule name for N+Videos based on index
 * @param index - Zero-based index of N+Videos item (0-4)
 * @returns Molecule name (Principal Video, Secondary Video 1-4)
 */
export const getNPlusVideosMolecule = (index: number): string => {
  // Clamp between 0–3 since we have 4 secondary videos
  const clampedIndex = Math.max(0, Math.min(index, 3));

  return `${ANALYTICS_MOLECULES.VIDEOS.CARD_STYLE} | ${clampedIndex + 1}`;
};

export const getNPlusCarouselVideosMolecule = (index: number): string => {
  // Clamp between 0–3 since we have 4 secondary videos
  const clampedIndex = Math.max(0, Math.min(index, 3));

  return `${ANALYTICS_MOLECULES.VIDEOS.CARD_STYLE_2} | ${clampedIndex + 1}`;
};

/**
 * Helper function to get molecule name for Carousel based on index
 * @param index - Zero-based index of carousel item (0-4)
 * @returns Molecule name (Carousel 1-5)
 */
export const getCarouselMolecule = (index: number): string => {
  // Clamp index between 0–4
  const clampedIndex = Math.max(0, Math.min(index, 4));

  // Keys start from 1
  const key = `CAROUSEL_${clampedIndex + 1}` as keyof typeof ANALYTICS_MOLECULES.VIDEOS;

  return ANALYTICS_MOLECULES.VIDEOS[key];
};

/**
 * Helper function to get molecule name for Programs Channel Pill based on index
 * @param index - Zero-based index of the channel pill (0-2)
 * @returns Molecule name (Channel Pill 1, Channel Pill 2, Channel Pill 3)
 */
export const getProgramsChannelPillMolecule = (index: number): string => {
  // Clamp between 0–2 (3 pills total)
  const clampedIndex = Math.max(0, Math.min(index, 2));

  return `Category ${clampedIndex + 1}`;
};

/**
 * Helper function to get molecule name for Programs Carousel based on index
 * @param index - Zero-based index of the programs carousel item (0-9)
 * @returns Molecule name (Carousel 1, Carousel 2, etc.)
 */
export const getProgramsCarouselMolecule = (index: number): string => {
  // Clamp index between 0–4 (since we only have 5 constants)
  const clampedIndex = Math.max(0, Math.min(index, 4));

  // Convert to 1–5 since your keys start from 1
  const key = `PROGRAMS_CAROUSEL_${clampedIndex + 1}` as keyof typeof ANALYTICS_MOLECULES.VIDEOS;

  return ANALYTICS_MOLECULES.VIDEOS[key];
};

/**
 * Helper function to get molecule name for N+ Focus carousel based on index
 * @param index - Zero-based index of the N+ Focus carousel item (0-9)
 * @returns Molecule name (N+ Focus carousel 1, N+ Focus carousel 2, etc.)
 */
export const getNPlusFocusCarouselMolecule = (index: number): string => {
  const clampedIndex = Math.max(0, Math.min(index, 4));
  return `${ANALYTICS_MOLECULES.VIDEOS.VIDEO_CARD} | ${clampedIndex + 1}`;
};
/**
 * Helper function to get molecule name for Por el Planeta carousel based on index
 * @param index - Zero-based index of the Por el Planeta carousel item (0-9)
 * @returns Molecule name (Por el Planeta carousel 1, Por el Planeta carousel 2, etc.)
 */
export const getPorElPlanetaCarouselMolecule = (index: number): string => {
  // Add 1 to convert to 1-based numbering
  const optionNumber = index + 1;
  return `${ANALYTICS_MOLECULES.VIDEOS.VIDEO_CARD} | ${optionNumber}`;
};

export const getBottomTabAnalyticMolecule = (name: string) => {
  switch (name) {
    case screenNames.HOME:
      return ANALYTICS_MOLECULES.BOTTOM_TAB.HOME;
    case screenNames.VIDEOS:
      return ANALYTICS_MOLECULES.BOTTOM_TAB.VIDEOS;
    case screenNames.OPINION:
      return ANALYTICS_MOLECULES.BOTTOM_TAB.OPINION;
    case screenNames.MY_ACCOUNT:
      return ANALYTICS_MOLECULES.BOTTOM_TAB.MY_ACCOUNT;
    default:
      return '';
  }
};

export const getBottomTabAnalyticScreenPage = (activeTab: number) => {
  switch (activeTab) {
    case 0:
      return {
        idPage: ANALYTICS_ID_PAGE.HOMEPAGE,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.HOME_PAGE,
        screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`
      };
    case 1:
      return {
        idPage: ANALYTICS_ID_PAGE.VIDEOS_LANDING,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`
      };
    case 2:
      return {
        idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
        screen_name: ANALYTICS_COLLECTION.OPINION,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`
      };
    case 3:
      return {
        idPage: ANALYTICS_ID_PAGE.HOMEPAGE,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.HOME_PAGE,
        screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_ACCOUNT_HOME}`
      };
    default:
      return {};
  }
};

/**
 * Type exports for type safety
 */
export type AnalyticsOrganism = (typeof ANALYTICS_ORGANISMS)[keyof typeof ANALYTICS_ORGANISMS];
