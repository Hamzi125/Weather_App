// Sprache (Deutsch / Arabisch) und Einheiten (°C / °F)
import { computed, ref, watch } from 'vue';
import { load, save } from './utils/storage';

const messages = {
    de: {
        appName: 'Wetter App',
        searchPlaceholder: 'Stadt eingeben...',
        search: 'Suchen',
        myLocation: 'Mein Standort',
        emptyHint: 'Gib eine Stadt ein oder nutze 📍 für deinen Standort.',
        feelsLike: 'Gefühlt',
        humidity: 'Feuchte',
        wind: 'Wind',
        uv: 'UV-Index',
        uvLevels: ['Niedrig', 'Mäßig', 'Hoch', 'Sehr hoch', 'Extrem'],
        sunrise: 'Aufgang',
        sunset: 'Untergang',
        hourly: 'Stündlich',
        daily: 'Nächste 5 Tage',
        now: 'Jetzt',
        favorites: 'Favoriten',
        addFavorite: 'Zu Favoriten hinzufügen',
        removeFavorite: 'Aus Favoriten entfernen',
        close: 'Schließen',
        noResults: 'Keine Treffer',
        cityNotFound: 'Stadt „{name}“ nicht gefunden',
        networkError: 'Netzwerkfehler – bitte später erneut versuchen',
        geoUnsupported: 'Standortbestimmung wird nicht unterstützt',
        geoFailed: 'Standort konnte nicht ermittelt werden',
        switchUnit: 'Einheit wechseln',
        switchLang: 'Sprache wechseln',
        otherLang: 'العربية',
        kmh: 'km/h',
        dataBy: 'Wetterdaten:',
    },
    ar: {
        appName: 'تطبيق الطقس',
        searchPlaceholder: 'أدخل اسم المدينة...',
        search: 'بحث',
        myLocation: 'موقعي',
        emptyHint: 'ابحث عن مدينة أو استخدم 📍 لمعرفة طقس موقعك.',
        feelsLike: 'الإحساس',
        humidity: 'الرطوبة',
        wind: 'الرياح',
        uv: 'مؤشر UV',
        uvLevels: ['منخفض', 'متوسط', 'مرتفع', 'مرتفع جداً', 'شديد'],
        sunrise: 'الشروق',
        sunset: 'الغروب',
        hourly: 'كل ساعة',
        daily: 'الأيام الخمسة القادمة',
        now: 'الآن',
        favorites: 'المفضلة',
        addFavorite: 'إضافة إلى المفضلة',
        removeFavorite: 'إزالة من المفضلة',
        close: 'إغلاق',
        noResults: 'لا توجد نتائج',
        cityNotFound: 'لم يتم العثور على مدينة «{name}»',
        networkError: 'خطأ في الشبكة – حاول مرة أخرى لاحقاً',
        geoUnsupported: 'المتصفح لا يدعم تحديد الموقع',
        geoFailed: 'تعذّر تحديد موقعك',
        switchUnit: 'تغيير الوحدة',
        switchLang: 'تغيير اللغة',
        otherLang: 'Deutsch',
        kmh: 'كم/س',
        dataBy: 'بيانات الطقس من',
    },
};

const detectLang = () => ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'de');
const storedLang = load('weatherapp:lang', null);

export const lang = ref(messages[storedLang] ? storedLang : detectLang());
export const unit = ref(load('weatherapp:unit', 'C') === 'F' ? 'F' : 'C');

// Lateinische Ziffern auch im Arabischen, damit Zahlen einheitlich aussehen
export const locale = computed(() => (lang.value === 'ar' ? 'ar-u-nu-latn' : 'de-DE'));

export const t = (key, params = {}) => {
    const msg = messages[lang.value][key] ?? messages.de[key] ?? key;
    return typeof msg === 'string' ? msg.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '') : msg;
};

export const toggleLang = () => (lang.value = lang.value === 'de' ? 'ar' : 'de');
export const toggleUnit = () => (unit.value = unit.value === 'C' ? 'F' : 'C');

export const formatTemp = (celsius) => `${Math.round(unit.value === 'F' ? celsius * 9 / 5 + 32 : celsius)}°`;
export const formatWind = (kmh) =>
    unit.value === 'F' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} ${t('kmh')}`;

watch(
    lang,
    (value) => {
        save('weatherapp:lang', value);
        document.documentElement.lang = value;
        document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
        document.title = messages[value].appName;
    },
    { immediate: true }
);
watch(unit, (value) => save('weatherapp:unit', value));
