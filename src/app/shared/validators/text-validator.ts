export default class TextValidator {


    static longerThan(length: number, text: string): boolean {
        if (!this.nonEmpty(text)) {
            return false;
        }
        if (text.length > length) {
            return true;
        }
        return false;
    }

    static shorterThan(length: number, text: string): boolean {
        if (!this.nonEmpty(text)) {
            return true;
        }
        if (text.length < length) {
            return true;
        }
        return false;
    }

    static nonEmpty(text: string): boolean {
        if (!text || text.length == 0) {
            return false;
        }
        return true;
    }

    static noSpaces(text: string): boolean {
        if (text.indexOf(" ") >= 0) {
            return false;
        }
        return true;
    }

}