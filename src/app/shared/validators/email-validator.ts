import TextValidator from "./text-validator";
import {ErrorType} from "../../model/error-type";

export default class EmailValidator {

    static isValid(text: string): ErrorType[] {
        var errors: ErrorType[] = [];
        text = text.trim();
        if (!TextValidator.nonEmpty(text)) {
            errors.push(ErrorType.isRequired);
        } else if (TextValidator.longerThan(60, text)) {
            errors.push(ErrorType.textTooLong);
        } else if (TextValidator.shorterThan(4, text)) {
            errors.push(ErrorType.textTooShort);
        }
        if (!TextValidator.noSpaces(text)) {
            errors.push(ErrorType.cantHaveSpaces);
        }

        if (errors.length > 0) {
            return errors;
        }

        if (!this.isValidEmail(text)) {
            errors.push(ErrorType.InvalidEmail);
        }
        return errors;
    }


    static isValidEmail(text: string): boolean {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
            return true;
        }
        return false;
    }
}