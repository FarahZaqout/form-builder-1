// import React from 'react';
// import { frappeObject } from './object';

// interface Field {
//     name: string;
//     label?: string;
//     required: boolean;
//     readOnly: boolean;
//     options?: string;
//     fieldtype: 'Text' | 'Number' | 'Email' | 'Date' | 'Select' | 'Checkbox' | 'TextArea';
// }

// interface Document {
//     doctype: string;
//     name: string;
//     fields: Field[];
// }

// interface FrappeObject {
//     docs: Document[];
// }

// interface CustomComponents {
//     [key: string]: React.ComponentType<{ config: Field }>;
// }

// // todo: introduce typeguards
// // 2nd interface with specifics of each fieldtype


// const DefaultComponents: CustomComponents = {
//     Text: ({ config }) => (
//         <input type="text" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
//     ),
//     Number: ({ config }) => (
//         <input type="number" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
//     ),
//     Email: ({ config }) => (
//         <input type="email" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
//     ),
//     Date: ({ config }) => (
//         <input type="date" name={config.name} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
//     ),
//     Select: ({ config }) => (
//         <select name={config.name} required={config.required} className="select select-bordered w-full max-w-xs">
//             {config.options?.split('\n').map((option, index) => <option key={index} value={option.trim()}>{option.trim()}</option>)}
//         </select>
//     ),
//     Checkbox: ({ config }) => (
//         <label className="label cursor-pointer">
//             <input type="checkbox" name={config.name} checked={config.required} readOnly={config.readOnly} className="checkbox checkbox-primary" />
//             {config.label}
//         </label>
//     ),
//     TextArea: ({ config }) => (
//         <textarea name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="textarea textarea-bordered h-24 w-full" />
//     )
// };

// // take the frappe object and transform it into a simplified version.
// export function createFieldConfig(formFields: FrappeObject, relevantFields?: string): { [key: string]: Field } {
//     const fieldConfigurations: { [key: string]: Field } = {};

//     formFields.docs.forEach(doc => {
//         doc.fields.forEach(field => {
//             fieldConfigurations[field.name] = {
//                 ...field,
//                 required: field.required,
//                 readOnly: field.readOnly,
//                 options: field.options
//             };
//         });
//     });

//     return fieldConfigurations;
// }

// // todo: this is redundant. We can use the reactFieldRenderer directly. Remove it.
// export function renderForm(fieldsConfig: { [key: string]: Field }, renderFunction: (props: { config: Field }) => React.ReactElement | null) {
//     return Object.keys(fieldsConfig).map(fieldName => renderFunction({ config: fieldsConfig[fieldName] }));
// }

// // todo: each field should be wrapped into a component that has the field's specific functions/callback such as focus, blur...etc.
// // todo: create a function that attaches event handlers or state-relevant attributes such as focus/blurs...etc to each respective field. It should run over the field config and attach it to them.
// // todo: create a base validation function that generates validation rules for each form field. It should run over the field config and attach it to them.


// const ReactFieldRenderer = ({ config, customComponents = {} }: { config: Field; customComponents?: CustomComponents }): React.ReactElement | null => {
//     const Component = customComponents[config.fieldtype] || DefaultComponents[config.fieldtype] || DefaultComponents.Text;
//     return <Component config={config} />;
// };

// // @ts-ignore
// const fieldConfigurations = createFieldConfig(frappeObject);

// const FormComponent: React.FC = () => {
//     // useform (react hook form)
//     const formElements = renderForm(fieldConfigurations, ReactFieldRenderer);
//     return (
//         <form action={""}>
//             {formElements}
//             <button className="btn">Submit</button>
//         </form>
//     );
// };

// export default FormComponent;

import React from 'react';
import { frappeObject } from './object';

interface Field {
    name: string;
    label?: string;
    required: boolean;
    readOnly: boolean;
    options?: string;
    fieldtype: 'Text' | 'Number' | 'Email' | 'Date' | 'Select' | 'Checkbox' | 'TextArea';
}

interface Document {
    doctype: string;
    name: string;
    fields: Field[];
}

interface FrappeObject {
    docs: Document[];
}

interface CustomComponents {
    [key: string]: React.ComponentType<{ config: Field }>;
}

const DefaultComponents: CustomComponents = {
    Text: ({ config }) => (
        <input type="text" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Number: ({ config }) => (
        <input type="number" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Email: ({ config }) => (
        <input type="email" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Date: ({ config }) => (
        <input type="date" name={config.name} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Select: ({ config }) => (
        <select name={config.name} required={config.required} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map((option, index) => <option key={index} value={option.trim()}>{option.trim()}</option>)}
        </select>
    ),
    Checkbox: ({ config }) => (
        <label className="label cursor-pointer">
            <input type="checkbox" name={config.name} checked={config.required} readOnly={config.readOnly} className="checkbox checkbox-primary" />
            {config.label}
        </label>
    ),
    TextArea: ({ config }) => (
        <textarea name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="textarea textarea-bordered h-24 w-full" />
    )
};

export function createFieldConfig(formFields: FrappeObject): { [key: string]: Field } {
    const fieldConfigurations: { [key: string]: Field } = {};

    formFields.docs.forEach(doc => {
        doc.fields.forEach(field => {
            fieldConfigurations[field.name] = {
                ...field,
                required: field.required,
                readOnly: field.readOnly,
                options: field.options
            };
        });
    });

    return fieldConfigurations;
}

const ReactFieldRenderer = ({ config, customComponents = {} }: { config: Field; customComponents?: CustomComponents }): React.ReactElement | null => {
    const Component = customComponents[config.fieldtype] || DefaultComponents[config.fieldtype] || DefaultComponents.Text;
    return <Component config={config} />;
};

// @ts-ignore
const fieldConfigurations = createFieldConfig(frappeObject);

const FormComponent: React.FC = () => {
    return (
        <form>
            {Object.values(fieldConfigurations).map((field, index) => (
                <ReactFieldRenderer key={index} config={field} />
            ))}
            <button className="btn">Submit</button>
        </form>
    );
};

export default FormComponent;

