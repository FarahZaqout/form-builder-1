'use client';
import React from 'react';
import { frappeObject } from './object';
import { useForm, Controller } from 'react-hook-form';

interface Field {
    doctype: string;
    name: string;
    creation: string;
    modified: string;
    modified_by: string;
    owner: string;
    docstatus: number;
    parent: string;
    parentfield: string;
    parenttype: string;
    idx: number;
    fieldname: string;
    label: string;
    fieldtype: 'Text' | 'Number' | 'Email' | 'Date' | 'Select' | 'Checkbox' | 'TextArea' | 'Section Break'; //placeholder for phase 1
    options?: string;
    search_index: number;
    show_dashboard: number;
    hidden: number;
    set_only_once: number;
    allow_in_quick_entry: number;
    print_hide: number;
    report_hide: number;
    reqd: number;
    bold: number;
    in_global_search: number;
    collapsible: number;
    unique: number;
    no_copy: number;
    allow_on_submit: number;
    show_preview_popup: number;
    permlevel: number;
    ignore_user_permissions: number;
    columns: number;
    in_list_view: number;
    fetch_if_empty: number;
    in_filter: number;
    remember_last_selected_value: number;
    ignore_xss_filter: number;
    print_hide_if_no_value: number;
    allow_bulk_edit: number;
    in_standard_filter: number;
    in_preview: number;
    read_only: number;
    length: number;
    translatable: number;
    hide_border: number;
    hide_days: number;
    hide_seconds: number;
    non_negative: number;
    is_virtual: number;
    sort_options: number;
    fields: Field[];
    permissions: any[];  // Type as needed
    actions: any[];  // Type as needed
    links: any[];  // Type as needed
    states: any[];  // Type as needed
    search_fields?: string;  // Nullable if not always present
    is_custom_field?: boolean;  // Nullable if not always present
    linked_document_type?: string;  // Nullable if not always present
    default?: string;  // Optional for fields like 'Select'
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
    Text: ({ config }) => {
        return (
            <input onChange={config.onChange} type="text" name={config.name} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
        )
    },
    Number: ({ config }) => (
        <input onChange={config.onChange} type="number" name={config.name} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Email: ({ config }) => (
        <input onChange={config.onChange} type="email" name={config.name} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Date: ({ config }) => (
        <input onChange={config.onChange} type="date" name={config.name} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="input input-bordered w-full max-w-xs" />
    ),
    Select: ({ config }) => (
        <select onChange={config.onChange} name={config.name} required={Boolean(config.reqd)} className="select select-bordered w-full max-w-xs">
            {config.options?.split('\n').map((option, index) => <option key={index} value={option.trim()}>{option.trim()}</option>)}
        </select>
    ),
    Checkbox: ({ config }) => (
        <label className="label cursor-pointer">
            <input onChange={config.onChange} type="checkbox" name={config.name} checked={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="checkbox checkbox-primary" />
            {config.label}
        </label>
    ),
    TextArea: ({ config }) => (
        <textarea onChange={config.onChange} name={config.name} placeholder={config.label} required={Boolean(config.reqd)} readOnly={Boolean(config.read_only)} className="textarea textarea-bordered h-24 w-full" />
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
            fieldConfigurations[field.name] = {
                ...field,
                reqd: field.reqd,
                read_only: field.read_only,
                options: field.options
            };
            fieldConfigurations[field.name] = enhanceFieldConfig(fieldConfigurations[field.name]);
        });
    });
    
    return fieldConfigurations;
}

const ReactFieldRenderer = ({ control, config, customComponents = {} }: { control: any; config: Field; customComponents?: CustomComponents }): React.ReactElement | null => {
    const Component = customComponents[config.fieldtype] || DefaultComponents[config.fieldtype] || DefaultComponents.Text;

    return (
        <Controller
            name={config.name}
            control={control}
            defaultValue={config.default || ''}
            render={({ field }) => <Component {...field} config={config} />}
        />
    );
};

// @ts-ignore
const fieldConfigurations = createFieldConfig(frappeObject);

interface FormData {
    [key: string]: any;
}


const FormComponent: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    console.log({control})

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {Object.values(fieldConfigurations).map((field, index) => (
                <ReactFieldRenderer key={index} control={control} config={field} />
            ))}
            <button type="submit" className="btn">Submit</button>
        </form>
    );
};

export default FormComponent;
