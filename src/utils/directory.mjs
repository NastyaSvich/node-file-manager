import {isAbsolute, dirname, resolve} from "path";

/**
 * Изменяет текущий директорий.
 *
 * @param targetPath - путь куда нужно перейти.
 */
export const changeDirectory = (targetPath) => {
    return process.chdir(getAbsolutePath(targetPath));
}

/**
 * Возвращает текущий директорий.
 */
export const getCurrentDirectory = () => {
    return process.cwd();
}

/**
 * Возвращает предыдущий (родительский) директорий.
 *
 * @param targetPath - текущий директорий.
 */
export const getPrevDirectory = (targetPath) => {
    return dirname(targetPath);
}

/**
 * Получить абсолютный путь до директории.
 *
 * @param targetPath - текущий директорий.
 */
export const getAbsolutePath = (targetPath) => {
    return isAbsolute(targetPath) ? targetPath : resolve(getCurrentDirectory(), targetPath);
}