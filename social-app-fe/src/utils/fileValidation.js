export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const validateFile = (file) => {
    if (!file) {
        return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return false;
    }

    if (file.size > MAX_FILE_SIZE) {
        return false;
    }

    return true;
};
