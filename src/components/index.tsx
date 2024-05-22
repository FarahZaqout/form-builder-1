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
        <form action={""} onSubmit={e => e.preventDefault()}>
            {Object.values(fieldConfigurations).map((field, index) => (
                <ReactFieldRenderer key={index} config={field} />
            ))}
            <button className="btn">Submit</button>
        </form>
    );
};

export default FormComponent;
