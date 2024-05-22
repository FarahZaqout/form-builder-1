'use client';
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
    [key: string]: React.ComponentType<{ config: EnhancedFieldConfig }>;
}

interface EnhancedFieldConfig extends Field {
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    // Additional handlers or attributes can be added here
}

const DefaultComponents: CustomComponents = {
    Text: ({ config }) => (
        <input type="text" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} onChange={config.onChange}  className="input input-bordered w-full max-w-xs" />
    ),
    Number: ({ config }) => (
        <input onChange={config.onChange} type="number" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Email: ({ config }) => (
        <input onChange={config.onChange} type="email" name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Date: ({ config }) => (
        <input onChange={config.onChange} type="date" name={config.name} required={config.required} readOnly={config.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Select: ({ config }) => (
        <select onChange={config.onChange} name={config.name} required={config.required} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map((option, index) => <option key={index} value={option.trim()}>{option.trim()}</option>)}
        </select>
    ),
    Checkbox: ({ config }) => (
        <label className="label cursor-pointer">
            <input onChange={config.onChange} type="checkbox" name={config.name} checked={config.required} readOnly={config.readOnly} className="checkbox checkbox-primary" />
            {config.label}
        </label>
    ),
    TextArea: ({ config }) => (
        <textarea onChange={config.onChange} name={config.name} placeholder={config.label} required={config.required} readOnly={config.readOnly} className="textarea textarea-bordered h-24 w-full" />
    )
};

function enhanceFieldConfig(field: Field): EnhancedFieldConfig {
    return {
        ...field,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => console.log(`${field.name} changed`, e.target.value),
        onFocus: () => console.log(`${field.name} focused`),
        onBlur: () => console.log(`${field.name} blurred`),
        // Special handling for select fields could go here
        ...(field.fieldtype === 'Select' && {
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                console.log(`${field.name} selected value`, e.target.value);
                // Additional logic for select fields
            }
        })
    };
}

export function createFieldConfig(formFields: FrappeObject): { [key: string]: EnhancedFieldConfig } {
    const fieldConfigurations: { [key: string]: Field } = {};

    formFields.docs.forEach(doc => {
        doc.fields.forEach(field => {
            console.log({required: field.required})
            fieldConfigurations[field.name] = {
                ...field,
                required: field.required,
                readOnly: field.readOnly,
                options: field.options
            };
            fieldConfigurations[field.name] = enhanceFieldConfig(fieldConfigurations[field.name]);
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
