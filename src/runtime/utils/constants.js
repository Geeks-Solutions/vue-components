export function scrollToFirstError(errors, prefix) {
    for (const key of Object.keys(errors)) {
        if (errors[key]) {
            const targetElement = document.getElementById(prefix ? prefix + key : key);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
            break;
        }
    }
}

export const languagesList = [
  { key: 'en', name: { en: 'English', fr: 'Anglais' } },
  { key: 'fr', name: { en: 'French', fr: 'Français' } },
  { key: 'es', name: { en: 'Spanish', fr: 'Espagnol' } },
  { key: 'pt', name: { en: 'Portuguese', fr: 'Portugais' } },
  { key: 'it', name: { en: 'Italian', fr: 'Italien' } },
  { key: 'el', name: { en: 'Greek', fr: 'Grec' } },
  { key: 'de', name: { en: 'German', fr: 'Allemand' } },
  { key: 'pl', name: { en: 'Polish', fr: 'Polonais' } },
  { key: 'ru', name: { en: 'Russian', fr: 'Russe' } },
  { key: 'ar', name: { en: 'Arabic', fr: 'Arabe' } },
  { key: 'zh', name: { en: 'Chinese', fr: 'Chinois' } },
  { key: 'ja', name: { en: 'Japanese', fr: 'Japonais' } },
  { key: 'fa', name: { en: 'Persian', fr: 'Perse' } },
  { key: 'hi', name: { en: 'Indian', fr: 'Indien' } }
]

export function hasValuesExcept(obj, excludeKey) {
  return Object.keys(obj).some(key => {
    // Skip the excluded key
    if (key === excludeKey) return false;

    // Check if the value is valid (not null, undefined, or an empty string)
    const value = obj[key];
    return value !== null && value !== undefined && value !== '';
  });
}

export function filterArrayByObjectValues(array, excludeKey) {
  return array.filter(obj => hasValuesExcept(obj, excludeKey));
}

export function isFileTypeSupported(fileData, supportedTypes) {
    const match = fileData.name.match(/\.[^.]+$/)
    const extension = match ? match[0].toLowerCase() : ''

    const supportedExtensions = supportedTypes.split(',').map(ext => ext.trim().toLowerCase())

    return !!supportedExtensions.includes(extension);
}