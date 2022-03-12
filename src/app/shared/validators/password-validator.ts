import TextValidator from "./text-validator";
import {ErrorType} from "../../model/error-type";

export default class PasswordValidator {

    static isValid(text: string): ErrorType[] {
        var errors: ErrorType[] = [];
        text = text.trim();
        if (!TextValidator.nonEmpty(text)) {
            errors.push(ErrorType.isRequired);
        } else if (TextValidator.longerThan(60, text)) {
            errors.push(ErrorType.textTooLong);
        } else if (TextValidator.shorterThan(6, text)) {
            errors.push(ErrorType.textTooShort);
        }
        if (!TextValidator.noSpaces(text)) {
            errors.push(ErrorType.cantHaveSpaces);
        }

        return errors;
    }

    static isValidAndVerified(text: string, verification: string): ErrorType[] {
        var errors = this.isValid(text);
        if (errors.length > 0) {
            return errors;
        }
        errors = this.isValid(verification);
        if (errors.length > 0) {
            return errors;
        }
        text = text.trim();
        verification = verification.trim();
        if (text != verification) {
            errors.push(ErrorType.badVerificationMatch);
        }
        return errors;
    }
}