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
    [key: string]: React.ComponentType<{ props: Field }>;
}

const DefaultComponents: CustomComponents = {
    Text: ({ props }) => (
        <input type="text" name={props.name} placeholder={props.label} required={props.required} readOnly={props.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Number: ({ props }) => (
        <input type="number" name={props.name} placeholder={props.label} required={props.required} readOnly={props.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Email: ({ props }) => (
        <input type="email" name={props.name} placeholder={props.label} required={props.required} readOnly={props.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Date: ({ props }) => (
        <input type="date" name={props.name} required={props.required} readOnly={props.readOnly} className="input input-bordered w-full max-w-xs" />
    ),
    Select: ({ props }) => (
        <select name={props.name} required={props.required} className="select select-bordered w-full max-w-xs">
            {props.options?.split('\n').map((option, index) => <option key={index} value={option.trim()}>{option.trim()}</option>)}
        </select>
    ),
    Checkbox: ({ props }) => (
        <label className="label cursor-pointer">
            <input type="checkbox" name={props.name} checked={props.required} readOnly={props.readOnly} className="checkbox checkbox-primary" />
            {props.label}
        </label>
    ),
    TextArea: ({ props }) => (
        <textarea name={props.name} placeholder={props.label} required={props.required} readOnly={props.readOnly} className="textarea textarea-bordered h-24 w-full" />
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

const ReactFieldRenderer = ({ props, customComponents = {} }: { props: Field; customComponents?: CustomComponents }): React.ReactElement | null => {
    const Component = customComponents[props.fieldtype] || DefaultComponents[props.fieldtype] || DefaultComponents.Text;
    return <Component props={props} />;
};

// @ts-ignore
const fieldConfigurations = createFieldConfig(frappeObject);

const FormComponent = ({customComponents}: {customComponents: CustomComponents}) => {
    return (
        <form action={""} onSubmit={e => e.preventDefault()}>
            {Object.values(fieldConfigurations).map((field, index) => (
                <ReactFieldRenderer key={index} props={field} customComponents={customComponents} />
            ))}
            <button className="btn">Submit</button>
        </form>
    );
};

export default FormComponent;
