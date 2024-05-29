import { RegisterOptions } from 'react-hook-form';
import { VALIDATION_MESSAGES } from './constants';
import { ExtendedField } from './Types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // if we want to limit the upoload size. 5Mb right now.

// initial validation rules (placeholder).
export function generateValidationRules(field: ExtendedField): RegisterOptions {
    const rules: RegisterOptions = {
        required: field.reqd ? VALIDATION_MESSAGES.FIELD_REQUIRED : undefined
    };

    switch (field.fieldtype) {
        case 'Email':
            rules.pattern = {
                value: /^\S+@\S+\.\S+$/,
                message: VALIDATION_MESSAGES.EMAIL_INVALID
            };
            break;
        case 'Number':
            rules.min = {
                value: 1,
                message: VALIDATION_MESSAGES.NUMBER_INVALID
            };
            rules.max = {
                value: 10000000000000,
                message: VALIDATION_MESSAGES.NUMBER_INVALID
            };
            break;
        // case 'FileUpload':
        //     rules.validate = {
        //         size: files => (!files[0] || files[0].size < MAX_FILE_SIZE) || VALIDATION_MESSAGES.FILE_SIZE_LIMIT
        //     };
        //     break;
    }

    return rules;
}
